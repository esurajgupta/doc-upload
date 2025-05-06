FROM node:20-alpine AS build
# Create directory with proper permissions
RUN mkdir -p /usr/src/app
# Set proper permissions for npm cache and logs
RUN mkdir -p /.npm && \
    chmod -R 777 /.npm && \
    chown -R 1000740001:0 /usr/src && \
    chmod -R g=u /usr/src
# Set npm to use a writable location for the cache and logs
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV HOME=/tmp
ENV NODE_OPTIONS=--max-old-space-size=4096
# Switch to the non-root user
USER 1000740001
# Set working directory
WORKDIR /usr/src/app
# Copy package files with correct ownership
COPY --chown=1000740001:0 package*.json ./
# Copy the rest of the application with correct ownership
COPY --chown=1000740001:0 . .
# Install dependencies with proper npm config
RUN npm i --legacy-peer-deps --no-fund --loglevel=error
# Build the application
RUN npm run build
EXPOSE 8080
# Changed command to use the preview script from package.json
CMD ["npm", "run", "preview", "--", "--host", "--port", "8080"]