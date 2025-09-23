---
layout: default
title: "Installation Guide - Dafel Technologies"
description: "Complete installation and setup guide for Dafel Technologies enterprise data connector platform. Local development, Docker, and production deployment."
keywords: "installation guide, setup instructions, Docker deployment, enterprise installation, PostgreSQL setup, production deployment"
nav_order: 1
---

# Installation Guide

Complete setup instructions for deploying Dafel Technologies enterprise data connector platform.

<div class="hero-section" style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 40px; border-radius: 15px; margin-bottom: 40px;">
  <h2 style="color: white; margin: 0 0 20px;">Quick Start Installation</h2>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem;">From zero to production in minutes. Choose your deployment method and follow our step-by-step guides.</p>
</div>

## 📋 Table of Contents

- [Quick Start (5 Minutes)](#quick-start-5-minutes)
- [System Requirements](#system-requirements)
- [Installation Methods](#installation-methods)
- [Local Development Setup](#local-development-setup)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Database Setup](#database-setup)
- [Configuration Guide](#configuration-guide)
- [Security Hardening](#security-hardening)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start (5 Minutes)

Get up and running with Dafel Technologies in under 5 minutes.

<div style="background: #d4edda; padding: 30px; border-radius: 15px; margin: 30px 0; border-left: 5px solid #28a745;">

### Prerequisites Check
```bash
# Check Node.js version (16.8.0 or higher)
node --version

# Check npm version
npm --version

# Check PostgreSQL (optional for demo)
psql --version
```

### One-Command Setup
```bash
# Clone and setup in one go
git clone https://github.com/DabtcAvila/Dafel-Technologies.git && \
cd Dafel-Technologies && \
npm install && \
cp .env.example .env && \
npm run dev
```

### Access Your Platform
Open your browser to [http://localhost:3000](http://localhost:3000)

**Demo Credentials:**
- Email: `admin@dafel.tech`
- Password: `DafelSecure2025!`

</div>

---

## 💻 System Requirements

### Minimum Requirements

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 30px 0;">

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; border: 1px solid #dee2e6;">
  <h4 style="margin: 0 0 15px; color: #495057;">Development Environment</h4>
  <ul style="margin: 0; padding-left: 20px;">
    <li><strong>Node.js:</strong> 16.8.0+ (18.x recommended)</li>
    <li><strong>npm:</strong> 7.0.0+ (or yarn 1.22.0+)</li>
    <li><strong>RAM:</strong> 4GB minimum, 8GB recommended</li>
    <li><strong>Storage:</strong> 2GB free space</li>
    <li><strong>OS:</strong> Windows 10+, macOS 10.15+, Linux</li>
  </ul>
</div>

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; border: 1px solid #dee2e6;">
  <h4 style="margin: 0 0 15px; color: #495057;">Production Environment</h4>
  <ul style="margin: 0; padding-left: 20px;">
    <li><strong>CPU:</strong> 2 cores minimum, 4+ recommended</li>
    <li><strong>RAM:</strong> 8GB minimum, 16GB recommended</li>
    <li><strong>Storage:</strong> 20GB+ SSD storage</li>
    <li><strong>Network:</strong> 1Gbps+ for enterprise loads</li>
    <li><strong>OS:</strong> Ubuntu 20.04+, CentOS 8+, RHEL 8+</li>
  </ul>
</div>

</div>

### Database Requirements

<div style="background: #e9ecef; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Supported Databases
- **PostgreSQL:** 13.x, 14.x, 15.x, 16.x (recommended)
- **MySQL:** 5.7.x, 8.0.x (ready for deployment)
- **MongoDB:** 5.x, 6.x, 7.x (ready for deployment)

#### Cloud Database Services
- **AWS RDS** (PostgreSQL, MySQL)
- **Azure Database** (PostgreSQL, MySQL)
- **Google Cloud SQL** (PostgreSQL, MySQL)
- **MongoDB Atlas** (MongoDB)
- **Amazon DocumentDB** (MongoDB compatible)

</div>

---

## 🛠️ Installation Methods

Choose the installation method that best fits your needs:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; margin: 40px 0;">

<div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 15px; padding: 30px; text-align: center;">
  <div style="font-size: 3rem; margin-bottom: 15px;">🚀</div>
  <h3 style="margin: 0 0 15px; color: #155724;">Local Development</h3>
  <p style="color: #155724; margin-bottom: 20px;">Perfect for testing, development, and evaluation</p>
  <ul style="text-align: left; color: #155724; margin: 0; padding-left: 20px;">
    <li>Quick setup (5 minutes)</li>
    <li>Built-in demo database</li>
    <li>Hot reload development</li>
    <li>Full feature access</li>
  </ul>
</div>

<div style="background: #cce5ff; border: 1px solid #b3d9ff; border-radius: 15px; padding: 30px; text-align: center;">
  <div style="font-size: 3rem; margin-bottom: 15px;">🐳</div>
  <h3 style="margin: 0 0 15px; color: #004085;">Docker Deployment</h3>
  <p style="color: #004085; margin-bottom: 20px;">Consistent environment across all platforms</p>
  <ul style="text-align: left; color: #004085; margin: 0; padding-left: 20px;">
    <li>Consistent environment</li>
    <li>Easy scaling</li>
    <li>Production-like setup</li>
    <li>Container orchestration</li>
  </ul>
</div>

<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 15px; padding: 30px; text-align: center;">
  <div style="font-size: 3rem; margin-bottom: 15px;">🏢</div>
  <h3 style="margin: 0 0 15px; color: #856404;">Production Deployment</h3>
  <p style="color: #856404; margin-bottom: 20px;">Enterprise-ready setup for production workloads</p>
  <ul style="text-align: left; color: #856404; margin: 0; padding-left: 20px;">
    <li>High availability</li>
    <li>Security hardened</li>
    <li>Monitoring included</li>
    <li>Auto-scaling ready</li>
  </ul>
</div>

</div>

---

## 🖥️ Local Development Setup

### Step 1: Prerequisites

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Install Node.js
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

#### Install PostgreSQL (Optional)
```bash
# macOS with Homebrew
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-16 postgresql-contrib

# Windows - Download from postgresql.org
# Or use Docker (see Docker section)
```

</div>

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/DabtcAvila/Dafel-Technologies.git
cd Dafel-Technologies

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Step 3: Environment Configuration

<div style="background: #e9ecef; padding: 25px; border-radius: 10px; margin: 20px 0;">

Edit the `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dafel_technologies"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Encryption Key (AES-256-GCM)
ENCRYPTION_KEY="your-32-character-encryption-key"

# Optional: OpenAI API Key for AI features
OPENAI_API_KEY="your-openai-api-key"

# Development Settings
NODE_ENV="development"
LOG_LEVEL="debug"
```

**Security Note:** Generate secure keys using:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -hex 32
```

</div>

### Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed demo data (optional)
npx prisma db seed
```

### Step 5: Start Development Server

```bash
# Start the development server
npm run dev

# Server will start on http://localhost:3000
# API endpoints available at http://localhost:3000/api
```

### Step 6: Access the Platform

<div style="background: #d4edda; padding: 25px; border-radius: 10px; margin: 20px 0;">

1. **Open your browser** to [http://localhost:3000](http://localhost:3000)

2. **Login with demo credentials:**
   - Email: `admin@dafel.tech`
   - Password: `DafelSecure2025!`

3. **Test PostgreSQL connection:**
   - Navigate to "Studio" → "Data Sources"
   - Click "Add Source" → "Use Demo Database"
   - Test the connection to verify setup

</div>

---

## 🐳 Docker Deployment

### Method 1: Docker Compose (Recommended)

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Prerequisites
```bash
# Install Docker and Docker Compose
# macOS/Windows: Download Docker Desktop
# Ubuntu:
sudo apt update
sudo apt install docker.io docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### Quick Start
```bash
# Clone repository
git clone https://github.com/DabtcAvila/Dafel-Technologies.git
cd Dafel-Technologies

# Copy environment file
cp .env.example .env.docker

# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Check service status
docker-compose -f docker-compose.dev.yml ps
```

</div>

### Docker Compose Configuration

<div style="background: #e9ecef; padding: 25px; border-radius: 10px; margin: 20px 0;">

The `docker-compose.dev.yml` includes:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://dafel:password@postgres:5432/dafel_technologies
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: dafel_technologies
      POSTGRES_USER: dafel
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

</div>

### Production Docker Setup

```bash
# Build production image
docker build -t dafel-technologies:latest .

# Run with production settings
docker run -d \
  --name dafel-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="your-production-db-url" \
  -e NEXTAUTH_SECRET="your-production-secret" \
  dafel-technologies:latest
```

---

## 🏢 Production Deployment

### Cloud Deployment Options

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin: 30px 0;">

<div style="background: #fff3cd; padding: 25px; border-radius: 10px; border: 1px solid #ffeaa7;">
  <h4 style="margin: 0 0 15px; color: #856404;">🚀 Vercel (Recommended)</h4>
  <p style="color: #856404; margin-bottom: 15px;">Perfect for Next.js applications with automatic deployments</p>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 0.9rem;">
    # Deploy to Vercel<br>
    npm i -g vercel<br>
    vercel --prod
  </div>
</div>

<div style="background: #cce5ff; padding: 25px; border-radius: 10px; border: 1px solid #b3d9ff;">
  <h4 style="margin: 0 0 15px; color: #004085;">☁️ AWS / Azure / GCP</h4>
  <p style="color: #004085; margin-bottom: 15px;">Enterprise cloud deployment with full control</p>
  <ul style="color: #004085; margin: 0; padding-left: 20px; font-size: 0.9rem;">
    <li>EC2 / VM instances</li>
    <li>Managed databases</li>
    <li>Load balancers</li>
    <li>Auto-scaling groups</li>
  </ul>
</div>

<div style="background: #d1ecf1; padding: 25px; border-radius: 10px; border: 1px solid #bee5eb;">
  <h4 style="margin: 0 0 15px; color: #0c5460;">⚙️ Kubernetes</h4>
  <p style="color: #0c5460; margin-bottom: 15px;">Container orchestration for high availability</p>
  <ul style="color: #0c5460; margin: 0; padding-left: 20px; font-size: 0.9rem;">
    <li>Helm charts included</li>
    <li>Auto-scaling</li>
    <li>Service mesh ready</li>
    <li>Multi-environment</li>
  </ul>
</div>

</div>

### Vercel Deployment (Recommended)

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Production database (PostgreSQL recommended)

#### Step-by-Step Deployment

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Install Vercel CLI
npm i -g vercel

# 3. Login and deploy
vercel login
vercel

# 4. Configure environment variables in Vercel dashboard
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - ENCRYPTION_KEY
```

#### Environment Variables Setup
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:

```bash
DATABASE_URL="postgresql://user:pass@your-db-host:5432/production_db"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
ENCRYPTION_KEY="your-production-encryption-key"
NODE_ENV="production"
```

</div>

### Self-Hosted Production

<div style="background: #e9ecef; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Server Requirements
- **CPU:** 4 cores minimum, 8 cores recommended
- **RAM:** 16GB minimum, 32GB for high-traffic
- **Storage:** 100GB SSD minimum
- **OS:** Ubuntu 20.04 LTS or CentOS 8

#### Setup Script
```bash
#!/bin/bash
# Production deployment script

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone and setup application
git clone https://github.com/DabtcAvila/Dafel-Technologies.git
cd Dafel-Technologies

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Setup environment
cp .env.example .env.production
# Edit .env.production with production values

# Setup database
npx prisma migrate deploy

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'dafel-technologies',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '2G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log'
    }
  ]
};
```

</div>

---

## 🗄️ Database Setup

### PostgreSQL Setup (Recommended)

<div style="background: #d4edda; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Local PostgreSQL Installation

```bash
# macOS with Homebrew
brew install postgresql@16
brew services start postgresql@16

# Create database and user
createdb dafel_technologies
createuser -P dafel_user  # Enter password when prompted
psql -c "GRANT ALL PRIVILEGES ON DATABASE dafel_technologies TO dafel_user;"
```

#### Ubuntu/Debian Installation
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres createdb dafel_technologies
sudo -u postgres createuser -P dafel_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dafel_technologies TO dafel_user;"
```

#### Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run -d \
  --name postgres-dafel \
  -e POSTGRES_DB=dafel_technologies \
  -e POSTGRES_USER=dafel_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16
```

</div>

### Cloud Database Setup

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### AWS RDS PostgreSQL
1. **Create RDS Instance:**
   - Engine: PostgreSQL 16
   - Instance class: db.t3.medium (minimum)
   - Storage: 100GB GP2 SSD
   - Multi-AZ: Yes (for production)

2. **Security Group Configuration:**
   - Allow inbound traffic on port 5432
   - Restrict source to your application servers

3. **Connection String:**
   ```
   postgresql://username:password@your-rds-endpoint.amazonaws.com:5432/dafel_technologies
   ```

#### Azure Database for PostgreSQL
1. **Create Azure Database:**
   - Version: PostgreSQL 16
   - Compute + storage: General Purpose (4 vCore minimum)
   - Backup retention: 7-35 days

2. **Firewall Rules:**
   - Add your application server IPs
   - Enable SSL enforcement

#### Google Cloud SQL
1. **Create Cloud SQL Instance:**
   - Database version: PostgreSQL 16
   - Machine type: db-standard-2 (minimum)
   - Storage: 100GB SSD

2. **Network Configuration:**
   - Authorize application networks
   - Enable SSL connections

</div>

### Database Migration and Seeding

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed demo data (optional)
npx prisma db seed

# Verify database setup
npx prisma studio  # Opens database browser at http://localhost:5555
```

---

## ⚙️ Configuration Guide

### Environment Variables Reference

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Required Variables
```bash
# Database Connection
DATABASE_URL="postgresql://user:pass@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32

# Security
ENCRYPTION_KEY="your-encryption-key"  # Generate with: openssl rand -hex 32
```

#### Optional Variables
```bash
# Logging
LOG_LEVEL="info"                    # debug, info, warn, error
LOG_FILE="logs/app.log"

# Performance
MAX_CONNECTIONS=10                  # Database connection pool size
QUERY_TIMEOUT=60000                # Query timeout in milliseconds
CONNECTION_TIMEOUT=30000           # Connection timeout in milliseconds

# Features
ENABLE_METRICS=true                # Enable Prometheus metrics
ENABLE_AUDIT_LOGS=true            # Enable audit logging
ENABLE_DEMO_MODE=false            # Enable demo database features

# External Services
OPENAI_API_KEY="your-openai-key"  # For AI-powered features
REDIS_URL="redis://localhost:6379"  # For caching (optional)

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

</div>

### Advanced Configuration

<div style="background: #e9ecef; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Custom Configuration File (config/production.json)
```json
{
  "database": {
    "pool": {
      "min": 2,
      "max": 10,
      "acquireTimeoutMillis": 30000,
      "idleTimeoutMillis": 30000
    },
    "ssl": {
      "rejectUnauthorized": false
    }
  },
  "security": {
    "rateLimiting": {
      "windowMs": 900000,
      "max": 100
    },
    "cors": {
      "origins": ["https://your-domain.com"],
      "credentials": true
    }
  },
  "monitoring": {
    "healthCheck": {
      "interval": 30000,
      "timeout": 5000
    },
    "metrics": {
      "enabled": true,
      "endpoint": "/metrics"
    }
  }
}
```

#### Load Configuration
```javascript
// In your application
const config = require('./config/production.json');

// Use environment-specific configurations
const dbConfig = {
  ...config.database,
  connectionString: process.env.DATABASE_URL
};
```

</div>

---

## 🔒 Security Hardening

### Production Security Checklist

<div style="background: #f8d7da; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #dc3545;">

#### ✅ Essential Security Measures

```bash
# 1. Generate secure secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# 2. Enable HTTPS only
NEXTAUTH_URL="https://your-secure-domain.com"

# 3. Database security
# - Use SSL connections
# - Restrict database access by IP
# - Use strong passwords
# - Regular security updates

# 4. Environment variables
# - Never commit secrets to version control
# - Use secure environment variable management
# - Rotate secrets regularly

# 5. Network security
# - Use firewalls
# - Restrict API access
# - Enable CORS properly
# - Rate limiting enabled
```

</div>

### SSL/TLS Configuration

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Nginx Configuration (if using reverse proxy)
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Database SSL Configuration
```bash
# PostgreSQL SSL connection string
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# For self-signed certificates
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require&sslcert=client-cert.pem&sslkey=client-key.pem&sslrootcert=ca-cert.pem"
```

</div>

### Monitoring and Alerting

<div style="background: #d1ecf1; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Health Check Endpoint
```bash
# Monitor application health
curl https://your-domain.com/api/health

# Expected response
{
  "status": "HEALTHY",
  "timestamp": "2024-01-03T10:30:00Z",
  "services": {
    "database": "HEALTHY",
    "redis": "HEALTHY"
  }
}
```

#### Set Up Monitoring
```bash
# Install monitoring tools
npm install @prometheus/client

# Basic health monitoring script
#!/bin/bash
HEALTH_URL="https://your-domain.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "Service is healthy"
else
    echo "Service is unhealthy (HTTP $RESPONSE)"
    # Send alert notification
fi
```

</div>

---

## 🔧 Troubleshooting

### Common Issues and Solutions

<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Issue: Port 3000 already in use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev
```

#### Issue: Database connection failed
```bash
# Check database status
sudo systemctl status postgresql

# Test connection manually
psql -h localhost -p 5432 -U your_user -d your_database

# Check environment variables
echo $DATABASE_URL

# Verify database exists
psql -l
```

#### Issue: Permission denied errors
```bash
# Fix file permissions
chmod +x scripts/*.sh
chown -R $USER:$USER .

# For Docker issues
sudo usermod -a -G docker $USER
newgrp docker
```

#### Issue: Build failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

</div>

### Performance Optimization

<div style="background: #e9ecef; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Database Performance
```bash
# Optimize PostgreSQL settings
# In postgresql.conf:
shared_buffers = 256MB
work_mem = 4MB
maintenance_work_mem = 64MB
effective_cache_size = 1GB
random_page_cost = 1.1

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Application Performance
```javascript
// In next.config.js
module.exports = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['your-image-domain.com'],
  },
  // Enable compression
  compress: true,
  // Optimize builds
  swcMinify: true,
}
```

#### Memory and CPU Optimization
```bash
# Monitor resource usage
htop
free -h
df -h

# For PM2 deployments
pm2 monit

# Optimize Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
```

</div>

### Getting Help

<div style="background: #d4edda; padding: 25px; border-radius: 10px; margin: 20px 0;">

#### Support Channels
- **Documentation:** [https://dabtcavila.github.io/Dafel-Technologies/](https://dabtcavila.github.io/Dafel-Technologies/)
- **GitHub Issues:** [https://github.com/DabtcAvila/Dafel-Technologies/issues](https://github.com/DabtcAvila/Dafel-Technologies/issues)
- **Enterprise Support:** [contact@dafelconsulting.com](mailto:contact@dafelconsulting.com)

#### Before Seeking Help
1. Check the logs: `tail -f logs/app.log`
2. Verify environment variables
3. Test database connectivity
4. Check system requirements
5. Review configuration files

#### Provide This Information
- Operating system and version
- Node.js and npm versions
- Database type and version
- Error messages and logs
- Steps to reproduce the issue
- Environment configuration (without secrets)

</div>

---

## 🎯 Next Steps

<div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px; border-radius: 15px; text-align: center; margin: 40px 0;">
  <h3 style="color: white; margin-bottom: 20px;">Installation Complete!</h3>
  <p style="margin-bottom: 30px; opacity: 0.9;">Your Dafel Technologies platform is now running. Here's what to do next:</p>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
    <a href="/docs/features/" style="background: rgba(255,255,255,0.2); color: white; padding: 20px; text-decoration: none; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);">
      <div style="font-size: 2rem; margin-bottom: 10px;">📚</div>
      <strong>Explore Features</strong><br>
      <small>Learn about all capabilities</small>
    </a>
    
    <a href="/docs/api/" style="background: rgba(255,255,255,0.2); color: white; padding: 20px; text-decoration: none; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);">
      <div style="font-size: 2rem; margin-bottom: 10px;">🔧</div>
      <strong>API Reference</strong><br>
      <small>Integrate with your apps</small>
    </a>
    
    <a href="/docs/architecture/" style="background: rgba(255,255,255,0.2); color: white; padding: 20px; text-decoration: none; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);">
      <div style="font-size: 2rem; margin-bottom: 10px;">🏗️</div>
      <strong>Architecture</strong><br>
      <small>Understand the system</small>
    </a>
    
    <a href="mailto:contact@dafelconsulting.com" style="background: rgba(255,255,255,0.2); color: white; padding: 20px; text-decoration: none; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);">
      <div style="font-size: 2rem; margin-bottom: 10px;">💼</div>
      <strong>Enterprise Support</strong><br>
      <small>Get professional help</small>
    </a>
  </div>
</div>

---

<footer style="margin-top: 60px; padding: 30px; background: #f8f9fa; border-radius: 10px; text-align: center;">
  <p><strong>Dafel Technologies Installation Guide</strong></p>
  <p>© 2024 Dafel Consulting. All rights reserved.</p>
  <p style="margin-top: 20px;">
    <a href="/" style="color: #667eea; text-decoration: none; margin: 0 15px;">← Back to Home</a>
    <a href="/docs/features/" style="color: #667eea; text-decoration: none; margin: 0 15px;">Features</a>
    <a href="/docs/api/" style="color: #667eea; text-decoration: none; margin: 0 15px;">API Reference</a>
    <a href="/docs/architecture/" style="color: #667eea; text-decoration: none; margin: 0 15px;">Architecture</a>
  </p>
</footer>