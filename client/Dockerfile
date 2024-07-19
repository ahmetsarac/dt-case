# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS build

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local code to the container image.
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a production image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json to the container image.
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy built application from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./next.config.mjs

# Expose the port the app runs on
EXPOSE 3000

# Run the web service on container startup.
CMD ["npm", "start"]