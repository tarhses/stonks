FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json .
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD ["node", "src/server/main.js"]
