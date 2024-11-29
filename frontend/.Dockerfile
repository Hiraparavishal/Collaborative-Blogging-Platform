# Dockerfile.frontend

# Use Node.js image for building and running React app
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY . . 
RUN npm install


# Expose development server port
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]
