variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare Zone ID for kikuai.dev"
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare Account ID"
}

variable "root_domain" {
  type        = string
  default     = "kikuai.dev"
}

