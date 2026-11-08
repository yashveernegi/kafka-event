# One image for all services. docker-compose.yml picks which file each container runs.
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
