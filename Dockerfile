# Stage 1: Build client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Prepare server
FROM node:18-alpine AS server-builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY server/ ./server/
COPY scripts/ ./scripts/
COPY --from=client-builder /app/client/dist ./dist

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app

# Create non-root user and change ownership
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

COPY --from=server-builder --chown=nextjs:nodejs /app .

# No longer need uploads directory since we're using Cloudinary

USER nextjs

EXPOSE 5000
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
