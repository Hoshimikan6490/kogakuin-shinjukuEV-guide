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

## 起動方法
frontendとbackendのそれぞれのディレクトリで、
```
npm run dev
```
をする事。