FROM node:6.2

COPY dist /app

WORKDIR /app/server
ENV NODE_ENV=production

RUN npm install

EXPOSE 8080
VOLUME /config

CMD ["node","app.js"]
