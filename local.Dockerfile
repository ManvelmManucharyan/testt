FROM node:lts

WORKDIR /app

COPY package.json package-lock.json ./

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "serve", "--", "host"]
