# FROM partlab/ubuntu-arm-nodejs
FROM node:8 AS build
LABEL builder=true

## build portion that we need to add to multi-stage build
COPY . /build
RUN  apt-get update \
  && apt-get install ruby ruby-dev -y \
  && npm install -g yarn grunt-cli bower \
  && gem install compass \
  && cd /build \
  && yarn \
  && bower install --allow-root \
  && grunt clean build:dist




FROM node:8

# some tools needed for a situation where we run a grunt serve in the container
# TODO: determine a better way to do this without including the pkgs
RUN npm install -g grunt-cli \
  && apt-get update \
  && apt-get install ruby ruby-dev -y \
  && gem install compass

COPY --from=build /build/dist /app

WORKDIR /app/server
ENV NODE_ENV=docker

EXPOSE 9000
VOLUME /config

HEALTHCHECK CMD curl -I localhost:9000

# other cmds are "grunt serve"
CMD ["node","app.js"]
