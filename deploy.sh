#!/bin/bash

# Define variables
SERVER_IP='your-server-ip'
USERNAME='your-username'
DEST_DIR='/path/to/deploy/directory'
BUILD_DIR='dist'

# Build the project
yarn build

# Copy build files to the server
scp -r $BUILD_DIR $USERNAME@$SERVER_IP:$DEST_DIR

# SSH into the server and start the server
#pm2 restart server.js
ssh $USERNAME@$SERVER_IP << 'EOF'
  cd /path/to/deploy/directory
  yarn  # or yarn install if you are using Yarn
  node server.js
  # or use pm2 start server.js if it's not already running
  # Or you might use a simpler command like `node server.js` if not using PM2
EOF
