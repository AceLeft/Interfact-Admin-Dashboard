# syntax=docker.io/docker/dockerfile:1

FROM node:22

WORKDIR /interfact-admin-dashboard
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev