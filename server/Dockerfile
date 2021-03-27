FROM node:fermium-alpine AS build
RUN apk add --no-cache make gcc g++ python
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY ./*.json ./*.js ./
COPY src ./src
RUN npm run build

FROM node:fermium-alpine
WORKDIR /usr/app
COPY ./*.json ./*.js ./
RUN npm install --only=prod
COPY --from=build /usr/app/dist .
EXPOSE 8080
CMD ["node", "index,js"]
