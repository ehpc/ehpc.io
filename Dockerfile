FROM node:6.6.0

MAINTAINER ehpc@em42.ru

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

ENV NODE_ENV production
CMD ["npm", "start"]

EXPOSE 3000
