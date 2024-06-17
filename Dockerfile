# https://hub.docker.com/_/node
FROM node:18

WORKDIR /usr/src/app

# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

RUN npm install

# Copy local code to the container image.
COPY . .

# Configure and document the service HTTP port.
EXPOSE 9000

# Run the web service on container startup.
CMD ["npm", "run", "start"]
