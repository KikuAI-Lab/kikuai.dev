# DNS Configuration for Namecheap

After deploying to Vercel, configure your domain `kikuai.dev` in Namecheap.

## Option 1: Use Vercel Nameservers (Recommended)

1. Go to Namecheap → Domain List → Manage `kikuai.dev`
2. Go to **Advanced DNS** tab
3. Scroll down to **Nameservers** section
4. Select **Custom DNS**
5. Add these nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
6. Save changes

Then in Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add `kikuai.dev` and `www.kikuai.dev`
3. Vercel will automatically configure DNS

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

