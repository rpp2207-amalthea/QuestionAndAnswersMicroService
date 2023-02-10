FROM node:16.19.0

# Create a new directory for the app in the container
WORKDIR /sdc-qa-api

# Install app dependencies
COPY package*.json ./
# Running NPM install
RUN npm install --force

# Bundle apps's source dode inside the Docker image
COPY . .

#App binds to port 8080 so you have to expose to have it mapped by docker daemon
EXPOSE 8080

# command to run app
CMD ["node", "server/server.js"]