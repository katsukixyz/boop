# Base image
FROM node:18-alpine3.16

# Working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy project files
COPY . .

ENTRYPOINT ["pnpm", "run", "start:dev"]

# Expose port
EXPOSE 4673
