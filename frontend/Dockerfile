FROM node:18-alpine

WORKDIR /app

# Copy package metadata first for efficient caching
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm ci --silent --no-audit --prefer-offline

# Copy app sources
COPY frontend/ .

# Build the production bundle
RUN npm run build

# Serve static build using 'serve' via npx at runtime
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
