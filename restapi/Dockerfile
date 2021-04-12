FROM node:12.14.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#In this case, the mongodb in memory dependency is quite heavy so we avoid it for the docker image
RUN npm install --production

#By default this is the address of the mongo container. If we are deploying to heroku we will get
#a mongo_uri here direct from github secrets (check .github/worflow/radarin.yml)
ARG MONGO_URI="mongodb://127.0.0.1:5050"
ENV MONGO_URI=$MONGO_URI

ARG DEPLOY="false"
ENV DEPLOY=$DEPLOY

ARG HTTPS_PASS=""
ENV HTTPS_PASS=%HTTPS_PASS
ARG HTTPS_KEY=""
ENV HTTPS_KEY=$HTTPS_KEY
ARG HTTPS_CERT=""
ENV HTTPS_CERT=$HTTPS_CERT

# Bundle app source
COPY *.js ./

CMD [ "node", "server.js" ]