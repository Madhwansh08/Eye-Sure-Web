# Stage 1: Build React application
FROM node:22.14.0 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies like Vite)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate static build files in 'dist'
RUN npm run build

# Stage 2: Serve static files using a lightweight HTTP server
FROM node:20.18.3

# Install serve globally (simple static file server)
RUN npm install -g serve

# Copy build files from the build stage
COPY --from=builder /app/dist /build

# Expose port explicitly required (5173)
EXPOSE 5173

# Start static server to serve 'dist' directory
CMD ["serve", "-s", "/build", "-l", "5173"]