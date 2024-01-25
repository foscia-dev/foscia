# Executables
DOCKER_COMPOSE?=docker compose
DOCKER_EXEC?=$(DOCKER_COMPOSE) exec -it
PNPM?=$(DOCKER_EXEC) foscia-node pnpm
DOCS?=$(DOCKER_EXEC) foscia-docs

# Misc
default: help

##
## —— Docker ———————————————————————————————————————————————————————————————————

.PHONY: docker-build
docker-build: ## Build and start containers.
	@$(DOCKER_COMPOSE) up --build --no-recreate -d

.PHONY: docker-rebuild
docker-rebuild: ## Force rebuild and start containers.
	@$(DOCKER_COMPOSE) up --build --force-recreate --remove-orphans -d

.PHONY: up
up: ## Start containers without building.
	@$(DOCKER_COMPOSE) up -d

.PHONY: down
down: ## Stop and remove containers.
	@$(DOCKER_COMPOSE) down --remove-orphans --timeout=2

##
## —— Executables ——————————————————————————————————————————————————————————————

.PHONY: pnpm
pnpm: ## Run a PNPM command (e.g. make pnpm c="update").
	@$(PNPM) $(c)

##
## —— Git hooks ————————————————————————————————————————————————————————————————

.PHONY: pre-commit
pre-commit: ## Pre-commit GIT hook.
	@$(DOCKER_COMPOSE) exec -T foscia-node pnpm lint

.PHONY: commit-msg
commit-msg: ## Commit-msg GIT hook.
	@$(DOCKER_COMPOSE) exec -T foscia-node pnpm commitlint --edit $(m) --verbose

##
## —— Build, lint and tests ————————————————————————————————————————————————————

.PHONY: build
build: ## Build.
	@$(PNPM) build

.PHONY: lint
lint: ## Lint.
	@$(PNPM) lint

.PHONY: typecheck
typecheck: ## Run typecheck.
	@$(PNPM) test:typecheck

.PHONY: test-watch
test-watch: ## Run tests (watching).
	@$(PNPM) test:watch

.PHONY: test-coverage
test-coverage: ## Run tests.
	@$(PNPM) test:coverage

.PHONY: test
test: lint typecheck test-coverage ## Lint and run tests.

##
## —— Docs —————————————————————————————————————————————————————————————————————

.PHONY: docs-build
docs-build: ## Build docs website.
	@$(DOCS) pnpm build

.PHONY: docs-prettier
docs-prettier: ## Run prettier on docs MD files.
	@$(DOCS) pnpm prettier

##
## —— Utilities ————————————————————————————————————————————————————————————————

.PHONY: sh
sh: ## Run sh on test container.
	@$(DOCKER_EXEC) foscia-node sh

.PHONY: help
help: ## Show help for each of the Makefile recipes.
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
