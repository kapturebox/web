# FROM partlab/ubuntu-arm-nodejs
FROM node:7

ADD dist /app

WORKDIR /app/server
ENV NODE_ENV=docker

EXPOSE 8080
VOLUME /config
# VOLUME /media

ENTRYPOINT ["nodejs","app.js"]
