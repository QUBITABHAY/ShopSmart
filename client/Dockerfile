# Build Stage
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code and build
COPY . ./
RUN npm run build

# Server Stage
FROM nginx:alpine

# Remove default nginx config to avoid conflict
RUN rm /etc/nginx/conf.d/default.conf

# Add custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA over to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
