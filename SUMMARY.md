# KikuAI Platform – Deployment Summary

## Deployed
- Caddy reverse proxy with Cloudflare DNS-01 and wildcard TLS (`kikuai.dev`, `*.kikuai.dev`).
- Uptime Kuma status page (`https://status.kikuai.dev`).
- Astro + Tailwind site, served statically from `/srv/kikuai-site` via Caddy.

## DNS / Domains (Terraform)
- Records: `kikuai.dev`, `*.kikuai.dev`, `status.kikuai.dev`, `tas.kikuai.dev`, `patas.kikuai.dev`, `docs.kikuai.dev`, `sandbox.kikuai.dev` → A (proxied) to prod VM.
- Source: `kikuai-infra/terraform/cloudflare.tf`.

## Static Hosting and Deploy
- Static directory on VM: `/srv/kikuai-site` (bind-mounted to Caddy `/www`).
- Deploy: GitHub Actions (planned) → build Astro → rsync `dist/` → reload Caddy.
- Local: `npm run build` → rsync `kikuai-site/dist/` → `/srv/kikuai-site` → reload Caddy.

## Site Pages and Key Blocks
- `/`: Hero, subtitle, CTAs (View Projects, Status), “What we ship” (4 cards), Contact placeholder.
- `/projects`: grid from `src/data/projects.json` (6 entries, status badges, external links when available).
- `/about`: 3–4 paragraphs + “Principles” (8 bullet items).
- `/legal/privacy`, `/legal/terms`, custom `/404`.

## Uptime Kuma – Monitors & Alerts
- HTTPS: `https://kikuai.dev/healthz` (30s), `https://status.kikuai.dev` (60s), `https://kikuai.dev/` (30s)
- TLS expiry: `kikuai.dev`, `*.kikuai.dev` (warn at 21/7/3 days)
- TCP ports: 22/80/443 (60s)
- Ping: prod VM IPv4 (60s)
- Dummies: `https://tas.kikuai.dev/healthz` (60s), `https://patas.kikuai.dev/healthz` (60s)
- Alerts: Telegram; WARNING at 2 consecutive failures, CRITICAL at 5.

## Quality – Lighthouse / E2E / axe
- Lighthouse thresholds configured (Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95). Latest local run meets thresholds; CI wiring pending.
- Playwright E2E: 14/14 passing (200 status, key blocks, CTAs, no console errors).
- axe-core: 0 serious/critical violations.

## Security Headers / SEO / Meta
- HSTS (1y, preload), X-Frame-Options DENY, Referrer-Policy same-origin.
- Permissions-Policy minimal; CSP: `default-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';`.
- robots.txt (allow), sitemap.xml (auto), OG/Twitter images, JSON-LD (Organization + WebSite).

## Intentionally Not Deployed
- Prometheus, Grafana, Postgres, Redis – templates are present in `compose.yml` but commented out.

## TODO / Next
- Add social links and contact details to the site.
- Replace placeholders and launch `tas` and `patas` services; wire reverse_proxy.
- Prepare `docs.kikuai.dev` and connect to Caddy.
- Finalize GitHub Actions site deploy with secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`.

## Needs Owner Input
- Provide/confirm GitHub Secrets for site deploy.
- Confirm DocStripper URL and other product links (update `projects.json`).
- Confirm content plan for `docs.kikuai.dev`.

## Key Configs (snippets, no secrets)

### Caddyfile (core)
```caddyfile
{
  email admin@kikuai.dev
}

kikuai.dev {
  tls { dns cloudflare { api_token {env.CLOUDFLARE_API_TOKEN} } }
  root * /www
  file_server
  @health path /healthz
  respond @health 200
  @maintenance { file /www/maintenance/.enabled not path /healthz }
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
    Referrer-Policy "same-origin"
    Permissions-Policy "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy "default-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
  }
  @static { path *.css *.js *.jpg *.jpeg *.png *.gif *.svg *.ico *.woff *.woff2 *.ttf *.eot *.webp }
  header @static { Cache-Control "public, max-age=31536000, immutable" }
  @html { path *.html }
  header @html { Cache-Control "public, max-age=3600, must-revalidate" }
}

*.kikuai.dev {
  tls { dns cloudflare { api_token {env.CLOUDFLARE_API_TOKEN} } }
  @health path /healthz
  respond @health 200
  respond "KikuAI Gateway" 200
}

status.kikuai.dev {
  tls { dns cloudflare { api_token {env.CLOUDFLARE_API_TOKEN} } }
  reverse_proxy uptime-kuma:3001
}
```

### Docker Compose (platform)
```yaml
services:
  caddy:
    image: kikuai/caddy:with-cloudflare
    ports: ["80:80", "443:443"]
    environment:
      - CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN}
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
      - /srv/kikuai-site:/www:ro
    networks: [public, internal]
    restart: unless-stopped

  uptime-kuma:
    image: louislam/uptime-kuma:1
    volumes: ["uptime_kuma:/app/data"]
    networks: [internal]
    expose: ["3001"]
    restart: unless-stopped

volumes:
  caddy_data: {}
  caddy_config: {}
  uptime_kuma: {}

networks:
  public: { driver: bridge }
  internal: { driver: bridge }
```

### Site Deploy Workflow (intended)
```yaml
name: Site Deploy
on:
  push:
    branches: [ main ]
    paths: [ 'kikuai-site/**' ]
  tags: [ 'v*' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 'lts/*', cache: 'npm', cache-dependency-path: 'kikuai-site/package.json' }
      - name: Build
        working-directory: kikuai-site
        run: |
          npm ci
          npm run build
      - name: Rsync to server
        env:
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_KEY: ${{ secrets.SSH_KEY }}
        run: |
          mkdir -p ~/.ssh && echo "$SSH_KEY" > ~/.ssh/key && chmod 600 ~/.ssh/key
          rsync -az --delete -e "ssh -i ~/.ssh/key -o StrictHostKeyChecking=no" kikuai-site/dist/ $SSH_USER@$SSH_HOST:/srv/kikuai-site/
      - name: Reload Caddy
        env:
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_KEY: ${{ secrets.SSH_KEY }}
        run: |
          ssh -i ~/.ssh/key -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST 'docker compose -f ~/kikuai-platform/compose.yml exec -T caddy caddy reload --config /etc/caddy/Caddyfile'
```
