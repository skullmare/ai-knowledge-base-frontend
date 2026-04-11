FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build