#!/bin/bash

# Production Deployment Script for OG Meta Application
# This script helps automate the deployment process

set -e

echo "🚀 OG Meta Production Deployment Script"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

# Use 'docker compose' or 'docker-compose' based on availability
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}Warning: .env.production not found${NC}"
    echo "Creating from template..."

    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env.production
        echo -e "${YELLOW}Please edit .env.production with your production values${NC}"
        echo "Press Enter to continue after editing, or Ctrl+C to cancel"
        read
    else
        echo -e "${RED}Error: .env.production.example not found${NC}"
        exit 1
    fi
fi

# Display menu
echo "Select deployment action:"
echo "1) Build and start (fresh deployment)"
echo "2) Start existing containers"
echo "3) Stop containers"
echo "4) Restart containers"
echo "5) View logs"
echo "6) Rebuild without cache"
echo "7) Check health status"
echo "8) Clean up (remove containers and images)"
echo "9) Exit"
echo ""
read -p "Enter choice [1-9]: " choice

case $choice in
    1)
        echo -e "${GREEN}Building and starting containers...${NC}"
        $DOCKER_COMPOSE up -d --build
        echo ""
        echo -e "${GREEN}Deployment complete!${NC}"
        echo "Application is running at http://localhost:3000"
        echo "Health check: http://localhost:3000/api/health"
        ;;
    2)
        echo -e "${GREEN}Starting containers...${NC}"
        $DOCKER_COMPOSE up -d
        echo -e "${GREEN}Containers started!${NC}"
        ;;
    3)
        echo -e "${YELLOW}Stopping containers...${NC}"
        $DOCKER_COMPOSE down
        echo -e "${GREEN}Containers stopped!${NC}"
        ;;
    4)
        echo -e "${YELLOW}Restarting containers...${NC}"
        $DOCKER_COMPOSE restart
        echo -e "${GREEN}Containers restarted!${NC}"
        ;;
    5)
        echo -e "${GREEN}Showing logs (Ctrl+C to exit)...${NC}"
        $DOCKER_COMPOSE logs -f app
        ;;
    6)
        echo -e "${YELLOW}Rebuilding without cache...${NC}"
        $DOCKER_COMPOSE down
        $DOCKER_COMPOSE build --no-cache
        $DOCKER_COMPOSE up -d
        echo -e "${GREEN}Rebuild complete!${NC}"
        ;;
    7)
        echo -e "${GREEN}Checking health status...${NC}"
        if curl -f http://localhost:3000/api/health 2>/dev/null; then
            echo ""
            echo -e "${GREEN}Application is healthy!${NC}"
        else
            echo ""
            echo -e "${RED}Application health check failed${NC}"
            echo "Run option 5 to view logs"
        fi
        ;;
    8)
        echo -e "${RED}Warning: This will remove all containers and images${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}Cleaning up...${NC}"
            $DOCKER_COMPOSE down
            docker rmi og-meta:latest 2>/dev/null || true
            echo -e "${GREEN}Cleanup complete!${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
    9)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Done!"
