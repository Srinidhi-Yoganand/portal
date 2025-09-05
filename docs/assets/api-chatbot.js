(() => {
    const API_URL = window.CHATBOT_API || 'http://127.0.0.1:5000/api/chat';

    // Create minimal UI
    const style = document.createElement('style');
    style.textContent = `
      .mini-chat { position: fixed; right: 20px; bottom: 20px; z-index: 1000; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
      .mini-chat__toggle { background:#1C64F2; color:#fff; border:none; border-radius:24px; padding:10px 14px; cursor:pointer; box-shadow:0 6px 16px rgba(28,100,242,.3); }
      .mini-chat__panel { display:none; position:absolute; right:0; bottom:52px; width:320px; height:420px; background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,.15); overflow:hidden; }
      .mini-chat__panel.open { display:flex; flex-direction:column; }
      .mini-chat__messages { flex:1; padding:12px; overflow:auto; background:#f8fafc; }
      .mini-chat__msg { margin:8px 0; max-width:85%; padding:8px 10px; border-radius:12px; font-size:14px; line-height:1.35; }
      .mini-chat__msg.user { margin-left:auto; background:#1C64F2; color:#fff; border-bottom-right-radius:6px; }
      .mini-chat__msg.bot { margin-right:auto; background:#fff; color:#0f172a; border:1px solid #e5e7eb; border-bottom-left-radius:6px; }
      .mini-chat__input { display:flex; gap:8px; padding:10px; border-top:1px solid #e5e7eb; background:#fff; }
      .mini-chat__input input { flex:1; border:1px solid #e5e7eb; border-radius:20px; padding:10px 12px; font-size:14px; outline:none; }
      .mini-chat__input button { background:#1C64F2; color:#fff; border:none; border-radius:18px; padding:8px 12px; cursor:pointer; }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.className = 'mini-chat';
    root.innerHTML = `
      <button class="mini-chat__toggle" aria-expanded="false">Chat</button>
      <div class="mini-chat__panel" role="dialog" aria-label="Chatbot">
        <div class="mini-chat__messages" id="mini-chat-messages"></div>
        <div class="mini-chat__input">
          <input id="mini-chat-input" type="text" placeholder="Ask something..." />
          <button id="mini-chat-send">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const toggle = root.querySelector('.mini-chat__toggle');
    const panel = root.querySelector('.mini-chat__panel');
    const input = root.querySelector('#mini-chat-input');
    const sendBtn = root.querySelector('#mini-chat-send');
    const messagesEl = root.querySelector('#mini-chat-messages');

    const history = [];

    function addMessage(text, sender) {
      const el = document.createElement('div');
      el.className = `mini-chat__msg ${sender}`;
      el.textContent = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
      const text = (input.value || '').trim();
      if (!text) return;
      addMessage(text, 'user');
      history.push({ role: 'user', content: text });
      input.value = '';

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history })
        });
        const data = await res.json();
        const reply = data && data.reply ? String(data.reply) : 'No response';
        addMessage(reply, 'bot');
        history.push({ role: 'assistant', content: reply });
      } catch (e) {
        addMessage('Error contacting chat API.', 'bot');
      }
    }

    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) setTimeout(() => input.focus(), 50);
    });
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
  })();


