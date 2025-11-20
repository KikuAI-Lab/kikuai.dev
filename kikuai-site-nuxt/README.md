<div align="center">
  <img src="https://kikuai.dev/brand/kikuai-logo-optimized.png" alt="KikuAI Lab" width="120" height="120">
  
  # KikuAI Lab — Product Hub
</div>

> Minimalist dark-themed product hub and portfolio showcasing autonomous AI APIs for data analysis and automation. Built with functional minimalism, industrial cyberpunk aesthetics, and intuitive UX.

[![Nuxt](https://img.shields.io/badge/Nuxt-3.0-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.0-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

A modern, minimalist product hub featuring a dark industrial cyberpunk design. Perfect for showcasing API products, tools, and services with an emphasis on functional minimalism and intuitive user experience.

## ✨ Features

- 🎨 **Minimalist Dark Design** — Industrial cyberpunk aesthetic with functional minimalism
- 🚀 **Modern Stack** — Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- 💬 **Interactive Chat** — Built-in terminal-style chat interface with LLM integration
- 📱 **Responsive** — Fully responsive design optimized for all devices
- ⚡ **Fast** — Optimized for performance with Vercel deployment
- 🔒 **Secure** — Environment-based configuration, no secrets in code

## 🛠️ Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com) (SSR)
- **UI:** [Vue 3](https://vuejs.org) + [Tailwind CSS](https://tailwindcss.com)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Deployment:** [Vercel](https://vercel.com)
- **Styling:** Custom CSS with CSS variables for theming

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/KikuAI-Lab/kikuai.dev.git
cd kikuai.dev/kikuai-site-nuxt

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Environment Variables

Create a `.env` file in the `kikuai-site-nuxt` directory:

```env
# OpenRouter API (required for chat feature)
OPENROUTER_API_KEY=your_key_here
```

## 📦 Project Structure

```
kikuai-site-nuxt/
├── pages/              # Route pages
│   ├── index.vue      # Homepage with product grid
│   ├── about.vue      # About page
│   └── products/      # Product detail pages
├── components/        # Vue components
├── layouts/           # Layout templates
├── server/            # API routes and middleware
│   ├── api/          # API endpoints
│   └── middleware/   # Server middleware
├── public/            # Static assets
├── data/              # Product data (JSON)
└── types/             # TypeScript type definitions
```

## 🎨 Design Philosophy

This project follows a **functional minimalism** approach:

- **Utility over vanity** — Every element serves a purpose
- **Minimalist aesthetics** — Clean, uncluttered interface
- **Dark theme** — Industrial cyberpunk aesthetic
- **Intuitive UX** — Easy to understand and navigate
- **Performance first** — Fast loading and smooth interactions

## 🚢 Deployment

The site is automatically deployed to Vercel on push to the `main` branch.

**Vercel Configuration:**
- **Framework Preset:** Nuxt.js
- **Build Command:** `npm run build`
- **Output Directory:** `.output/public`
- **Install Command:** `npm install`

### Setting up Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Nuxt.js framework
3. Add environment variables in Vercel dashboard:
   - `OPENROUTER_API_KEY` (required for chat feature)
4. Deploy!

### DNS Configuration (Namecheap)

After deploying to Vercel, you'll get a domain like `your-project.vercel.app`. To use your custom domain `kikuai.dev`:

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add `kikuai.dev` and `www.kikuai.dev`
3. Vercel will provide DNS records to add in Namecheap:

**Add these DNS records in Namecheap:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | Automatic |
| CNAME | www | `cname.vercel-dns.com` | Automatic |

Or use Vercel's nameservers (recommended):
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

## 📄 License

See individual product repositories for license information.

## 🔗 Links

- **Live Site:** [kikuai.dev](https://kikuai.dev)
- **Organization:** [KikuAI-Lab](https://github.com/KikuAI-Lab)

---

Built with ❤️ by [KikuAI Lab](https://kikuai.dev)
