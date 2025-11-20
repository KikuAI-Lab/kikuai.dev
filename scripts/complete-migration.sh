#!/bin/bash
# Complete migration script - will prompt for token if needed

set -e

NEW_SERVER="37.27.38.186"
SSH_USER="root"

echo "🚀 Completing migration to new server..."

# Step 1: Check if .env exists, create if not
echo "📝 Checking .env file..."
if ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER "[ ! -f /root/kikuai-platform/.env ]"; then
    echo "⚠️  .env file not found."
    echo ""
    echo "I need your Cloudflare API Token to complete the setup."
    echo "You can get it from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Required permissions: Zone DNS Edit for kikuai.dev"
    echo ""
    read -sp "Enter Cloudflare API Token (hidden): " TOKEN
    echo ""
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Token is required. Exiting."
        exit 1
    fi
    
    ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER "echo 'CLOUDFLARE_API_TOKEN=$TOKEN' > /root/kikuai-platform/.env && chmod 600 /root/kikuai-platform/.env"
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Step 2: Build Caddy image
echo ""
echo "🔨 Building Caddy image with Cloudflare DNS plugin..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'EOF'
cd /root/kikuai-platform
docker compose build caddy
EOF

# Step 3: Start services
echo ""
echo "🚀 Starting services..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'EOF'
cd /root/kikuai-platform
docker compose up -d

# Wait for services to start
sleep 10

# Check status
echo ""
echo "📊 Service status:"
docker compose ps

echo ""
echo "📋 Caddy logs (last 30 lines):"
docker compose logs --tail=30 caddy 2>&1 | tail -30

echo ""
echo "📋 Uptime Kuma logs (last 20 lines):"
docker compose logs --tail=20 uptime-kuma 2>&1 | tail -20
EOF

# Step 4: Test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$NEW_SERVER/healthz 2>/dev/null || echo "000")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health endpoint responding: HTTP $HEALTH_RESPONSE"
else
    echo "⚠️  Health endpoint returned: HTTP $HEALTH_RESPONSE"
    echo "   This might be normal if Caddy is still starting or DNS hasn't propagated"
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "📝 Next steps:"
echo "1. DNS records should point to: $NEW_SERVER"
echo "2. Wait for DNS propagation (5-30 minutes)"
echo "3. Test HTTPS: curl https://kikuai.dev/healthz"
echo "4. Access Uptime Kuma: https://status.kikuai.dev"
echo ""
echo "🔍 To check service status:"
echo "   ssh root@$NEW_SERVER 'cd /root/kikuai-platform && docker compose ps'"
echo ""
echo "📋 To view logs:"
echo "   ssh root@$NEW_SERVER 'cd /root/kikuai-platform && docker compose logs -f'"

