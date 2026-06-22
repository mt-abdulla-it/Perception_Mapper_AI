# Multi-stage production Dockerfile for NestJS backend API

# Step 1: Base builder
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

RUN npm ci

# Copy source assets
COPY . .

# Compile and build the NestJS server
RUN npx turbo run build --filter=api

# Step 2: Production runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy compiled files and dependencies from builder stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/package.json ./apps/api/package.json

EXPOSE 3001

# Execute NestJS entry point directly
CMD ["node", "apps/api/dist/main.js"]
