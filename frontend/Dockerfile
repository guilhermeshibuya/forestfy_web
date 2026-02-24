FROM node:lts-alpine3.22

WORKDIR /app

# RUN corepack enable && corepack prepare pnpm@latest --activate

# COPY package.json pnpm-lock.yaml ./

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "dev"]