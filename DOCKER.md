# Docker Quick Reference

## Quick Start

### Using the deployment script (Easiest):
```bash
./deploy.sh
```

### Manual deployment:
```bash
# 1. Create production environment file
cp .env.production.example .env.production

# 2. Edit .env.production with your values
nano .env.production

# 3. Build and start
docker-compose up -d --build
```

## Docker Commands Cheat Sheet

### Building
```bash
# Build the image
docker build -t og-meta:latest .

# Build with docker-compose
docker-compose build

# Build without cache
docker-compose build --no-cache
```

### Running
```bash
# Start containers
docker-compose up -d

# Start and rebuild
docker-compose up -d --build

# Run directly
docker run -d -p 3000:3000 --env-file .env.production og-meta:latest
```

### Monitoring
```bash
# View logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail 100 app

# Container stats
docker stats og-meta-app

# Check health
curl http://localhost:3000/api/health
```

### Management
```bash
# Stop containers
docker-compose down

# Restart
docker-compose restart

# Stop and remove volumes
docker-compose down -v
```

### Debugging
```bash
# Execute commands in running container
docker exec -it og-meta-app sh

# View container details
docker inspect og-meta-app

# Check container status
docker-compose ps
```

### Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove everything
docker system prune -a --volumes
```

## Image Information

- **Base Image:** node:20-alpine
- **Final Size:** ~150-200MB (optimized with multi-stage build)
- **User:** Non-root (nextjs:nodejs)
- **Port:** 3000
- **Health Check:** /api/health

## Environment Variables

Required:
- `NEXT_PUBLIC_BASE_URL` - Your production domain

Optional:
- `NODE_ENV` - Set to "production" (default)
- `PORT` - Application port (default: 3000)

## Production Checklist

- [ ] Set `NEXT_PUBLIC_BASE_URL` in `.env.production`
- [ ] Configure reverse proxy (Nginx/Traefik)
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test health check endpoint
- [ ] Review resource limits

## Troubleshooting

### Container exits immediately
```bash
docker-compose logs app
```

### Port 3000 already in use
Change port in docker-compose.yml:
```yaml
ports:
  - "8080:3000"
```

### Build fails
```bash
docker-compose down
docker system prune -a
docker-compose build --no-cache
```

### Out of memory
Increase limits in docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 2048M
```

## Advanced Usage

### Custom Build Arguments
```bash
docker build \
  --build-arg NODE_ENV=production \
  -t og-meta:latest .
```

### Running on Different Port
```bash
docker run -d \
  -p 8080:3000 \
  --env-file .env.production \
  og-meta:latest
```

### Volume Mounting (Development)
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  og-meta:latest
```

For complete deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)
