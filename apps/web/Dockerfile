# Multi-stage production Dockerfile for Next.js 14 Frontend

# Step 1: Base builder
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies first (leverage layer cache)
COPY package.json package-lock.json* ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/web/package.json ./apps/web/

RUN npm ci

# Copy source assets
COPY . .

# Compile and build the Next.js client
RUN npx turbo run build --filter=web

# Step 2: Production runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node modules and compiled assets from builder stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/web/package.json ./apps/web/package.json
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/next.config.js ./apps/web/next.config.js
COPY --from=base /app/packages/ui ./packages/ui

EXPOSE 3000

# Run in production using the standard next start command
CMD ["npm", "run", "start", "--prefix", "apps/web"]
