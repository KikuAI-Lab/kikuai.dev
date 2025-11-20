#!/bin/bash
# Migration script to move KikuAI platform to new server
# New server: 37.27.38.186

set -e

NEW_SERVER="37.27.38.186"
SSH_USER="root"
SSH_KEY="~/.ssh/kikuai_new_server"

echo "🚀 Starting migration to new server: $NEW_SERVER"

# Step 1: Install Docker and Docker Compose if needed
echo "📦 Checking Docker installation..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'EOF'
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
fi

if ! command -v docker compose &> /dev/null; then
    echo "Docker Compose not found, installing..."
    apt-get update
    apt-get install -y docker-compose-plugin
fi

docker --version
docker compose version
EOF

# Step 2: Create directory structure
echo "📁 Creating directory structure..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$NEW_SERVER << 'EOF'
mkdir -p /srv/kikuai-site
mkdir -p /srv/kikuai-docs
mkdir -p /srv/kikuai-stubs
mkdir -p /root/kikuai-platform/caddy
chmod 755 /srv/kikuai-site
chmod 755 /srv/kikuai-docs
chmod 755 /srv/kikuai-stubs
EOF

# Step 3: Create Caddy Dockerfile
echo "🔧 Creating Caddy configuration..."
cat > /tmp/caddy-dockerfile << 'CADDYFILE'
FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:2

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
CADDYFILE

scp /tmp/caddy-dockerfile $SSH_USER@$NEW_SERVER:/root/kikuai-platform/caddy/Dockerfile

# Step 4: Create Caddyfile
cat > /tmp/caddyfile << 'CADDYFILE'
{
    email admin@kikuai.dev
}

kikuai.dev {
    tls {
        dns cloudflare {
            api_token {env.CLOUDFLARE_API_TOKEN}
        }
    }

    root * /www
    file_server

    @health path /healthz
    respond @health 200

    @maintenance {
        file /www/maintenance/.enabled
        not path /healthz
    }
    handle @maintenance {
        rewrite * /maintenance/index.html
        file_server
        header Cache-Control "no-cache, no-store, must-revalidate"
        respond 503
    }

    try_files {path} {path}/ /404.html

    encode zstd gzip

    header {
        -Server
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "same-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
        Content-Security-Policy "default-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
        Cross-Origin-Opener-Policy "same-origin"
        Cross-Origin-Resource-Policy "same-origin"
    }

    @static {
        path *.css *.js *.jpg *.jpeg *.png *.gif *.svg *.ico *.woff *.woff2 *.ttf *.eot *.webp
    }
    header @static {
        Cache-Control "public, max-age=31536000, immutable"
    }

    @html {
        path *.html
    }
    header @html {
        Cache-Control "public, max-age=3600, must-revalidate"
    }
}

*.kikuai.dev {
    tls {
        dns cloudflare {
            api_token {env.CLOUDFLARE_API_TOKEN}
        }
    }

    @health path /healthz
    respond @health 200

    respond "KikuAI Gateway" 200
}

status.kikuai.dev {
    tls {
        dns cloudflare {
            api_token {env.CLOUDFLARE_API_TOKEN}
        }
    }
    reverse_proxy uptime-kuma:3001
}
CADDYFILE

scp /tmp/caddyfile $SSH_USER@$NEW_SERVER:/root/kikuai-platform/caddy/Caddyfile

# Step 5: Create Docker Compose file
cat > /tmp/compose.yml << 'COMPOSE'
name: kikuai-platform

services:
  caddy:
    build:
      context: ./caddy
      dockerfile: Dockerfile
    image: kikuai/caddy:with-cloudflare
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    environment:
      - CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN}
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
      - /srv/kikuai-site:/www:ro
      - /srv/kikuai-docs:/www-docs:ro
      - /srv/kikuai-stubs:/www-stubs:ro
    restart: unless-stopped
    networks:
      - public
      - internal

  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    restart: unless-stopped
    volumes:
      - uptime_kuma:/app/data
    networks:
      - internal
    expose:
      - "3001"

volumes:
  caddy_data: {}
  caddy_config: {}
  uptime_kuma: {}

networks:
  public:
    driver: bridge
  internal:
    driver: bridge
COMPOSE

scp /tmp/compose.yml $SSH_USER@$NEW_SERVER:/root/kikuai-platform/compose.yml

# Step 6: Create .env file template
cat > /tmp/env.example << 'ENV'
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
ENV

scp /tmp/env.example $SSH_USER@$NEW_SERVER:/root/kikuai-platform/.env.example

echo "✅ Migration setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy CLOUDFLARE_API_TOKEN to /root/kikuai-platform/.env"
echo "2. Run: cd /root/kikuai-platform && docker compose up -d"
echo "3. Update DNS records to point to new server IP: $NEW_SERVER"

