# Picky Picky Mabelane - Development Makefile
# Usage: make <command>

GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[1;33m
RESET := \033[0m

.PHONY: help up down restart build logs ps migrate seed reset test lint shell-backend shell-frontend clean init dev stop status

help:
	@echo "$(GREEN)Picky Picky Mabelane - Development Commands$(RESET)"
	@echo ""
	@echo "Environment:"
	@echo "  make up          - Start all containers (detached)"
	@echo "  make down        - Stop all containers"
	@echo "  make restart     - Restart all containers"
	@echo "  make build       - Rebuild all images"
	@echo "  make logs        - Follow logs from all services"
	@echo "  make ps          - Show running containers"
	@echo ""
	@echo "Database:"
	@echo "  make migrate     - Run database migrations"
	@echo "  make seed        - Run seeders"
	@echo "  make reset       - Reset database (drop, recreate, migrate, seed)"
	@echo "  make psql        - Connect to PostgreSQL console"
	@echo "  make redis-cli   - Connect to Redis CLI"
	@echo ""
	@echo "Development:"
	@echo "  make shell-backend   - Open bash in backend container"
	@echo "  make shell-frontend  - Open bash in frontend container"
	@echo "  make logs-backend    - Follow backend logs only"
	@echo "  make logs-frontend   - Follow frontend logs only"
	@echo ""
	@echo "Testing & Cleanup:"
	@echo "  make test        - Run backend tests"
	@echo "  make lint        - Run linter"
	@echo "  make clean       - Remove containers, volumes, and build cache"
	@echo ""

up:
	@echo "$(GREEN)Starting all services...$(RESET)"
	docker-compose up -d
	@echo "$(GREEN)Services started. Access:$(RESET)"
	@echo "  Frontend:  http://localhost:3000"
	@echo "  Backend:   http://localhost:5000"
	@echo "  Adminer:   http://localhost:8080"
	@echo "  MailHog:   http://localhost:8025"

down:
	@echo "$(RED)Stopping all services...$(RESET)"
	docker-compose down

restart: down up

build:
	@echo "$(YELLOW)Rebuilding images...$(RESET)"
	docker-compose build --no-cache

logs:
	docker-compose logs -f

ps:
	docker-compose ps

migrate:
	@echo "$(GREEN)Running migrations...$(RESET)"
	docker-compose exec backend npm run migrate

seed:
	@echo "$(GREEN)Running seeders...$(RESET)"
	docker-compose exec backend npm run seed

reset:
	@echo "$(RED)Resetting database...$(RESET)"
	docker-compose exec postgres dropdb -U picky_admin picky_picky_db --if-exists
	docker-compose exec postgres createdb -U picky_admin picky_picky_db
	@echo "$(GREEN)Running migrations...$(RESET)"
	docker-compose exec backend npm run migrate
	@echo "$(GREEN)Running seeders...$(RESET)"
	docker-compose exec backend npm run seed

psql:
	docker-compose exec postgres psql -U picky_admin -d picky_picky_db

redis-cli:
	docker-compose exec redis redis-cli

shell-backend:
	docker-compose exec backend /bin/sh

shell-frontend:
	docker-compose exec frontend /bin/sh

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

test:
	@echo "$(GREEN)Running tests...$(RESET)"
	docker-compose exec backend npm test

lint:
	@echo "$(GREEN)Running linter...$(RESET)"
	docker-compose exec backend npm run lint --if-present

clean:
	@echo "$(RED)Removing containers, volumes, and build cache...$(RESET)"
	docker-compose down -v
	docker system prune -f
	@echo "$(GREEN)Cleanup complete. Run 'make up' to start fresh.$(RESET)"

init: build up migrate seed
	@echo "$(GREEN)Project initialized! Access at http://localhost:3000$(RESET)"

dev:
	@echo "$(GREEN)Starting in development mode with hot reload...$(RESET)"
	docker-compose up

stop:
	docker-compose stop

status:
	docker-compose ps
	docker stats --no-stream
