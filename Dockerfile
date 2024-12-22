FROM node:18.16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install @tensorflow/tfjs-node versi 3.21.1
RUN npm install @tensorflow/tfjs-node@3.21.1

# Copy the rest of the application code
COPY . .

# Copy the service account key
COPY src/server/bucket_service_key.json /usr/src/app/src/server/bucket_service_key.json

# Set environment variable for Google Application Credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/src/server/bucket_service_key.json

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "src/server/server.js"]