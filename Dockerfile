# ─────────────────────────────────────────
# Stage 1: builder
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_API_URL=https://operon-back-rocketmind.amvera.io

RUN npm run build


# ─────────────────────────────────────────
# Stage 2: production (статика через serve)
# ─────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]