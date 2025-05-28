# dockerのインストール
curl https://get.docker.com | sh

# 最新の docker-compose-linux-x86_64 の URL を取得
url=$(curl -s https://api.github.com/repos/docker/compose/releases \
  | jq -r '.[0].assets[] | select(.name == "docker-compose-linux-x86_64") | .browser_download_url')

# 取得した URL を確認（デバッグ用）
echo "Downloading docker-compose from: $url"

# docker-compose をダウンロードして /usr/local/bin に配置
sudo curl -L "$url" -o /usr/local/bin/docker-compose

# 実行権限を付与
sudo chmod +x /usr/local/bin/docker-compose

# バージョン確認
docker-compose --version
