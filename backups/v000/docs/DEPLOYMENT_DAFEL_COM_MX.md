# 🚀 Deployment Guide: Dafel Technologies → dafel.com.mx

## 📋 Overview
Esta guía documenta el proceso completo para desplegar Dafel Technologies en producción usando el dominio **dafel.com.mx**.

## 🎯 Arquitectura de Producción

```
Internet → CloudFlare → Load Balancer → Nginx → Next.js App
                                     ↓
                              PostgreSQL + Redis
                                     ↓
                            Grafana + Prometheus
```

## 🔧 Configuración Inicial

### 1. Servidor de Producción
**Requisitos mínimos:**
- **CPU**: 4 vCores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Docker**: 24+
- **Docker Compose**: v2+

### 2. Dominio y DNS
- **Dominio**: ✅ `dafel.com.mx` (adquirido)
- **DNS Records necesarios**:
  ```
  A     dafel.com.mx      → [SERVER_IP]
  A     www.dafel.com.mx  → [SERVER_IP]
  A     api.dafel.com.mx  → [SERVER_IP]
  CNAME *                 → dafel.com.mx
  ```

### 3. SSL/TLS
- **Recomendado**: Let's Encrypt (Gratuito)
- **Alternativo**: Certificado comercial
- **Auto-renovación**: Configurada via Certbot

## 🛠 Pre-Deployment Setup

### 1. Configurar Variables de Entorno
```bash
# Copiar template de producción
cp .env.production.example .env.production

# Editar con valores reales
nano .env.production
```

**Variables críticas a configurar:**
- `DATABASE_URL`: Conexión a PostgreSQL de producción
- `NEXTAUTH_SECRET`: String aleatorio de 64 caracteres
- `DB_PASSWORD`: Contraseña fuerte para PostgreSQL
- `REDIS_PASSWORD`: Contraseña para Redis
- `GRAFANA_PASSWORD`: Contraseña para Grafana

### 2. Configurar SSL Certificates
```bash
# Crear directorio para certificados
mkdir -p nginx/ssl

# Opción 1: Let's Encrypt (Recomendado)
certbot certonly --standalone -d dafel.com.mx -d www.dafel.com.mx

# Copiar certificados
cp /etc/letsencrypt/live/dafel.com.mx/fullchain.pem nginx/ssl/dafel.com.mx.crt
cp /etc/letsencrypt/live/dafel.com.mx/privkey.pem nginx/ssl/dafel.com.mx.key
```

## 🚀 Proceso de Deployment

### Opción 1: Deployment Automático
```bash
# Ejecutar script de deployment
NODE_ENV=production ./scripts/deployment/deploy.sh
```

### Opción 2: Deployment Manual

#### Paso 1: Build y Test
```bash
# Build de producción
npm run build

# Ejecutar tests
npm run test:unit
npm run test:e2e

# Audit de seguridad
npm audit --audit-level moderate
```

#### Paso 2: Docker Build
```bash
# Build de imágenes Docker
docker-compose -f docker-compose.production.yml build

# Verificar imágenes
docker images | grep dafel
```

#### Paso 3: Deploy
```bash
# Iniciar servicios de producción
docker-compose -f docker-compose.production.yml up -d

# Verificar servicios
docker-compose -f docker-compose.production.yml ps
```

#### Paso 4: Database Setup
```bash
# Ejecutar migraciones
docker-compose exec dafel-frontend npm run prisma:migrate:deploy

# Seed inicial (solo primera vez)
docker-compose exec dafel-frontend npm run prisma:seed
```

## 🔍 Verificación Post-Deployment

### 1. Health Checks
```bash
# Frontend
curl -f https://dafel.com.mx/health

# API
curl -f https://dafel.com.mx/api/health

# Database
docker-compose exec postgres pg_isready
```

### 2. Performance Tests
```bash
# Load testing
npm run test:performance

# Lighthouse audit
npm run lighthouse
```

### 3. Security Verification
```bash
# SSL Test
curl -I https://dafel.com.mx

# Security headers
curl -I https://dafel.com.mx | grep -E "(X-|Strict|Content-Security)"

# OWASP ZAP scan
npm run test:security:zap
```

## 📊 Monitoring & Observability

### URLs de Monitoreo
- **Aplicación**: https://dafel.com.mx
- **Grafana**: http://[SERVER_IP]:3001
- **Prometheus**: http://[SERVER_IP]:9090
- **Logs**: `docker-compose logs -f`

### Métricas Clave
- **Response Time**: < 200ms
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%
- **CPU Usage**: < 70%
- **Memory Usage**: < 80%

## 🔄 Maintenance & Updates

### 1. Backup Strategy
```bash
# Database backup diario
docker-compose exec postgres pg_dump dafel_production > backups/db_$(date +%Y%m%d).sql

# Files backup
rsync -av uploads/ backups/uploads/
```

### 2. Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d --no-deps dafel-frontend
```

### 3. Rollback
```bash
# Rollback to previous version
docker-compose -f docker-compose.production.yml down
git checkout [previous-commit]
docker-compose -f docker-compose.production.yml up -d
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use
```bash
# Kill process using port 3000
sudo lsof -t -i:3000 | xargs sudo kill -9
```

#### 2. SSL Certificate Issues
```bash
# Renew Let's Encrypt certificate
certbot renew --dry-run
```

#### 3. Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U dafel_prod_user -d dafel_production -c "SELECT NOW();"
```

#### 4. High Memory Usage
```bash
# Check memory usage
docker stats

# Restart services if needed
docker-compose restart
```

## 📞 Support Contacts

- **Technical Lead**: desarrollo@dafel.com.mx
- **DevOps**: devops@dafel.com.mx  
- **Emergency**: +52-xxx-xxx-xxxx

## 🎉 Go-Live Checklist

- [ ] DNS configured and propagated
- [ ] SSL certificates installed and valid
- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] Health checks passing
- [ ] Performance tests passing
- [ ] Security scans clear
- [ ] Monitoring dashboards active
- [ ] Backup procedures tested
- [ ] Team notifications sent

---

## 🌟 ¡Dafel Technologies está listo para conquistar el mercado!

**Live URL**: https://dafel.com.mx
**Status**: 🟢 READY FOR PRODUCTION

¡El futuro de la IA empresarial mexicana comienza ahora! 🇲🇽🚀