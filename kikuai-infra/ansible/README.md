# Ansible provisioning

Playbooks and roles to configure the Hetzner VM (Debian 12):
- user and SSH hardening
- Docker + Docker Compose
- UFW (80/443/22), Fail2ban, unattended-upgrades

Run:
- ansible-galaxy install -r requirements.yml (if any)
- ansible-playbook -i inventory site.yml

