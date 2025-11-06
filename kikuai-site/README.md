# KikuAI Site

Static marketing site for KikuAI Lab built with Astro + Tailwind CSS.

[![Playwright E2E Tests](https://github.com/kiku-jw/kikuai.dev/actions/workflows/playwright.yml/badge.svg)](https://github.com/kiku-jw/kikuai.dev/actions/workflows/playwright.yml)
[![Lighthouse CI](https://github.com/kiku-jw/kikuai.dev/actions/workflows/lighthouse-ci.yml/badge.svg)](https://github.com/kiku-jw/kikuai.dev/actions/workflows/lighthouse-ci.yml)

## Features

- Dark theme with purple accent (#5b3df5)
- System font stack (no external fonts)
- Minimal client-side JavaScript
- SEO optimized (sitemap, robots.txt, OpenGraph, structured data)
- Accessibility (AA+ contrast, focus styles, skip-link, semantic HTML)

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`

## Build

```bash
npm run build
```

Output will be in `./dist/`

## Preview

```bash
npm run preview
```

## Deployment

### Automated (CI/CD)

The site is automatically deployed via GitHub Actions on:
- Push to `main` branch (when `kikuai-site/**` files change)
- Tags matching `v*` pattern

**Pipeline steps:**
1. Checkout code
2. Setup Node.js LTS
3. Install dependencies (`npm ci`)
4. Build site (`npm run build`)
5. Deploy via rsync to `/srv/kikuai-site/` on production VM
6. Graceful reload Caddy (zero-downtime)

**Required GitHub Secrets:**
- `SSH_HOST` - Production server IP or hostname (e.g., `46.62.196.222`)
- `SSH_USER` - SSH username (e.g., `kiku`)
- `SSH_KEY` - Private SSH key for authentication

### Manual Deployment

**Using Makefile:**
```bash
make build          # Build site locally
make deploy-site    # Build and deploy to production
```

**Manual steps:**
1. Build the project: `npm run build`
2. Copy `dist/` contents to `/srv/kikuai-site/` on the server:
   ```bash
   rsync -avz --delete -e "ssh -i ~/.ssh/kikuai_prod" kikuai-site/dist/ kiku@46.62.196.222:/srv/kikuai-site/
   ```
3. Reload Caddy:
   ```bash
   ssh -i ~/.ssh/kikuai_prod kiku@46.62.196.222 'cd ~/kikuai-platform && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile'
   ```

The site is served as static files from `/srv/kikuai-site` on the production server. Caddy reverse proxy serves the files directly.

**Note:** Create `public/og-image.png` (1200x630px) for OpenGraph previews before building.

## Project Structure

```
src/
  layouts/
    Layout.astro    # Base layout with navigation and footer
  pages/
    index.astro     # Home page
    projects.astro  # Projects listing
    about.astro     # About page
  data/
    projects.json   # Project data
  styles/
    global.css      # Global styles and Tailwind imports
public/
  favicon.svg      # Site favicon
  og-image.png     # OpenGraph image
  robots.txt       # Robots file
  manifest.json    # Web manifest
```
# Updated
