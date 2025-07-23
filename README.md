# 工学院大学新宿キャンパス　エレベーター案内システム

## 概要

新宿キャンパスのエレベーターを案内する。(階段もおまけで)

## 動作の流れ

### 確認時の動作

1. `/`にユーザーがアクセスし、Web UIから教室番号を選択
2. `/search?room=<教室番号>`に遷移し、CGI側が教室番号からデータを取得して表示する

### 登録時の動作

1. `/report`にユーザーがアクセスし、必要な情報を全て入力し、送信ボタンを押す
2. `/api/routeDataSubmit`に対してPOSTリクエストを行い、経路情報が送信される
3. CGI側でデータの重複が無いか確認し、重複しそうならエラーを返す
4. CGI側でDBにデータを登録し、その後Discord webhookで新規データ登録を通知する
5. 登録に成功したら、その旨を表示して`/`に遷移する

## 実装予定の仕様

- [ ] 入室に学生証タッチが必要な教室はその旨を表示
- [x] EVだけじゃなくて階段情報も欲しい。
- [ ] 可能であれば、クソデカモバイルバッテリーの場所も欲しい

## 情報源

- フロアマップ：https://www.ceramic.or.jp/ig-nenkai/2019/program/map2019.pdf
- キャンパスマップ：https://www.kogakuin.ac.jp/campus/fbb28u0000005ate-att/20250401_kogakuinmap.pdf
- docker-composeインストール手順： https://qiita.com/kensukeyoshida/items/d6a735350f406961110f

## 使用技術

### npmライブラリと使用目的

- Node.js: CGIアプリケーションなどのエンジンとして使用
- Express: Webサーバ(CGI)のアプリケーションとして使用
- ejs: `/search`において容易にCGIからのデータを表示出来るようにするために使用
- MongoDB: 経路情報のデータベースとして使用
- dotenv: 環境変数(DBのURIと、DiscordのWebhook URL)を取得できるようにするために使用
- node-fetch: CGIからDiscordのWebhookに対してPOSTリクエストを行うために使用

### データベース仕様

- **routeDB**: MongoDBで管理（mongoose使用）
  - 初期データは `db/routeData.json` から自動読み込み
  - 30分ごとに自動的にJSONファイルに同期

## 各種URLの役割

- `/`: トップページ
- `/search`: 経路情報検索結果表示ページ
- `/report`: 経路情報報告フォーム
- `/api/roomData`: 教室情報取得(および教室番号確認)のAPIエンドポイント
- `/api/routeDataSubmit`: 経路情報登録用APIエンドポイント

## 構築手順

### 環境設定

1. `.env.example` を `.env` にコピーして、必要に応じて設定を変更
   ```bash
   cp .env.example .env
   ```

2. MongoDB接続設定（Docker Compose使用の場合は変更不要です。ローカルでDocker Composeを使用しない場合は適切なものに変更してください）
   ```
   MONGODB_URI=mongodb://localhost:27017/
   ```

### 起動手順

1. `sudo apt update`
2. `sudo apt upgrade -y`
3. nodejsやnpmをインストールした場合は`npm run build`、していない場合は次のコマンド実行すると、dockerの実行環境が構築される。
```
chmod +x build.sh
./build.sh
```
4. 起動する際は、nodejsやnpmをインストールした場合は`npm run start`、していない場合は次のコマンド実行すると、ローカルホストの80番ポートで起動する。
```
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### 停止・キャッシュクリア

1. 停止する場合は、nodejsやnpmをインストールした場合は`npm run stop`、していない場合は次のコマンド実行すると、アプリケーションが停止する。
```
sudo docker-compose down
```
2. 何回か起動や停止を繰り返すとdockerのキャッシュが膨大な量になってエラーが出るので、その際は、nodejsやnpmをインストールした場合は`npm run cacheClear`、していない場合は次のコマンド実行すると、dockerの実行環境が構築される。
```
chmod +x cacheClear.sh
./cacheClear.sh
```
