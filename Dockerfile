# ─────────────────────────────────────────
# Stage 1: builder
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Переменные Vite подставляются в код на этапе сборки,
# поэтому адрес backend задаётся аргументом сборки, а не в рантайме.
ARG VITE_API_URL=https://back-operon123.amvera.io
ENV VITE_API_URL=$VITE_API_URL

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