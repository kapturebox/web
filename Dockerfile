FROM partlab/ubuntu-arm-nodejs

COPY dist /app

WORKDIR /app/server
ENV NODE_ENV=production

EXPOSE 8080
VOLUME /config

CMD ["nodejs","app.js"]
