# Build stage
FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY package.json yarn.lock ./

# Use a clean yarnrc without the nixify plugin (Nix-only tooling)
RUN echo "nodeLinker: node-modules" > .yarnrc.yml

RUN yarn install --immutable

COPY tsconfig.json ./
COPY src ./src

RUN yarn build

# Production stage
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "dist/index.js"]
