# OG Meta Previewer

A Next.js application for previewing and analyzing Open Graph metadata and SEO information from any URL. This tool helps developers and marketers ensure their websites have proper social media previews.

## Features

- Real-time Open Graph metadata preview
- SEO analysis and recommendations
- Support for Twitter Cards
- Mobile and desktop preview modes
- URL validation and metadata extraction
- Production-ready Docker deployment

## Getting Started

### Development

First, install dependencies:

```bash
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Production Deployment

#### Docker (Recommended)

The easiest way to deploy this application is using Docker:

```bash
# Quick start with deployment script
./deploy.sh

# Or manually
docker-compose up -d --build
```

For detailed deployment instructions, see:
- [Docker Quick Reference](./DOCKER.md)
- [Production Deployment Guide](./DEPLOYMENT.md)

#### Traditional Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.production` for production deployment:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

See `.env.production.example` for all available options.

## API Endpoints

- `GET /api/meta?url=<url>` - Fetch metadata from a URL
- `GET /api/health` - Health check endpoint

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── Dockerfile             # Production Docker image
├── docker-compose.yml     # Docker Compose configuration
└── deploy.sh             # Deployment helper script
```

## Technology Stack

- **Framework:** Next.js 15
- **Runtime:** Node.js 20
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Language:** TypeScript
- **Containerization:** Docker

## Docker Features

- Multi-stage builds for optimized image size (~150-200MB)
- Non-root user for enhanced security
- Built-in health checks
- Resource limits and monitoring
- Production-ready configuration

## Deployment Options

1. **Docker Compose** - Recommended for simple deployments
2. **Docker Swarm** - For scalable deployments
3. **Kubernetes** - For enterprise-grade deployments
4. **Traditional VPS** - Standard Node.js deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Open Graph Protocol](https://ogp.me/)

## License

MIT
