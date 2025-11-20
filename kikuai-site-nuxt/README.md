<div align="center">
  <img src="https://kikuai.dev/brand/kikuai-logo-optimized.png" alt="KikuAI Lab" width="120" height="120">
</div>

# KikuAI Lab — Product Hub

> Minimalist dark-themed product hub and portfolio showcasing autonomous AI APIs for data analysis and automation. Built with functional minimalism, industrial cyberpunk aesthetics, and intuitive UX.

[![Nuxt](https://img.shields.io/badge/Nuxt-3.0-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.0-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)

A modern, minimalist product hub featuring a dark industrial cyberpunk design. Perfect for showcasing API products, tools, and services with an emphasis on functional minimalism and intuitive user experience.

## ✨ Features

- 🎨 **Minimalist Dark Design** — Industrial cyberpunk aesthetic with functional minimalism
- 🚀 **Modern Stack** — Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- 💬 **Interactive Chat** — Built-in terminal-style chat interface with LLM integration
- 📱 **Responsive** — Fully responsive design optimized for all devices
- ⚡ **Fast** — Optimized for performance with Cloudflare Pages deployment
- 🔒 **Secure** — Environment-based configuration, no secrets in code

## 🛠️ Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com) (SSR)
- **UI:** [Vue 3](https://vuejs.org) + [Tailwind CSS](https://tailwindcss.com)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com)
- **Database:** PostgreSQL (via Prisma)
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
# OpenRouter API (for chat feature)
OPENROUTER_API_KEY=your_key_here

# Database (optional, for API features)
DATABASE_URL=your_database_url

# Redis (optional, for rate limiting)
REDIS_URL=your_redis_url
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

The site is automatically deployed to Cloudflare Pages on push to the `main` branch.

**Build Settings:**
- **Build command:** `cd kikuai-site-nuxt && npm ci && npm run build`
- **Output directory:** `kikuai-site-nuxt/.output/public`
- **Node version:** `lts/*`

## 📄 License

See individual product repositories for license information.

## 🔗 Links

- **Live Site:** [kikuai.dev](https://kikuai.dev)
- **Organization:** [KikuAI-Lab](https://github.com/KikuAI-Lab)

## 💝 Support

Support this project and help keep it free:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/kiku)
- ☕ [Ko-fi](https://ko-fi.com/kiku_jw)
- 🙏 [Thanks.dev](https://thanks.dev/d/gh/kiku-jw)
- 💬 [Discord](https://discord.gg/4Kxs97JvsU)

---

Built with ❤️ by [KikuAI Lab](https://kikuai.dev)
