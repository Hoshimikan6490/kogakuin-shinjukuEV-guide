#!/bin/bash

# Docker Compose の全サービス停止・削除
sudo docker-compose down --volumes --remove-orphans

# ビルドキャッシュ削除
sudo docker builder prune -af

# 未使用ネットワーク削除
sudo docker network prune -f

# 未使用ボリューム削除
sudo docker volume prune -f

# 未使用イメージ削除
sudo docker image prune -af

echo "Docker Compose のキャッシュをすべて削除しました。"