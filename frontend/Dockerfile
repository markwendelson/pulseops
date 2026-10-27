# ==========================================
# Stage 1: Build Stage (Node 20 Alpine)
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Build-time environment variables for Vite
# Defaults to relative '/api' so Nginx reverse-proxies to the backend container automatically
ARG VITE_USE_MOCKS=false
ARG VITE_API_BASE_URL=/api
ARG VITE_TELEMETRY_REFRESH_INTERVAL=10000
ARG VITE_APP_TITLE=PulseOps
ARG VITE_APP_ENV=production

ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TELEMETRY_REFRESH_INTERVAL=$VITE_TELEMETRY_REFRESH_INTERVAL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_ENV=$VITE_APP_ENV

# Install dependencies using layer caching
COPY package*.json ./
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production Web Server (Nginx Alpine)
# ==========================================
FROM nginx:stable-alpine AS final

# Copy custom Nginx SPA + reverse proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
