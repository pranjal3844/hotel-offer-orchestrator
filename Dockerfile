
# Use Node.js 24 as the base image
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the remaining project files
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Application listens on port 3000
EXPOSE 3000

# Start the Express server
CMD ["npm", "start"]
