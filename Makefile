# CragCrowd Web UI Makefile

.PHONY: setup install build dev start test lint clean docker-build docker-run docker-stop

# Default target
all: setup build

# Setup development environment
setup:
	@echo "Setting up CragCrowd Web UI development environment..."
	@cp .env.example .env || echo ".env file already exists"
	$(MAKE) install

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Build the application
build:
	@echo "Building application..."
	npm run build

# Start development server
dev:
	@echo "Starting development server..."
	npm run dev

# Preview production build
preview: build
	@echo "Starting preview server..."
	npm run preview

# Start production server (requires build)
start: build preview

# Run tests
test:
	@echo "Running tests..."
	npm run test

# Run tests with UI
test-ui:
	@echo "Running tests with UI..."
	npm run test:ui

# Lint code
lint:
	@echo "Linting code..."
	npm run lint

# Fix linting issues
lint-fix:
	@echo "Fixing linting issues..."
	npm run lint:fix

# Type check
typecheck:
	@echo "Type checking..."
	npm run typecheck

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist
	rm -rf node_modules

# Docker commands
docker-build:
	@echo "Building Docker image..."
	docker build -t cragcrowd-web-ui .

docker-run:
	@echo "Running Docker container..."
	docker run -d --name cragcrowd-web-ui -p 3001:3001 cragcrowd-web-ui

docker-stop:
	@echo "Stopping Docker container..."
	docker stop cragcrowd-web-ui || true
	docker rm cragcrowd-web-ui || true

# Analyze bundle
analyze:
	@echo "Analyzing bundle size..."
	npm run build -- --mode analyze

# Help
help:
	@echo "Available commands:"
	@echo "  setup         - Setup development environment"
	@echo "  install       - Install dependencies"
	@echo "  build         - Build application"
	@echo "  dev           - Start development server"
	@echo "  preview       - Preview production build"
	@echo "  start         - Start production server"
	@echo "  test          - Run tests"
	@echo "  test-ui       - Run tests with UI"
	@echo "  lint          - Lint code"
	@echo "  lint-fix      - Fix linting issues"
	@echo "  typecheck     - Type check code"
	@echo "  clean         - Clean build artifacts"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run Docker container"
	@echo "  docker-stop   - Stop Docker container"
	@echo "  analyze       - Analyze bundle size"