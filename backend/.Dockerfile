# Dockerfile.backend

FROM node:18

# Set working directory
WORKDIR /app

# Copy backend source files
COPY . . 
RUN npm install

# Expose the API port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]