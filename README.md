# KikuAI Lab

Autonomous AI products for data analysis and automation.

## Site

The main site (`kikuai.dev`) is built with **Nuxt 3** and deployed automatically via **Cloudflare Pages**.

### Local Development

```bash
cd kikuai-site-nuxt
npm install
npm run dev
```

### Deployment

Deployment is automatic via Cloudflare Pages on push to `main` branch.

- **Build command:** `cd kikuai-site-nuxt && npm ci && npm run build`
- **Output directory:** `kikuai-site-nuxt/.output/public`
- **Node version:** `lts/*`

### Project Structure

```
kikuai-site-nuxt/     # Nuxt 3 site (main)
  ├── pages/          # Routes
  ├── components/     # Vue components
  ├── server/         # API routes
  ├── public/         # Static assets
  └── prisma/         # Database schema
```

## Documentation

- **Site docs:** `kikuai-site-nuxt/docs/`
- **Setup guides:** `kikuai-site-nuxt/docs/setup-keys.md`
- **Changelog:** See `WORKLOG.md` for development history

## License

See individual product repositories for license information.
