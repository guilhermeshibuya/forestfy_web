FROM node:lts-alpine3.22

WORKDIR /app

RUN corepack enable

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . . 

EXPOSE 3000

CMD ["pnpm", "dev"]