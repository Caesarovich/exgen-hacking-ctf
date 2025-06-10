# Multi-stage build for Bun application
FROM oven/bun:1-alpine AS builder

WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package.json bun.lockb* ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

# Copy source code and config files needed for build
COPY . .

# Build the application
RUN bun run build

# Production stage  
FROM oven/bun:1-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Ensure bun user owns the app directory for write permissions
RUN chown -R bun:bun /usr/src/app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies (Vinxi/SolidJS needs most deps at runtime)
RUN bun install --frozen-lockfile && \
    bun pm cache rm

# Copy built application and essential files from builder stage
COPY --from=builder /usr/src/app/.output ./.output
COPY --from=builder /usr/src/app/app.config.ts ./
COPY --from=builder /usr/src/app/drizzle.config.ts ./
COPY --from=builder /usr/src/app/drizzle ./drizzle
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/start.ts ./

EXPOSE 3000

# Use bun user for security
USER bun

CMD ["bun", "run", "start.ts"]