#!/bin/bash
# Final steps to complete migration

set -e

NEW_SERVER="37.27.38.186"
SSH_USER="root"

echo "🔧 Completing migration setup..."

# Check if .env exists
if ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER "[ ! -f /root/kikuai-platform/.env ]"; then
    echo "⚠️  .env file not found. Please create it with CLOUDFLARE_API_TOKEN"
    echo ""
    echo "Run on server:"
    echo "  ssh root@$NEW_SERVER"
    echo "  cd /root/kikuai-platform"
    echo "  echo 'CLOUDFLARE_API_TOKEN=your_token_here' > .env"
    echo ""
    read -p "Press Enter after creating .env file..."
fi

echo "🚀 Building and starting services..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'EOF'
cd /root/kikuai-platform

# Build Caddy image
echo "Building Caddy image..."
docker compose build

# Start services
echo "Starting services..."
docker compose up -d

# Wait a bit for services to start
sleep 5

# Check status
echo ""
echo "Service status:"
docker compose ps

echo ""
echo "Caddy logs (last 20 lines):"
docker compose logs --tail=20 caddy

echo ""
echo "Uptime Kuma logs (last 20 lines):"
docker compose logs --tail=20 uptime-kuma
EOF

echo ""
echo "✅ Services started!"
echo ""
echo "Next steps:"
echo "1. Update DNS records in Cloudflare to point to: $NEW_SERVER"
echo "2. Test health endpoint: curl http://$NEW_SERVER/healthz"
echo "3. Test HTTPS after DNS propagation: curl https://kikuai.dev/healthz"
echo "4. Access Uptime Kuma: https://status.kikuai.dev (after DNS update)"

