#!/bin/bash

# Docker Compose の全サービス停止・削除
docker-compose down --volumes --remove-orphans

# ビルドキャッシュ削除
docker-builder prune -af

# 未使用ネットワーク削除
docker-network prune -f

# 未使用ボリューム削除
docker-volume prune -f

echo "Docker Compose のキャッシュをすべて削除しました。"