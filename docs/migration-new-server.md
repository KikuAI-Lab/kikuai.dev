# Migration to New Server (37.27.38.186)

## Status: Setup Complete ✅

Infrastructure has been set up on the new server. Next steps:

## Completed Steps

1. ✅ Docker and Docker Compose verified (already installed)
2. ✅ Directory structure created:
   - `/srv/kikuai-site` - Main site files
   - `/srv/kikuai-docs` - Documentation
   - `/srv/kikuai-stubs` - API stubs
   - `/root/kikuai-platform/` - Platform configuration
3. ✅ Caddy Dockerfile created with Cloudflare DNS plugin
4. ✅ Caddyfile configured
5. ✅ Docker Compose file created

## Next Steps

### 1. Set Cloudflare API Token

```bash
ssh root@37.27.38.186
cd /root/kikuai-platform
nano .env
# Add: CLOUDFLARE_API_TOKEN=your_token_here
```

### 2. Build and Start Services

```bash
cd /root/kikuai-platform
docker compose build
docker compose up -d
```

### 3. Verify Services

```bash
docker compose ps
docker compose logs caddy
docker compose logs uptime-kuma
```

### 4. Update DNS Records

Update Cloudflare DNS records to point to new server IP: `37.27.38.186`

- `kikuai.dev` (A record)
- `*.kikuai.dev` (A record, wildcard)
- `status.kikuai.dev` (A record)

### 5. Test Health Endpoints

```bash
curl http://37.27.38.186/healthz
curl https://kikuai.dev/healthz
```

### 6. Migrate Data (if needed)

If you have data from the old server:

```bash
# From old server
rsync -avz /srv/kikuai-site/ root@37.27.38.186:/srv/kikuai-site/
rsync -avz /srv/kikuai-docs/ root@37.27.38.186:/srv/kikuai-docs/
rsync -avz /srv/kikuai-stubs/ root@37.27.38.186:/srv/kikuai-stubs/
```

### 7. Migrate Uptime Kuma Data (optional)

If you want to preserve monitoring data:

```bash
# From old server
docker exec uptime-kuma tar czf /tmp/kuma-backup.tar.gz /app/data
docker cp uptime-kuma:/tmp/kuma-backup.tar.gz ./kuma-backup.tar.gz

# To new server
scp kuma-backup.tar.gz root@37.27.38.186:/tmp/
ssh root@37.27.38.186 "cd /root/kikuai-platform && docker compose stop uptime-kuma && docker run --rm -v kikuai-platform_uptime_kuma:/data -v /tmp:/backup ubuntu tar xzf /backup/kuma-backup.tar.gz -C /data && docker compose start uptime-kuma"
```

## SSH Access

SSH key has been saved to `~/.ssh/kikuai_new_server.pub`

Connect with:
```bash
ssh root@37.27.38.186
```

## Notes

- The site is currently deployed via Cloudflare Pages, so `/srv/kikuai-site` may be empty initially
- Caddy will serve static files from `/srv/kikuai-site` if present
- Uptime Kuma will be available at `https://status.kikuai.dev` after DNS update

