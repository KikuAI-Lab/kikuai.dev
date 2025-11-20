#!/bin/bash
# Final migration script - uses GitHub Actions API to get token if possible

set -e

NEW_SERVER="37.27.38.186"
SSH_USER="root"

echo "🚀 Finalizing migration..."

# Try to get token from GitHub
echo "🔍 Attempting to retrieve Cloudflare API Token..."

# Method 1: Try GitHub CLI (if has access)
if command -v gh &> /dev/null; then
    GITHUB_TOKEN=$(gh auth token 2>/dev/null || echo "")
    if [ -n "$GITHUB_TOKEN" ]; then
        # Note: GitHub API doesn't allow reading secret values directly
        # We can only check if secret exists
        SECRET_EXISTS=$(gh secret list --repo KikuAI-Lab/kikuai.dev 2>/dev/null | grep -i CLOUDFLARE_API_TOKEN || echo "")
        if [ -n "$SECRET_EXISTS" ]; then
            echo "✅ Cloudflare API Token exists in GitHub Secrets"
            echo "   However, secret values cannot be retrieved via API for security reasons."
            echo ""
            echo "   Please provide the token manually:"
            echo "   1. Go to: https://github.com/KikuAI-Lab/kikuai.dev/settings/secrets/actions"
            echo "   2. Or get it from Cloudflare: https://dash.cloudflare.com/profile/api-tokens"
            echo ""
            read -sp "Enter Cloudflare API Token: " TOKEN
            echo ""
        fi
    fi
fi

# If token not set, prompt
if [ -z "$TOKEN" ]; then
    echo "Please provide your Cloudflare API Token:"
    echo "Get it from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Required: Zone DNS Edit permission for kikuai.dev"
    echo ""
    read -sp "Enter token: " TOKEN
    echo ""
fi

if [ -z "$TOKEN" ]; then
    echo "❌ Token required. Exiting."
    exit 1
fi

# Create .env file
echo "📝 Creating .env file..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER "echo 'CLOUDFLARE_API_TOKEN=$TOKEN' > /root/kikuai-platform/.env && chmod 600 /root/kikuai-platform/.env"

# Build and start
echo "🔨 Building Caddy..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER "cd /root/kikuai-platform && docker compose build caddy"

echo "🚀 Starting services..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'REMOTE'
cd /root/kikuai-platform
docker compose up -d
sleep 15
docker compose ps
echo ""
echo "📋 Recent Caddy logs:"
docker compose logs --tail=30 caddy
REMOTE

echo ""
echo "✅ Migration complete!"
echo ""
echo "Test endpoints:"
echo "  curl http://$NEW_SERVER/healthz"
echo "  curl https://kikuai.dev/healthz (after DNS propagation)"
