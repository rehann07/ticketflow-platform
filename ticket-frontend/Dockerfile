# STAGE 1: Build the React App using Node
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code and build it
COPY . .
RUN npm run build

# STAGE 2: Serve the App using Nginx
FROM nginx:alpine

# Copy the built assets from Vite's 'dist' folder to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 🚀 REACT ROUTER FIX:
# Nginx doesn't understand React Router by default. If a user refreshes the page 
# on /dashboard, Nginx will throw a 404. This configuration tells Nginx to 
# redirect all unknown routes back to index.html so React can handle them.
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expose port 80 (Mapped to 3000 in your docker-compose.yml)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]