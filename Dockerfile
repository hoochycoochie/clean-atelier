

# Base image
FROM node:22.13.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build
RUN npm run test


CMD [ "npm", "run", "start:dev" ]