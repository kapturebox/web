# FROM partlab/ubuntu-arm-nodejs
FROM node:8

ADD dist /app

WORKDIR /app/server
ENV NODE_ENV=docker

EXPOSE 9000
VOLUME /config
# VOLUME /media

ENTRYPOINT ["node","app.js"]
HEALTHCHECK CMD curl -I localhost:9000
