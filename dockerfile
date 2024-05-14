FROM node:18-alpine
RUN apk add --no-cache sqlite

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#EXPOSE 3000

CMD npm run start