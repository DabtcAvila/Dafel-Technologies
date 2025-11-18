#!/bin/bash
# Deployment Script for Dafel Technologies to dafel.com.mx
# Production deployment automation

set -e

echo "🚀 Starting deployment to dafel.com.mx..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if environment is production
if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}Warning: NODE_ENV is not set to production${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Pre-deployment checks
echo -e "${BLUE}Step 1: Running pre-deployment checks...${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    exit 1
fi

# Check if SSL certificates exist (placeholder)
echo -e "${YELLOW}Note: Make sure SSL certificates are properly configured for dafel.com.mx${NC}"

# Step 2: Build application
echo -e "${BLUE}Step 2: Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Deployment aborted.${NC}"
    exit 1
fi

# Step 3: Run tests
echo -e "${BLUE}Step 3: Running tests...${NC}"
npm run test:unit

if [ $? -ne 0 ]; then
    echo -e "${RED}Tests failed! Deployment aborted.${NC}"
    exit 1
fi

# Step 4: Security audit
echo -e "${BLUE}Step 4: Running security audit...${NC}"
npm audit --audit-level moderate

# Step 5: Build Docker images
echo -e "${BLUE}Step 5: Building Docker images...${NC}"
docker-compose -f docker-compose.production.yml build

if [ $? -ne 0 ]; then
    echo -e "${RED}Docker build failed! Deployment aborted.${NC}"
    exit 1
fi

# Step 6: Start production services
echo -e "${BLUE}Step 6: Starting production services...${NC}"
docker-compose -f docker-compose.production.yml up -d

# Step 7: Health check
echo -e "${BLUE}Step 7: Performing health check...${NC}"
sleep 30

# Check if frontend is responding
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend health check passed${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    echo "Checking logs..."
    docker-compose -f docker-compose.production.yml logs dafel-frontend
    exit 1
fi

# Step 8: Database migration (if needed)
echo -e "${BLUE}Step 8: Running database migrations...${NC}"
docker-compose -f docker-compose.production.yml exec dafel-frontend npm run prisma:migrate:deploy

# Step 9: Final verification
echo -e "${BLUE}Step 9: Final verification...${NC}"
echo "Services status:"
docker-compose -f docker-compose.production.yml ps

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Dafel Technologies is now live at: https://dafel.com.mx${NC}"
echo ""
echo "Next steps:"
echo "1. Configure DNS to point dafel.com.mx to your server"
echo "2. Set up SSL certificates (Let's Encrypt recommended)"
echo "3. Configure monitoring and alerts"
echo "4. Set up backup procedures"
echo ""
echo "Monitoring URLs:"
echo "- Application: https://dafel.com.mx"
echo "- Grafana: http://your-server:3001"
echo "- Prometheus: http://your-server:9090"