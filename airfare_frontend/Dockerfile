# Stage 1: Development
FROM node:20-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=development /usr/src/app/.next ./.next
COPY --from=development /usr/src/app/public ./public
COPY --from=development /usr/src/app/package.json ./package.json
COPY --from=development /usr/src/app/next.config.* ./

# Expose frontend port
EXPOSE 5000

# Start Next.js
CMD ["npm", "start"]
