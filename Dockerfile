FROM node:20-alpine

WORKDIR /app

COPY . .

RUN chmod +x docker-entrypoint.sh

RUN npm install
RUN apk add --no-cache \
    bash \
    curl \
    postgresql-client \
    openssl3 \
    openssl3-dev \
    && npm install -g npm@latest

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
