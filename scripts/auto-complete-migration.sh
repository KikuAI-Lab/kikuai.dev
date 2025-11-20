#!/bin/bash
# Auto-complete migration - tries all methods to get token

set -e

NEW_SERVER="37.27.38.186"
SSH_USER="root"
TOKEN=""

echo "🔍 Searching for Cloudflare API Token..."

# Method 1: Environment variable
if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    TOKEN="$CLOUDFLARE_API_TOKEN"
    echo "✅ Found token in environment variable"
fi

# Method 2: Command line argument
if [ -z "$TOKEN" ] && [ -n "$1" ]; then
    TOKEN="$1"
    echo "✅ Using token from command line"
fi

# Method 3: Check if already set on server
if [ -z "$TOKEN" ]; then
    EXISTING=$(ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER \
        "grep CLOUDFLARE_API_TOKEN /root/kikuai-platform/.env 2>/dev/null | cut -d'=' -f2" || echo "")
    if [ -n "$EXISTING" ] && [ "$EXISTING" != "your_cloudflare_api_token_here" ]; then
        TOKEN="$EXISTING"
        echo "✅ Found existing token on server"
    fi
fi

# If still no token, we need user input
if [ -z "$TOKEN" ]; then
    echo ""
    echo "⚠️  Token not found automatically."
    echo ""
    echo "The token is stored in GitHub Secrets but cannot be retrieved directly."
    echo "Please provide it:"
    echo ""
    echo "Option 1: Get from GitHub (requires repo access):"
    echo "  https://github.com/KikuAI-Lab/kikuai.dev/settings/secrets/actions"
    echo ""
    echo "Option 2: Create new token:"
    echo "  https://dash.cloudflare.com/profile/api-tokens"
    echo "  Permissions: Zone DNS Edit for kikuai.dev"
    echo ""
    read -sp "Enter Cloudflare API Token: " TOKEN
    echo ""
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Token required. Exiting."
        echo ""
        echo "You can also run:"
        echo "  CLOUDFLARE_API_TOKEN=your_token ./scripts/auto-complete-migration.sh"
        echo "  OR"
        echo "  ./scripts/quick-setup.sh your_token"
        exit 1
    fi
fi

# Setup .env
echo "📝 Creating .env file..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER \
    "echo 'CLOUDFLARE_API_TOKEN=$TOKEN' > /root/kikuai-platform/.env && chmod 600 /root/kikuai-platform/.env"

# Build and start
echo "🔨 Building Caddy image..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER \
    "cd /root/kikuai-platform && docker compose build caddy 2>&1 | tail -10"

echo "🚀 Starting services..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'REMOTE'
cd /root/kikuai-platform
docker compose up -d
sleep 20
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "📋 Caddy Logs (last 30 lines):"
docker compose logs --tail=30 caddy 2>&1 | tail -30
echo ""
echo "📋 Uptime Kuma Logs (last 10 lines):"
docker compose logs --tail=10 uptime-kuma 2>&1 | tail -10
REMOTE

# Test
echo ""
echo "🏥 Testing health endpoint..."
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$NEW_SERVER/healthz 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health endpoint: HTTP $HTTP_CODE"
else
    echo "⚠️  Health endpoint: HTTP $HTTP_CODE (may be normal if still starting)"
fi

echo ""
echo "✅ Migration setup complete!"
echo ""
echo "Next:"
echo "1. DNS should point to: $NEW_SERVER"
echo "2. Wait for DNS propagation (5-30 min)"
echo "3. Test: curl https://kikuai.dev/healthz"
echo "4. Uptime Kuma: https://status.kikuai.dev"
