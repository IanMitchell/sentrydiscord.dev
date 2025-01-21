FROM node:20-slim

WORKDIR /app

COPY . .

RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list.d/stretch.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client libssl1.1 && \
    apt-get clean && \
    rm -f /etc/apt/sources.list.d/stretch.list && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x docker-entrypoint.sh
RUN npm install

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
