FROM node:20-slim

WORKDIR /app

COPY . .

RUN chmod +x docker-entrypoint.sh

RUN npm install
RUN apt update && apt install -y postgresql-client

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
