
# Stage 1: Development
FROM node:20-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma files
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Set NODE_ENV
ENV NODE_ENV=production

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Set port environment variable
ENV PORT=5000

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "dist/main.js"]


