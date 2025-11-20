#!/bin/bash
# Quick setup script - pass token as argument

if [ -z "$1" ]; then
    echo "Usage: $0 <cloudflare_api_token>"
    echo ""
    echo "Get your token from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Required permissions: Zone DNS Edit for kikuai.dev"
    exit 1
fi

TOKEN="$1"
NEW_SERVER="37.27.38.186"
SSH_USER="root"

echo "🔑 Setting up .env file..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER "echo 'CLOUDFLARE_API_TOKEN=$TOKEN' > /root/kikuai-platform/.env && chmod 600 /root/kikuai-platform/.env"

echo "🔨 Building and starting services..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'REMOTE'
cd /root/kikuai-platform
docker compose build
docker compose up -d
sleep 10
docker compose ps
echo ""
echo "Caddy logs:"
docker compose logs --tail=20 caddy
REMOTE

echo ""
echo "✅ Setup complete! Services should be running."
