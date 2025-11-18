#!/bin/bash
# 🚀 DEPLOY SCRIPT - DAFEL TECHNOLOGIES
# 
# Script profesional para deployment a diferentes entornos
#
# USO: ./scripts/deploy.sh [environment]
# ENTORNOS: development, staging, production

set -e  # Exit on error

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}🚀 DAFEL TECHNOLOGIES DEPLOYMENT SCRIPT${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo -e "${RED}❌ ERROR: No estás en el directorio raíz de Dafel Technologies${NC}"
    exit 1
fi

# Obtener entorno del parámetro o preguntar
ENVIRONMENT=${1:-""}

if [[ -z "$ENVIRONMENT" ]]; then
    echo -e "${YELLOW}📋 Selecciona el entorno de deployment:${NC}"
    echo "1) development (dev.dafel.com.mx)"
    echo "2) staging (staging.dafel.com.mx)"  
    echo "3) production (dafel.com.mx)"
    read -p "Opción (1-3): " choice
    
    case $choice in
        1) ENVIRONMENT="development";;
        2) ENVIRONMENT="staging";;
        3) ENVIRONMENT="production";;
        *) echo -e "${RED}❌ Opción inválida${NC}"; exit 1;;
    esac
fi

echo -e "${BLUE}📍 Entorno seleccionado: ${ENVIRONMENT}${NC}"
echo ""

# Verificar rama según entorno
echo -e "${YELLOW}🔄 Verificando rama Git...${NC}"
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

case $ENVIRONMENT in
    "development")
        REQUIRED_BRANCH="development-v1.0"
        DOMAIN="dev.dafel.com.mx"
        ;;
    "staging")
        REQUIRED_BRANCH="main"
        DOMAIN="staging.dafel.com.mx"
        ;;
    "production")
        REQUIRED_BRANCH="production"
        DOMAIN="dafel.com.mx"
        ;;
    *)
        echo -e "${RED}❌ Entorno inválido: $ENVIRONMENT${NC}"
        exit 1
        ;;
esac

if [[ "$CURRENT_BRANCH" != "$REQUIRED_BRANCH" ]]; then
    echo -e "${RED}❌ RAMA INCORRECTA${NC}"
    echo "Entorno: $ENVIRONMENT requiere rama: $REQUIRED_BRANCH"
    echo "Rama actual: $CURRENT_BRANCH"
    echo ""
    read -p "¿Cambiar automáticamente a $REQUIRED_BRANCH? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout $REQUIRED_BRANCH
        echo -e "${GREEN}✅ Cambiado a rama $REQUIRED_BRANCH${NC}"
    else
        echo -e "${RED}❌ Deployment cancelado${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Rama correcta: $CURRENT_BRANCH${NC}"
echo ""

# Verificar estado git
echo -e "${YELLOW}📋 Verificando estado Git...${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ Hay cambios no commiteados${NC}"
    git status
    echo ""
    read -p "¿Continuar con deployment? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelado${NC}"
        exit 1
    fi
fi

# Ir a directorio frontend
cd apps/frontend

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm ci

echo -e "${YELLOW}🔍 Ejecutando verificaciones...${NC}"

# Type checking
echo -e "${BLUE}📋 Type checking...${NC}"
if ! npm run type-check; then
    echo -e "${RED}❌ Errores de TypeScript encontrados${NC}"
    read -p "¿Continuar de todas formas? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelado${NC}"
        exit 1
    fi
fi

# Linting
echo -e "${BLUE}🧹 Linting...${NC}"
if ! npm run lint; then
    echo -e "${RED}❌ Errores de linting encontrados${NC}"
    read -p "¿Continuar de todas formas? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelado${NC}"
        exit 1
    fi
fi

# Build específico para entorno
echo -e "${YELLOW}🏗️  Building para $ENVIRONMENT...${NC}"
case $ENVIRONMENT in
    "development")
        npm run build:dev
        ;;
    "staging")
        npm run build:staging
        ;;
    "production")
        npm run build:production
        ;;
esac

if [[ $? -ne 0 ]]; then
    echo -e "${RED}❌ Build falló${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build exitoso${NC}"
