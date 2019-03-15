FROM node:9.4.0-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN apk add --no-cache make gcc g++ python && \
    npm install -qy && \
    apk del make gcc g++ python 

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
