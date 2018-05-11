# BUILD IMAGE
FROM node:9 AS build
LABEL builder=true
ENV NODE_ENV=development

## build portion that we need to add to multi-stage build
WORKDIR /build
COPY . /build
RUN  apt-get update \
  && apt-get install ruby ruby-dev devscripts debhelper build-essential -y \
  && npm install -g grunt-cli bower \
  && gem install compass \
  && yarn \
  && bower install --allow-root \
  && grunt clean build:dist

CMD ["grunt", "serve"]
HEALTHCHECK CMD curl -I localhost:9000



# DIST IMAGE
# FROM partlab/ubuntu-arm-nodejs  # (for arm systems)
FROM node:9 AS dist

COPY --from=build /build/dist /app
COPY --from=build /build/package.json /app

WORKDIR /app/server
ENV NODE_ENV=docker

EXPOSE 9000

RUN yarn --production

CMD ["node","app.js"]
HEALTHCHECK CMD curl -I localhost:9000
