# 工学院大学新宿キャンパス　エレベーター案内システム
## 概要
新宿キャンパスのエレベーターを案内する。(階段もおまけで)

## 構想
### 動作の流れ(イメージ)
1. ユーザーは入力フォームに行きたい教室を入力
2. APIにgetリクエストする
3. サーバーは、getリクエストを元に利用可能な行き方をreturn
4. レスポンスを表示
### その他仕様
- 入室に学生証タッチが必要な教室はその旨を表示
- EVだけじゃなくて階段情報も欲しい。
- 可能であれば、クソデカモバイルバッテリーの場所も欲しい

## 情報源
- フロアマップ：https://www.ceramic.or.jp/ig-nenkai/2019/program/map2019.pdf
- キャンパスマップ：https://www.kogakuin.ac.jp/campus/fbb28u0000005ate-att/20250401_kogakuinmap.pdf
- docker-composeインストール手順： https://qiita.com/kensukeyoshida/items/d6a735350f406961110f

## 構築方法
1. `sudo apt update`
2. `sudo apt upgrade -y`
3. `sudo curl -L https://github.com/docker/compose/releases/download/vバージョン番号/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose`を実行するが、バージョン番号は、[このページ](https://github.com/docker/compose/releases)の最新版を使用する事。
4. `sudo chmod +x /usr/local/bin/docker-compose`
5. `sudo docker-compose build --no-cache`
6. `sudo docker-compose up -d`

