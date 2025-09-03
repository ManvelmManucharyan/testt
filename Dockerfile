FROM node:lts AS builder
ARG VITE_HR_BACKEND_URL
ARG VITE_TELEGRAM_BOT_USERNAME
USER 1000
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=1000 . .
ENV VITE_HR_BACKEND_URL=$VITE_HR_BACKEND_URL
ENV VITE_TELEGRAM_BOT_USERNAME=$VITE_TELEGRAM_BOT_USERNAME
RUN yarn install && yarn build


FROM caddy:latest
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /home/node/app/dist /srv
RUN chown 1000:1000 /usr/bin/caddy 