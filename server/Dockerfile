# Backend Dockerfile for Ophthalmvision Application (Node.js)
FROM node:18.20.6

# Set working directory
WORKDIR /app

# Install essential Linux tools (for debugging and runtime checks)
RUN apt-get update && apt-get install -y \
    bash net-tools procps curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json & package-lock.json files first
COPY package*.json ./

# Install all dependencies (including swagger-ui-express)
RUN npm install && npm install -g nodemon

# Explicitly copy all project files (including subdirectories like 'config/')
COPY . .

# Expose backend server port
EXPOSE 9000

# Start backend application
CMD ["node", "server.js"]
