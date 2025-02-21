# Use Node.js for building the Next.js app
FROM node:18 AS builder
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# Use Node.js for running the Next.js server
FROM node:18-alpine
WORKDIR /app

# Copy the built Next.js app from the builder stage
COPY --from=builder /app ./

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "dev"]
