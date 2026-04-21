ENV ?= development
ENV_FILE := .env.$(ENV)

ifeq ("$(wildcard $(ENV_FILE))","")
	ENV_FILE := .env
endif

include $(ENV_FILE)
export

# Variables
DOCKER = docker
APP_NAME = portfolio-app
NETWORK_NAME = portfolio-network

# Colors for output
ESC := $(shell printf '\033')
RED := $(ESC)[0;31m
GREEN := $(ESC)[0;32m
YELLOW := $(ESC)[1;33m
BLUE := $(ESC)[0;34m
NC := $(ESC)[0m

.PHONY: help install build dev start stop clean docker-build docker-run docker-clean setup-db

# Default target
help: ## Show this help message
	@echo "$(BLUE)Portfolio Application - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS="##"; OFS=""; GREEN="\033[0;32m"; NC="\033[0m"} \
	/^[a-zA-Z0-9_.-]+:.*##/ { split($$1, a, ":"); printf "%s%-20s%s %s\n", GREEN, a[1], NC, $$2 }' $(MAKEFILE_LIST)

# Development Commands
install: ## Install dependencies for both client and server
	@echo "$(YELLOW)Installing server dependencies...$(NC)"
	npm install --legacy-peer-deps
	@echo "$(YELLOW)Installing client dependencies...$(NC)"
	cd client && npm install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

build: ## Build the application for production
	@echo "$(YELLOW)Building application...$(NC)"
	cd client && npm run build && mv dist ../
	@echo "$(GREEN)Application built successfully!$(NC)"

dev: ## Start development server with hot reload
	@echo "$(YELLOW)Starting development server...$(NC)"
	npm run dev

start: ## Start production server
	@echo "$(YELLOW)Starting production server...$(NC)"
	npm start

stop: ## Stop all running processes
	@echo "$(YELLOW)Stopping all processes...$(NC)"
	pkill -f "node server/index.js" || true
	pkill -f "vite" || true
	@echo "$(GREEN)Processes stopped!$(NC)"

clean: ## Clean build artifacts and node_modules
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -rf client/node_modules/
	@echo "$(GREEN)Clean completed!$(NC)"

# Docker Commands
docker-build: ## Build Docker image
	@echo "$(YELLOW)Building Docker image...$(NC)"
	$(DOCKER) build -t $(APP_NAME) .
	@echo "$(GREEN)Docker image built successfully!$(NC)"

docker-run: ## Run application in Docker container
	@echo "$(YELLOW)Running application in Docker...$(NC)"
	$(DOCKER) run -p 5000:5000 --name $(APP_NAME) $(APP_NAME)

docker-clean: ## Clean up Docker containers and images
	@echo "$(YELLOW)Cleaning Docker containers and images...$(NC)"
	$(DOCKER) system prune -f
	@echo "$(GREEN)Docker cleanup completed!$(NC)"

# Database Commands
setup-db: ## Setup database with initial data
	@echo "$(YELLOW)Setting up database...$(NC)"
	npm run create-admin
	@echo "$(GREEN)Database setup completed!$(NC)"

# MongoDB Commands
mongo-shell: ## Connect to MongoDB shell
	@echo "$(YELLOW)Connecting to MongoDB shell...$(NC)"
	mongosh "$(DB)"

mongo-backup: ## Backup MongoDB data to JSON
	@echo "$(YELLOW)Backing up MongoDB to JSON...$(NC)"
	mkdir -p backups
	mongosh "$(DB)" --eval 'const fs = require("fs"); const docs = db.getCollectionNames().reduce((acc, name) => { acc[name] = db[name].find().toArray(); return acc }, {}); fs.writeFileSync("backups/backup.json", JSON.stringify(docs, null, 2));'
	@echo "$(GREEN)Backup saved to backups/backup.json$(NC)"

mongo-restore: ## Restore MongoDB data from JSON
	@echo "$(YELLOW)Restoring MongoDB from JSON...$(NC)"
	mongosh "$(DB)" --eval 'const fs = require("fs"); const data = JSON.parse(fs.readFileSync("backups/backup.json")); Object.entries(data).forEach(([coll, docs]) => { db[coll].deleteMany({}); db[coll].insertMany(docs); });'
	@echo "$(GREEN)Restore completed successfully!$(NC)"

mongo-reset: ## Drop all collections in the MongoDB database
	@echo "$(RED)⚠️  Resetting MongoDB: All data will be deleted!$(NC)"
	mongosh "$(DB)" --eval 'db.getCollectionNames().forEach(function(c) { db[c].drop(); });'
	@echo "$(GREEN)✅ MongoDB database reset completed.$(NC)"

# Utility Commands
health-check: ## Check application health
	@echo "$(YELLOW)Checking application health...$(NC)"
	@curl -f http://localhost:5000/api/projects > /dev/null 2>&1 && \
		echo "$(GREEN)✓ Application is healthy$(NC)" || \
		echo "$(RED)✗ Application is not responding$(NC)"

lint: ## Run linting
	@echo "$(YELLOW)Running linter...$(NC)"
	npm run lint

lint-fix: ## Fix lint errors
	@echo "$(YELLOW)Running linter and fixing...$(NC)"
	npm run lint:fix

# Quick Start Commands
quick-start: ## Quick start for development (install + dev)
	make install
	make dev

# Production Commands
prod-deploy: ## Deploy to production (build + docker-build)
	@echo "$(YELLOW)Deploying to production...$(NC)"
	make build
	make docker-build
	@echo "$(GREEN)Production deployment ready!$(NC)"
