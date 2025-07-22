# 工学院大学新宿キャンパス　エレベーター案内システム

## 概要

新宿キャンパスのエレベーターを案内する。(階段もおまけで)

## 構想

### 動作の流れ(イメージ)

1. ユーザーは入力フォームに行きたい教室を入力
2. APIにgetリクエストする
3. サーバーは、getリクエストを元に利用可能な行き方をreturn
4. レスポンスを表示

### その他、実装予定の仕様

- [ ] 入室に学生証タッチが必要な教室はその旨を表示
- [x] EVだけじゃなくて階段情報も欲しい。
- [ ] 可能であれば、クソデカモバイルバッテリーの場所も欲しい

## 情報源

- フロアマップ：https://www.ceramic.or.jp/ig-nenkai/2019/program/map2019.pdf
- キャンパスマップ：https://www.kogakuin.ac.jp/campus/fbb28u0000005ate-att/20250401_kogakuinmap.pdf
- docker-composeインストール手順： https://qiita.com/kensukeyoshida/items/d6a735350f406961110f

## 構築等

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

### データベース仕様

- **routeDB**: MongoDBで管理（mongoose使用）
  - 初期データは `db/routeData.json` から自動読み込み
  - 30分ごとに自動的にJSONファイルに同期

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
