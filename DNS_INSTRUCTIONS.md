# DNS Configuration for Namecheap

**⚠️ ВАЖНО: Сейчас домен использует Cloudflare nameservers, поэтому сайт идет через Cloudflare CDN и показывает старую версию.**

Чтобы полностью перейти на Vercel, нужно изменить nameservers в Namecheap.

## Шаг 1: Изменить Nameservers в Namecheap

1. Go to Namecheap → Domain List → Manage `kikuai.dev`
2. Go to **Advanced DNS** tab
3. Scroll down to **Nameservers** section
4. Сейчас там: `kristina.ns.cloudflare.com` и `clyde.ns.cloudflare.com`
5. Select **Custom DNS**
6. Замените на Vercel nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
7. Save changes

## Шаг 2: Настроить домены в Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `kikuai.dev` and `www.kikuai.dev` (если еще не добавлены)
3. Vercel автоматически настроит DNS записи

## Шаг 3: Удалить Cloudflare (опционально)

После изменения nameservers на Vercel, Cloudflare больше не будет обслуживать ваш домен. Вы можете:
- Удалить домен из Cloudflare Dashboard (если больше не нужен)
- Или оставить как есть - он просто не будет использоваться

## Option 2: Use A/CNAME Records

If you prefer to keep Namecheap nameservers:

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add `kikuai.dev` and `www.kikuai.dev`
3. Vercel will show you DNS records to add

4. In Namecheap → Domain List → Manage `kikuai.dev` → Advanced DNS:

**Add these records:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | Automatic |
| CNAME | www | `cname.vercel-dns.com` | Automatic |

**Note:** The IP address may vary. Check Vercel dashboard for the exact values after adding the domain.

## Verification

After DNS propagation (usually 5-30 minutes):
- Visit `https://kikuai.dev` - should show your Vercel deployment
- SSL certificate will be automatically provisioned by Vercel

