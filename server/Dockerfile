FROM node:8

# Add everything in the current directory to our image, in the 'app' folder.
ADD . /app

# Install dependencies
RUN cd /app; \  
    npm install --production

# Expose our server port.
EXPOSE 4201

# Run our app.
# wait for db is up
CMD ["node", "/app/index.js"]
