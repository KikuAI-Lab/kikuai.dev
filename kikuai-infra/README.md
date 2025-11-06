# kikuai-infra

Infrastructure-as-Code for Hetzner Cloud and Cloudflare.

Contents:
- terraform/: Hetzner network, firewall, volume, VM; Cloudflare DNS (later)
- ansible/: provisioning (user, SSH, Docker, UFW, Fail2ban, updates)
- docs/: short how-tos

Variables (to be provided via env or tfvars):
- HETZNER_TOKEN
- CLOUDFLARE_API_TOKEN
- SSH_PUBLIC_KEY
- SSH_ALLOWED_CIDRS (optional)

## Secrets Management

**Never commit secrets to git!**

- Use `terraform/env.tfvars.example` as template
- Create `terraform/env.tfvars` locally (gitignored)
- For encrypted storage, use SOPS+age (see `docs/operational-readme.md`)

Example `.env` for platform:
```
CLOUDFLARE_API_TOKEN=your_token_here
```

Secrets location:
- Terraform: `kikuai-infra/terraform/env.tfvars` (local, gitignored)
- Platform: `kikuai-platform/.env` (on server, not in repo)
- Encrypted: `secrets/*.enc.yaml` (SOPS-encrypted, can be committed)

Quick start:
- make bootstrap
- terraform init/plan/apply (see terraform/)
- ansible-playbook site.yml -i inventory (see ansible/)

