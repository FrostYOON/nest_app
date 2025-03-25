echo "Starting application: nestjs-app"

APP_DIR="/home/ec2-user/build"
APP_NAME="nestjs-app"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 빌드
cd $APP_DIR
npm install
npm run build

# pm2 사용하여 애플리케이션 시작
pm2 start dist/main.js --name $APP_NAME
pm2 status

echo "Application started successfully!!"