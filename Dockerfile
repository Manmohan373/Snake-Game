# Use an official Nginx image from the Docker Hub
FROM nginx:alpine

# Set the working directory to /usr/share/nginx/html (default location for static files in Nginx)
WORKDIR /usr/share/nginx/html

# Copy all the static files (HTML, CSS, JS) from your local 'frontend' directory to the Nginx container
COPY . .

# Expose port 80 for the web server
EXPOSE 80

# Nginx runs by default in the foreground, no CMD needed unless you need to configure it
CMD ["nginx", "-g", "daemon off;"]
