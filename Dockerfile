FROM node:8.12.0-alpine
RUN apk add --update alpine-sdk python-dev
ENV PORT=3205
# Prepare app directory
RUN ["npm", "--version"]
WORKDIR /usr/src/app
COPY package*.json ./
COPY . /usr/src/app

# Install dependencies

RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python

RUN npm install webpack -g
RUN npm install webpack-cli -g
RUN npm run build
RUN webpack

EXPOSE 3205:3205
CMD [ "node", "./dist/index.bundle.js" ]