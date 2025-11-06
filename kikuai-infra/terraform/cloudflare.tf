data "cloudflare_zone" "kiku" {
  zone_id = var.cloudflare_zone_id
}

resource "cloudflare_record" "root_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "@"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "wildcard_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "*"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "status_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "status"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "tas_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "tas"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "patas_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "patas"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "docs_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "docs"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "sandbox_a" {
  zone_id = data.cloudflare_zone.kiku.id
  name    = "sandbox"
  type    = "A"
  value   = hcloud_server.prod.ipv4_address
  proxied = true
  ttl     = 1
}

