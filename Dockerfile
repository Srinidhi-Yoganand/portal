FROM python:3.10-slim AS builder

WORKDIR /app

RUN pip install mkdocs mkdocs-material

COPY mkdocs.yml .
COPY docs ./docs

RUN mkdocs build --site-dir /site

FROM nginx:alpine

COPY --from=builder /site /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]