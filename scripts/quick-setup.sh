#!/bin/bash
# Quick setup - assumes token will be provided via environment or argument

NEW_SERVER="37.27.38.186"
SSH_USER="root"
TOKEN="${CLOUDFLARE_API_TOKEN:-$1}"

if [ -z "$TOKEN" ]; then
    echo "❌ Cloudflare API Token required"
    echo ""
    echo "Usage:"
    echo "  CLOUDFLARE_API_TOKEN=your_token ./scripts/quick-setup.sh"
    echo "  OR"
    echo "  ./scripts/quick-setup.sh your_token"
    echo ""
    echo "Get token from: https://dash.cloudflare.com/profile/api-tokens"
    exit 1
fi

echo "🔑 Setting up .env..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER \
    "echo 'CLOUDFLARE_API_TOKEN=$TOKEN' > /root/kikuai-platform/.env && chmod 600 /root/kikuai-platform/.env"

echo "🔨 Building Caddy..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER \
    "cd /root/kikuai-platform && docker compose build caddy"

echo "🚀 Starting services..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'REMOTE'
cd /root/kikuai-platform
docker compose up -d
sleep 15
echo ""
echo "Service status:"
docker compose ps
echo ""
echo "Caddy logs (last 20 lines):"
docker compose logs --tail=20 caddy
REMOTE

echo ""
echo "✅ Setup complete!"
echo "Test: curl http://$NEW_SERVER/healthz"
