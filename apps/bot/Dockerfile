FROM node:17

RUN apt update && apt install build-essential -y

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]
