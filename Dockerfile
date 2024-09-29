FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma migrate deploy

RUN npx browserslist@latest --update-db \
    && npm run build

EXPOSE 3000

CMD  ["npm","run","start"]
