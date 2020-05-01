FROM node:10.16-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn","start"]