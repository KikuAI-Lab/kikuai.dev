# Operational Guide

## Building and Deploying the Site Locally

### Build
```bash
cd kikuai-site
npm ci
npm run build
```

### Deploy
```bash
# Using Makefile (recommended)
make build          # Build site
make deploy-site    # Build and deploy to production

# Manual deployment
rsync -avz --delete -e "ssh -i ~/.ssh/kikuai_prod" kikuai-site/dist/ kiku@46.62.196.222:/srv/kikuai-site/
ssh -i ~/.ssh/kikuai_prod kiku@46.62.196.222 'cd ~/kikuai-platform && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile'
```

**Note:** Site is automatically deployed via GitHub Actions on push to `main` (when `kikuai-site/**` changes).

## Adding a New Project

Edit `kikuai-site/src/data/projects.json`:

```json
{
  "id": "project-id",
  "name": "Project Name",
  "oneLiner": "Brief description",
  "status": "live" | "private" | "soon",
  "href": "https://project.kikuai.dev" | null
}
```

- `status`: `live` (public), `private` (internal), `soon` (coming soon)
- `href`: URL for live/private projects, `null` for "soon"
- Rebuild and deploy: `make build && make deploy-site`

## Adding a New Service Behind Reverse Proxy

1. Add DNS record in Terraform (`kikuai-infra/terraform/cloudflare.tf`):
```hcl
resource "cloudflare_record" "service_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "service"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}
```

2. Apply Terraform: `cd kikuai-infra/terraform && terraform apply -var-file=env.tfvars`

3. Add server block in Caddyfile (`kikuai-platform/caddy/Caddyfile`):
```
service.kikuai.dev {
  tls {
    dns cloudflare {
      api_token {env.CLOUDFLARE_API_TOKEN}
    }
  }
  reverse_proxy service-container:8080
}
```

4. Add service to `compose.yml`:
```yaml
services:
  service-container:
    image: your-image:tag
    networks: [internal]
    expose: ["8080"]
```

5. Deploy: `make deploy` or push to main branch (CI/CD)

## Adding a Monitor in Uptime Kuma

1. Access https://status.kikuai.dev
2. Login with admin credentials
3. Click "Add" → Select monitor type (HTTP, Port, Ping, TLS expiry, etc.)
4. Configure:
   - **Name**: Service name
   - **URL/hostname**: Full URL or hostname
   - **Interval**: 30s (HTTP), 60s (Port/Ping)
   - **Notification**: Select Telegram (default)
   - **Failure thresholds**: 2 consecutive → WARNING, 5 → CRITICAL
   - **Certificate expiry**: Enable for HTTPS monitors (warn at 21/7/3 days)
5. Save

**Common monitor types:**
- HTTP(S): `https://service.kikuai.dev/healthz`
- TCP Port: `22`, `80`, `443`
- Ping: Server IPv4 address
- TLS Expiry: `kikuai.dev`, `*.kikuai.dev`

## Secrets Management

### Where Secrets Are Stored

- **Production server**: `~/kikuai-platform/.env` (not in git)
- **Terraform**: `kikuai-infra/terraform/env.tfvars` (not in git, in `.gitignore`)
- **GitHub Secrets**: For CI/CD (SSH keys, tokens)
- **Encrypted files**: `secrets/*.enc.yaml` (SOPS/age encrypted, safe to commit)

### Never Commit

- ❌ `.env` files with real values
- ❌ `*.tfvars` with real tokens
- ❌ SSH private keys
- ❌ API tokens in plain text

### Always Use

- ✅ `.env.example` as template (with placeholder values)
- ✅ `env.tfvars.example` for Terraform
- ✅ SOPS/age for encrypted secrets
- ✅ GitHub Secrets for CI/CD

### Example `.env.example`
```bash
CLOUDFLARE_API_TOKEN=your_token_here
TELEGRAM_BOT_TOKEN=your_token_here
```

### Using SOPS/age (Optional)

```bash
# Setup (one-time)
age-keygen -o ~/.config/age/keys.txt
export SOPS_AGE_KEY_FILE=~/.config/age/keys.txt

# Encrypt
sops --encrypt --in-place secrets/prod.enc.yaml

# Edit
sops secrets/prod.enc.yaml

# Decrypt for use
sops --decrypt secrets/prod.enc.yaml > .env
```

## Rolling Back a Deployment

### Using Docker Compose
```bash
ssh kiku@46.62.196.222
cd ~/kikuai-platform
docker compose pull service-name:previous-tag
docker compose up -d service-name
```

### Using Git tags
```bash
git checkout v1.0.0
make deploy
```

### Manual rollback
1. SSH to server
2. Edit `compose.yml` to use previous image tag
3. `docker compose pull && docker compose up -d`

## Monitoring and Alerts

- Public status page: https://status.kikuai.dev
- Telegram alerts: Configured via Uptime Kuma UI
- Alert rules: 2 consecutive failures → WARNING, 5 → CRITICAL

## Security

- UFW: Default deny, allow 22/80/443
- Fail2ban: Active for SSH (5 attempts → 1h ban)
- Secrets: Never commit `.env` or `*.tfvars` with real values
- Use `.env.example` as template

## Maintenance Mode (503)

### Enable
```bash
ssh kiku@46.62.196.222
sudo touch /srv/kikuai-site/maintenance/.enabled
```
Caddy automatically serves maintenance page with HTTP 503. No restart needed.

### Disable
```bash
ssh kiku@46.62.196.222
sudo rm /srv/kikuai-site/maintenance/.enabled
```
Normal operation resumes immediately.

**Note:** `/healthz` endpoint is not affected by maintenance mode.

## Troubleshooting

### Caddy not starting
```bash
docker logs caddy
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
```

### Service unreachable
1. Check DNS: `dig service.kikuai.dev`
2. Check Caddy logs: `docker logs caddy --tail=50`
3. Check service container: `docker ps | grep service`
4. Check network: `docker network inspect kikuai-platform_internal`

### Certificate issues
- Check Cloudflare DNS-01 challenge logs in Caddy
- Verify `CLOUDFLARE_API_TOKEN` in `.env`
- Check certificate expiry: `openssl s_client -servername service.kikuai.dev -connect 127.0.0.1:443 2>/dev/null | openssl x509 -noout -dates`

