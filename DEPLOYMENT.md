# Production Deployment Guide

This guide covers deploying the OG Meta application using Docker in a production environment.

## Prerequisites

- Docker (v20.10 or later)
- Docker Compose (v2.0 or later)
- A domain name (for production deployment)

## Quick Start

### 1. Environment Configuration

Create a production environment file:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and set your production values:

```env
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### 2. Build the Docker Image

```bash
docker build -t og-meta:latest .
```

Or using docker-compose:

```bash
docker-compose build
```

### 3. Run the Application

Using Docker Compose (recommended):

```bash
docker-compose up -d
```

Or using Docker directly:

```bash
docker run -d \
  --name og-meta-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  og-meta:latest
```

### 4. Verify Deployment

Check if the application is running:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-15T...",
  "uptime": 123.456
}
```

## Production Deployment Options

### Option 1: Using Docker Compose (Recommended)

1. **Start the application:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

4. **Update and restart:**
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

### Option 2: Using Docker Swarm

1. **Initialize Swarm:**
   ```bash
   docker swarm init
   ```

2. **Deploy the stack:**
   ```bash
   docker stack deploy -c docker-compose.yml og-meta
   ```

3. **Scale the service:**
   ```bash
   docker service scale og-meta_app=3
   ```

### Option 3: Using Kubernetes

Create a Kubernetes deployment file (`k8s-deployment.yml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: og-meta
spec:
  replicas: 3
  selector:
    matchLabels:
      app: og-meta
  template:
    metadata:
      labels:
        app: og-meta
    spec:
      containers:
      - name: og-meta
        image: og-meta:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_BASE_URL
          value: "https://your-production-domain.com"
        resources:
          limits:
            memory: "1Gi"
            cpu: "1000m"
          requests:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: og-meta-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: og-meta
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yml
```

## Reverse Proxy Configuration

### Nginx

```nginx
server {
    listen 80;
    server_name your-production-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Traefik (docker-compose.yml)

```yaml
version: '3.8'

services:
  app:
    # ... existing config ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.og-meta.rule=Host(`your-production-domain.com`)"
      - "traefik.http.routers.og-meta.entrypoints=websecure"
      - "traefik.http.routers.og-meta.tls.certresolver=letsencrypt"
      - "traefik.http.services.og-meta.loadbalancer.server.port=3000"
```

## SSL/TLS Configuration

### Using Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-production-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Logging

### View Logs

```bash
# Docker Compose
docker-compose logs -f app

# Docker
docker logs -f og-meta-app

# Specific number of lines
docker logs --tail 100 og-meta-app
```

### Health Checks

The application includes a health check endpoint at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

### Monitoring with Docker Stats

```bash
docker stats og-meta-app
```

## Performance Optimization

### 1. Resource Limits

Adjust resource limits in `docker-compose.yml` based on your server capacity:

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2048M
    reservations:
      cpus: '1.0'
      memory: 1024M
```

### 2. Image Optimization

The Dockerfile uses multi-stage builds to minimize image size:
- Dependencies stage: Only production dependencies
- Builder stage: Builds the application
- Runner stage: Minimal runtime with only necessary files

### 3. Caching

Enable Next.js caching in production:
- Static assets are cached automatically
- API responses can be cached using Next.js built-in caching

## Security Best Practices

1. **Non-root user**: The container runs as a non-root user (nextjs:nodejs)
2. **Minimal base image**: Uses Alpine Linux for smaller attack surface
3. **No development dependencies**: Only production dependencies in final image
4. **Environment variables**: Sensitive data through environment files
5. **Health checks**: Automatic container health monitoring

## Backup and Recovery

### Backup Strategy

Since this is a stateless application, focus on:
1. Environment configuration files
2. Custom configuration

```bash
# Backup configuration
tar -czf og-meta-config-$(date +%Y%m%d).tar.gz .env.production docker-compose.yml
```

### Disaster Recovery

1. Restore configuration files
2. Rebuild and restart containers:
   ```bash
   docker-compose up -d --build
   ```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Check container status
docker-compose ps
```

### Port already in use

```bash
# Change port in docker-compose.yml
ports:
  - "8080:3000"  # Use 8080 instead of 3000
```

### Out of memory

Increase memory limits in docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 2048M
```

### Build failures

```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

## Maintenance

### Updating the Application

1. Pull latest code
2. Rebuild the image:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Cleaning Up

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

## Support

For issues or questions:
- Check the logs: `docker-compose logs -f app`
- Verify environment variables: `docker-compose config`
- Check health status: `curl http://localhost:3000/api/health`
