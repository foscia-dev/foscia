FROM node:22-alpine as dependencies

RUN apk update && apk add --no-cache zip git curl

RUN npm install -g corepack@latest
RUN corepack use pnpm@latest

COPY entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

FROM dependencies as node

CMD ["sh"]

FROM node as docs

CMD ["pnpm", "start"]

HEALTHCHECK --retries=60 --interval=5s --timeout=5s CMD ["curl", "-f", "http://localhost:3000"]
