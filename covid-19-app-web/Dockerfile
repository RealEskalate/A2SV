From node:13-slim

WORKDIR /web


ADD . /web

RUN npm install
RUN npm run build
CMD node server.js