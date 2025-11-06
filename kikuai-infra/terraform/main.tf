terraform {
  required_version = ">= 1.5.7"
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = ">= 1.49.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.30"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "hcloud_token" {
  type        = string
  description = "Hetzner Cloud API token"
  sensitive   = true
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token"
  sensitive   = true
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key for the kiku user"
}

variable "server_type" {
  type        = string
  default     = "cx22"
  description = "Hetzner server type"
}

variable "server_name" {
  type        = string
  default     = "kiku-prod"
}

variable "image" {
  type        = string
  default     = "debian-12"
}

variable "location" {
  type        = string
  default     = "hel1"
}

variable "volume_size_gb" {
  type        = number
  default     = 40
  description = "Extra volume size in GB for backups/data"
}

resource "hcloud_ssh_key" "kiku" {
  name       = "kiku"
  public_key = var.ssh_public_key
}

# Network and firewall placeholders
resource "hcloud_network" "main" {
  name     = "kiku-network"
  ip_range = "10.10.0.0/16"
}

resource "hcloud_network_subnet" "main" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.10.1.0/24"
}

resource "hcloud_firewall" "basic" {
  name = "kiku-basic"
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_server" "prod" {
  name        = var.server_name
  image       = var.image
  server_type = var.server_type
  location    = var.location
  ssh_keys    = [hcloud_ssh_key.kiku.id]
  firewall_ids = [hcloud_firewall.basic.id]

  network {
    network_id = hcloud_network.main.id
    ip         = "10.10.1.10"
  }

  user_data = templatefile("${path.module}/cloud-init.yml", {
    ssh_public_key = var.ssh_public_key
  })
}

# Extra volume and attachment
resource "hcloud_volume" "data" {
  name     = "kiku-data"
  size     = var.volume_size_gb
  location = var.location
  format   = "ext4"
}

resource "hcloud_volume_attachment" "data_attach" {
  volume_id = hcloud_volume.data.id
  server_id = hcloud_server.prod.id
  automount = true
}

output "server_ipv4" {
  value = hcloud_server.prod.ipv4_address
}

output "server_ipv6" {
  value = hcloud_server.prod.ipv6_address
}

output "server_id" {
  value = hcloud_server.prod.id
}

