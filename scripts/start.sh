# start.sh

#!/bin/bash
APP_DIR="/home/ec2-user/build"
APP_NAME="nestjs-app"

echo "Starting application: $APP_NAME"

cd $APP_DIR

pm2 stop $APP_NAME
pm2 start dist/main.js --name $APP_NAME

echo "Application started successfully!!"