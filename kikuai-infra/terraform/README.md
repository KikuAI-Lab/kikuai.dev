# Terraform (Hetzner + Cloudflare)

Modules (planned):
- network, firewall, volume, server (Hetzner)
- cloudflare_dns (records, redirects later)

Inputs (env/tfvars):
- HETZNER_TOKEN
- CLOUDFLARE_API_TOKEN
- SSH_PUBLIC_KEY

Commands:
- terraform init
- terraform plan -var-file=env.tfvars
- terraform apply -var-file=env.tfvars

