# BUILD IMAGE
FROM node AS build
LABEL builder=true
ENV NODE_ENV=development

## build portion that we need to add to multi-stage build
WORKDIR /build

RUN  apt-get update \
  && apt-get install ruby ruby-dev devscripts debhelper build-essential -y \
  && npm install -g grunt-cli bower \
  && gem install compass

COPY package.json package-lock.json /build/
RUN  npm install

COPY bower.json .bowerrc /build/
RUN  bower install --allow-root

COPY . /build
RUN grunt clean build:dist

CMD ["npm", "run", "serve"]
HEALTHCHECK CMD curl -I localhost:8080



# DIST IMAGE
# FROM partlab/ubuntu-arm-nodejs  # (for arm systems)
FROM node AS dist

COPY --from=build /build/dist /app
COPY --from=build /build/package.json /app

WORKDIR /app/server
ENV NODE_ENV=docker

EXPOSE 8080

RUN npm install --production

CMD ["node","app.js"]
HEALTHCHECK CMD curl -I localhost:8080
