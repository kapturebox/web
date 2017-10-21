# BUILD IMAGE
FROM node:8 AS build
LABEL builder=true
ENV NODE_ENV=docker

## build portion that we need to add to multi-stage build
WORKDIR /build
COPY . /build
RUN  apt-get update \
  && apt-get install ruby ruby-dev -y \
  && npm install -g yarn grunt-cli bower \
  && gem install compass \
  && cd /build \
  && yarn \
  && bower install --allow-root \
  && grunt clean build:dist



# DIST IMAGE
# FROM partlab/ubuntu-arm-nodejs  # (for arm systems)
FROM node:8

COPY --from=build /build/dist /app

WORKDIR /app/server
ENV NODE_ENV=production

EXPOSE 9000

CMD ["node","app.js"]
HEALTHCHECK CMD curl -I localhost:9000
