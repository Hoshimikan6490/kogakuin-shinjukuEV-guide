FROM node:latest

# 作業ディレクトリを設定
WORKDIR /home/ubuntu/app

# アプリケーションの依存関係をインストールする
# package.jsonをコピーする
COPY package.json ./
COPY . .

RUN npm install --omit=dev
EXPOSE 80
CMD [ "npm", "run", "main" ]