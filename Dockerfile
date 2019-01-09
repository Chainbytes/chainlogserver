FROM ubuntu:16.04
RUN apt-get update
RUN apt-get -y install curl python-software-properties
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get -y install libtool pkg-config build-essential nodejs autoconf automake uuid-dev wget python git

WORKDIR /
RUN git clone git://github.com/jedisct1/libsodium.git
WORKDIR /libsodium
RUN ./autogen.sh
RUN ./configure && make check
RUN make install
RUN ldconfig

WORKDIR /
RUN wget -q https://github.com/zeromq/libzmq/releases/download/v4.2.2/zeromq-4.2.2.tar.gz
RUN tar -xzvf zeromq-4.2.2.tar.gz
WORKDIR /zeromq-4.2.2
RUN ./configure
RUN make install & ldconfig
RUN mkdir -p /usr/src/app


WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN rm -rf node_modules
RUN apt-get update -qq
ENV PORT=3205

RUN npm install webpack -g
RUN npm install webpack-cli -g
ENV BINDING = "tcp://localhost:60400"
COPY . /usr/src/app

RUN npm install
RUN npm run build
EXPOSE 60400:60400
CMD [ "node", "./dist/index.bundle.js" ]