# Base image for Node.js environment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml for efficient caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .


# Start the React development server
CMD ["pnpm", "run", "dev", "--host"]

EXPOSE 5173