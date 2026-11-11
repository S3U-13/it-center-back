# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.13.0

################################################################################
# Base stage
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

################################################################################
# Dependencies stage (production dependencies)
FROM base AS deps
# ติดตั้ง build tools สำหรับ compile native addons เช่น bcrypt บน Alpine
RUN apk add --no-cache python3 make g++

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Build stage
FROM deps AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

################################################################################
# Final runtime stage
FROM base AS final
ENV NODE_ENV=production

# Copy files พร้อมกำหนด ownership ให้กับ user node
COPY --chown=node:node package.json .
COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# Copy โฟลเดอร์ keys เพื่อให้ authMiddleware อ่าน public.pem ได้
COPY --chown=node:node keys ./keys

USER node

EXPOSE 3002

# รัน node ตรงๆ เพื่อให้รับ shutdown signals (SIGTERM/SIGINT) ได้อย่างถูกต้อง
CMD ["node", "dist/server.js"]
