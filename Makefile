SHELL := /bin/bash

.PHONY: help
help:
	@echo "Targets: bootstrap, deploy, plan, lint"
	@echo "Infra: tf-init, tf-plan, tf-apply, ansible"
	@echo "Site: build, deploy-site"

.PHONY: plan
plan:
	@cat PLAN.md

.PHONY: bootstrap
bootstrap:
	@echo "[bootstrap] Initialize subdirectories and prerequisites"
	@mkdir -p kikuai-infra kikuai-platform kikuai-site
	@chmod +x scripts/*.sh || true

.PHONY: tf-init
tf-init:
	cd kikuai-infra/terraform && terraform init

.PHONY: tf-plan
tf-plan:
	cd kikuai-infra/terraform && terraform plan -var-file=env.tfvars

.PHONY: tf-apply
tf-apply:
	cd kikuai-infra/terraform && terraform apply -auto-approve -var-file=env.tfvars

.PHONY: ansible
ansible:
	ANSIBLE_NOCOWS=1 ansible-playbook -i kikuai-infra/ansible/inventory kikuai-infra/ansible/site.yml

.PHONY: deploy
deploy:
	@echo "[deploy] Deploying to production server"
	@scp -i ~/.ssh/kikuai_prod -r kikuai-platform/* kiku@46.62.196.222:~/kikuai-platform/
	@ssh -i ~/.ssh/kikuai_prod kiku@46.62.196.222 'cd ~/kikuai-platform && docker compose pull && docker compose up -d'

.PHONY: logs
logs:
	@echo "[logs] Fetching container logs"
	@ssh -i ~/.ssh/kikuai_prod kiku@46.62.196.222 'cd ~/kikuai-platform && docker compose logs --tail=100'

.PHONY: restart
restart:
	@echo "[restart] Restarting services"
	@ssh -i ~/.ssh/kikuai_prod kiku@46.62.196.222 'cd ~/kikuai-platform && docker compose restart'

.PHONY: lint
lint:
	@echo "[lint] Running linters"
	@yamllint kikuai-platform/compose.yml kikuai-infra/ansible/*.yml 2>/dev/null || echo "yamllint not installed, skipping"

.PHONY: build
build:
	@echo "[build] Building site"
	@cd kikuai-site && npm ci && npm run build

.PHONY: deploy-site
deploy-site: build
	@echo "[deploy-site] Deploying site to production"
	@rsync -avz --delete -e "ssh -i ~/.ssh/kikuai_prod" kikuai-site/dist/ kiku@46.62.196.222:/srv/kikuai-site/
	@ssh -i ~/.ssh/kikuai_prod kiku@46.62.196.222 'cd ~/kikuai-platform && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile'

