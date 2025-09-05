from __future__ import annotations

import os
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

# Optional: dotenv for local dev
try:
	from dotenv import load_dotenv  # type: ignore
	load_dotenv()
except Exception:
	pass

# Choose provider via env
# PROVIDER=openai|azure|dify
PROVIDER = (os.getenv("PROVIDER") or "openai").lower()

# Lazy client to avoid import cost if unused
_openai_client = None

def _get_openai_client():
	global _openai_client
	if _openai_client is None:
		if PROVIDER == "azure":
			# Azure OpenAI via OpenAI SDK
			from openai import AzureOpenAI  # type: ignore
			_openai_client = AzureOpenAI(
				api_key=os.environ["AZURE_OPENAI_API_KEY"],
				api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-06-01"),
				azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
			)
		else:
			from openai import OpenAI  # type: ignore
			_openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
	return _openai_client


# Dify configuration
DIFY_BASE_URL = (os.getenv("DIFY_BASE_URL") or "https://dify.dev.maersk-digital.net").rstrip("/")
DIFY_API_KEY = os.getenv("DIFY_API_KEY") or ""


async def _call_dify_chat(message: str, history: Optional[List[dict]] = None) -> str:
	"""Call Dify chat-messages API and return assistant answer."""
	if not DIFY_API_KEY:
		return "Dify backend not configured (missing DIFY_API_KEY)."

	payload = {
		"inputs": {},
		"query": message,
		"response_mode": "blocking",
		"user": "portal-user",
	}

	headers = {
		"Authorization": f"Bearer {DIFY_API_KEY}",
		"Content-Type": "application/json",
	}

	url = f"{DIFY_BASE_URL}/v1/chat-messages"
	async with httpx.AsyncClient(timeout=30.0) as client:
		resp = await client.post(url, headers=headers, json=payload)
		resp.raise_for_status()
		data = resp.json()
		return data.get("answer") or ""

# Model names
MODEL = os.getenv("MODEL", "gpt-4o-mini")
AZURE_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o-mini")

app = FastAPI()

# Allow docs site to call API during local dev and simple hosting
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


class ChatRequest(BaseModel):
	message: str
	history: Optional[List[dict]] = None  # [{"role":"user|assistant","content":"..."}]


class ChatResponse(BaseModel):
	reply: str


@app.get("/healthz")
async def healthz():
	return {"ok": True}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):

	# Build messages with a helpful system prompt grounded in docs purpose
	messages = [
		{ "role": "system", "content": (
			"You are PIPE Team Assistant, a helpful DevOps assistant for the Maersk documentation portal. "
			"Answer concisely and reference CI/CD, Kubernetes, Terraform, and monitoring practices where relevant."
		)},
	]

	# Optional history passthrough (trim to last 12 messages)
	if req.history:
		for m in req.history[-12:]:
			role = m.get("role") or ("assistant" if m.get("sender") == "bot" else "user")
			content = m.get("content") or m.get("text") or ""
			if content:
				messages.append({"role": role, "content": content})

	messages.append({"role": "user", "content": req.message})

	# Call provider
	if PROVIDER == "dify":
		reply = await _call_dify_chat(req.message, req.history)
	else:
		client = _get_openai_client()
		if PROVIDER == "azure":
			resp = client.chat.completions.create(
				model=AZURE_DEPLOYMENT,
				messages=messages,
			)
			reply = resp.choices[0].message.content
		else:
			resp = client.chat.completions.create(
				model=MODEL,
				messages=messages,
			)
			reply = resp.choices[0].message.content

	return {"reply": reply or ""}


# Dev entrypoint: uvicorn server:app --host 127.0.0.1 --port 5000
if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app, host="127.0.0.1", port=5000)
