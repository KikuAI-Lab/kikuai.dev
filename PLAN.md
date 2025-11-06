# KikuAI Platform — Plan

1. Initialize repository meta
   1.1 Create PLAN.md (this file)
   1.2 Create WORKLOG.md and record initial entry

2. Repository scaffolding
   2.1 Create directories: kikuai-infra, kikuai-platform, kikuai-site
   2.2 Add root Makefile with bootstrap/deploy placeholders
   2.3 Add root README with high-level overview

3. IaC: Hetzner + Cloudflare
   3.1 Terraform skeleton for Hetzner Cloud (network, firewall, volume, VM)
   3.2 Cloud-init and Ansible inventory and playbook skeleton
   3.3 Infra docs: variables, commands, diagrams

4. Base server provisioning
   4.1 Ansible roles: user, SSH, Docker, Docker Compose, UFW, Fail2ban, unattended-upgrades
   4.2 Idempotency checks

5. Reverse proxy + TLS
   5.1 Caddy with Cloudflare DNS-01 for kikuai.dev and *.kikuai.dev
   5.2 Docker network public + routing via labels
   5.3 Hello placeholder service (hello.kikuai.dev)

6. Observability
   6.1 Uptime Kuma
   6.2 Prometheus, Node Exporter, cAdvisor
   6.3 Loki + Promtail
   6.4 Grafana with base dashboards
   6.5 Telegram alerts wiring

7. Backups
   7.1 Borg/Restic setup to Hetzner Storage Box or Backblaze B2
   7.2 PostgreSQL dumps and volumes backup
   7.3 Restore script, cron schedules, success/failure alerts

8. CI/CD
   8.1 GitHub Actions templates: build.yml (GHCR), deploy.yml (SSH → docker compose pull && up -d)
   8.2 Docker cache and multi-arch (QEMU)
   8.3 SOPS+age example for secrets management
   8.4 kikuai-platform: compose.yml for caddy, kuma, grafana, prometheus, loki, promtail, postgres, redis, watchtower (optional)

9. Marketing site (kikuai-site)
   9.1 ✅ Astro + TS + Tailwind CSS (minimal, no external fonts)
   9.2 ✅ Pages: Home (/), Projects (/projects), About (/about), Privacy (/legal/privacy), Terms (/legal/terms)
   9.3 ✅ Projects data from JSON file
   9.4 ✅ Sitemap, OpenGraph, structured data, robots.txt, manifest.json
   9.5 Status page links to Uptime Kuma (external)
   9.6 ✅ CI build + deploy via GitHub Actions (rsync to /srv/kikuai-site, Caddy reload)
   9.7 ✅ Lighthouse CI with thresholds (Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95)
   9.8 ✅ Playwright E2E tests (/, /projects, /about) with accessibility checks (axe-core)
   9.9 ✅ Footer with legal links (Privacy, Terms) and contact email (admin@kikuai.dev)
   9.10 ✅ Custom 404 page and maintenance mode (503)
   9.11 ✅ OG image (SVG → PNG) with logo and purple accent
   9.12 ✅ JSON-LD structured data (Organization + WebSite) on home page
   9.13 ✅ Operational documentation (docs/operational-readme.md) with all common tasks

10. Service templates
   10.1 service-template (FastAPI) with healthz, /version, OpenAPI, metrics, idempotency key
   10.2 Dockerfile: multi-stage, non-root, readiness/liveness
   10.3 compose.example.yml with caddy labels
   10.4 README: how to create a new service

11. Domains/DNS
   11.1 Terraform for Cloudflare records and redirects
   11.2 Documentation for tokens and NS change

12. Security & privacy
   12.1 Caddy security headers
   12.2 Log scrubbing guidelines
   12.3 backups/SECURITY.md and PRIVACY.md for site

13. Initial products
   13.1 tas.kikuai.dev placeholder API
   13.2 patas.kikuai.dev placeholder API
   13.3 docstripper.kikuai.dev CNAME/redirect to GitHub Pages
   13.4 Update portal: 3 product cards

14. Reporting
   14.1 REPORT.md (Infra, CI/CD, DNS/TLS, Monitoring, Backups, Site, Cost, Next sprint)

15. Finalize make targets
   15.1 make bootstrap → end-to-end bootstrap
   15.2 make deploy → end-to-end deploy

Execution rules:
- Do not change order or expand tasks without explicit user request.
- Keep repository files and code in English; user communication in Russian.
- Minimal, secure defaults; no secrets committed; provide .env.example and SOPS patterns.

