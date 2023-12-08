FROM node:lts-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of your app's source code
COPY . .

# Switch to non-root user
USER node

CMD ["npm", "run", "start"]