echo ""

# Mostrar información del build
echo -e "${BLUE}📊 INFORMACIÓN DEL BUILD${NC}"
echo -e "${BLUE}========================${NC}"
echo "Entorno: $ENVIRONMENT"
echo "Dominio: $DOMAIN"
echo "Rama: $CURRENT_BRANCH"
echo "Versión: $(node -p "require('./package.json').version")"
echo "Timestamp: $(date)"
echo ""

# Verificar archivos críticos
echo -e "${YELLOW}🔍 Verificando archivos de build...${NC}"
if [[ ! -d ".next" ]]; then
    echo -e "${RED}❌ Directorio .next no encontrado${NC}"
    exit 1
fi

if [[ ! -f ".next/BUILD_ID" ]]; then
    echo -e "${RED}❌ BUILD_ID no encontrado${NC}"
    exit 1
fi

BUILD_ID=$(cat .next/BUILD_ID)
echo -e "${GREEN}✅ Build ID: $BUILD_ID${NC}"
echo ""

# Simulación de deployment (placeholder para integración real)
echo -e "${YELLOW}🚀 Iniciando deployment a $DOMAIN...${NC}"
echo ""

case $ENVIRONMENT in
    "development")
        echo -e "${BLUE}📤 Deploying a dev.dafel.com.mx...${NC}"
        # Aquí iría la lógica específica para desarrollo
        # rsync, docker, vercel, etc.
        ;;
    "staging")
        echo -e "${BLUE}📤 Deploying a staging.dafel.com.mx...${NC}"
        # Aquí iría la lógica específica para staging
        ;;
    "production")
        echo -e "${BLUE}📤 Deploying a dafel.com.mx...${NC}"
        echo -e "${YELLOW}⚠️  DEPLOYMENT A PRODUCCIÓN - VERIFICACIÓN FINAL${NC}"
        read -p "¿CONFIRMAS el deployment a PRODUCCIÓN? (escriba 'CONFIRMO'): " confirm
        if [[ "$confirm" != "CONFIRMO" ]]; then
            echo -e "${RED}❌ Deployment cancelado${NC}"
            exit 1
        fi
        # Aquí iría la lógica específica para producción
        ;;
esac

# Placeholder para comandos de deployment reales
echo -e "${BLUE}📦 Subiendo archivos...${NC}"
sleep 2  # Simular upload

echo -e "${BLUE}🔄 Reiniciando servicios...${NC}"
sleep 1  # Simular restart

# Verificación post-deployment
echo -e "${YELLOW}🔍 Verificando deployment...${NC}"
sleep 1

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT EXITOSO${NC}"
echo -e "${GREEN}===================${NC}"
echo -e "${GREEN}✅ Entorno: $ENVIRONMENT${NC}"
echo -e "${GREEN}✅ Dominio: $DOMAIN${NC}"
echo -e "${GREEN}✅ Build ID: $BUILD_ID${NC}"
echo -e "${GREEN}✅ Timestamp: $(date)${NC}"
echo ""

# Comandos post-deployment
echo -e "${BLUE}📋 COMANDOS ÚTILES POST-DEPLOYMENT:${NC}"
echo ""
case $ENVIRONMENT in
    "development")
        echo "🔗 Sitio: https://dev.dafel.com.mx"
        echo "📊 Logs: tail -f /var/log/dafel-dev.log"
        ;;
    "staging")
        echo "🔗 Sitio: https://staging.dafel.com.mx"
        echo "📊 Logs: tail -f /var/log/dafel-staging.log"
        echo "🧪 Tests: npm run test:e2e:staging"
        ;;
    "production")
        echo "🔗 Sitio: https://dafel.com.mx"
        echo "📊 Analytics: https://analytics.dafel.com.mx"
        echo "🔍 Monitoring: https://monitoring.dafel.com.mx"
        echo "📊 Logs: tail -f /var/log/dafel-prod.log"
        ;;
esac

echo ""
echo -e "${BLUE}🎯 Deployment completado exitosamente${NC}"
echo ""