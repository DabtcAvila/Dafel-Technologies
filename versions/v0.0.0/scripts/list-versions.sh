#!/bin/bash
# 📋 LIST VERSIONS SCRIPT - DAFEL TECHNOLOGIES
# 
# Script para mostrar todas las versiones disponibles con sus URLs y estado
#
# USO: ./scripts/list-versions.sh

set -e  # Exit on error

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}📋 VERSIONES DAFEL TECHNOLOGIES${NC}"
echo -e "${PURPLE}==============================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo -e "${RED}❌ ERROR: No estás en el directorio raíz de Dafel Technologies${NC}"
    exit 1
fi

# Obtener versión actual
cd apps/frontend
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.1.0")
cd ../..

# Obtener rama actual
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

echo -e "${CYAN}📍 Estado actual:${NC}"
echo -e "${CYAN}├── Versión: v$CURRENT_VERSION${NC}"
echo -e "${CYAN}└── Rama: $CURRENT_BRANCH${NC}"
echo ""

# Mostrar versiones respaldadas localmente
echo -e "${BLUE}📦 VERSIONES RESPALDADAS:${NC}"
echo ""

if [[ -d "versions" ]]; then
    FOUND_VERSIONS=false
    
    for VERSION_DIR in versions/*/; do
        if [[ -d "$VERSION_DIR" ]]; then
            FOUND_VERSIONS=true
            VERSION_NAME=$(basename "$VERSION_DIR")
            
            # Obtener información de la versión
            if [[ -f "$VERSION_DIR/version-info.json" ]]; then
                VERSION_INFO=$(cat "$VERSION_DIR/version-info.json")
                DATE=$(echo "$VERSION_INFO" | grep '"date"' | cut -d'"' -f4 | cut -dT -f1 2>/dev/null || echo "N/A")
                BRANCH=$(echo "$VERSION_INFO" | grep '"branch"' | cut -d'"' -f4 2>/dev/null || echo "N/A")
                DEPLOY_URL=$(echo "$VERSION_INFO" | grep '"deployUrl"' | cut -d'"' -f4 2>/dev/null || echo "N/A")
            else
                DATE="N/A"
                BRANCH="N/A"
                DEPLOY_URL="N/A"
            fi
            
            # Calcular tamaño del backup
            SIZE=$(du -sh "$VERSION_DIR" 2>/dev/null | cut -f1 || echo "N/A")
            
            # Determinar estado
            if [[ "$VERSION_NAME" == "v$CURRENT_VERSION" ]]; then
                STATUS="🔄 En desarrollo"
            else
                STATUS="✅ Completa"
            fi
            
            echo -e "${GREEN}$VERSION_NAME $STATUS${NC}"
            echo -e "${GREEN}├── 📁 Backup: $VERSION_DIR ($SIZE)${NC}"
            
            if [[ "$DEPLOY_URL" != "N/A" ]]; then
                echo -e "${GREEN}├── 🌐 URL: $DEPLOY_URL${NC}"
            else
                # Calcular URL basada en el número de versión
                VERSION_NUM=$(echo "$VERSION_NAME" | sed 's/v0\.\([0-9]*\)\.0/\1/')
                if [[ "$VERSION_NUM" =~ ^[0-9]+$ ]]; then
                    FORMATTED_NUM=$(printf "%02d" $VERSION_NUM)
                    echo -e "${GREEN}├── 🌐 URL: dafel.com.mx/dev/v$FORMATTED_NUM${NC}"
                fi
            fi
            
            echo -e "${GREEN}├── 📅 Fecha: $DATE${NC}"
            echo -e "${GREEN}└── 🌿 Rama: $BRANCH${NC}"
            echo ""
        fi
    done
    
    if [[ "$FOUND_VERSIONS" == false ]]; then
        echo -e "${YELLOW}📂 No hay versiones respaldadas aún${NC}"
        echo -e "${YELLOW}   Usa '/newversion' para crear la primera versión${NC}"
        echo ""
    fi
else
    echo -e "${YELLOW}📂 Carpeta 'versions/' no existe${NC}"
    echo -e "${YELLOW}   Usa '/newversion' para crear la primera versión${NC}"
    echo ""
fi

# Mostrar ramas de desarrollo disponibles
echo -e "${BLUE}🌿 RAMAS DE DESARROLLO:${NC}"
echo ""

# Obtener todas las ramas que empiecen con "development-v"
DEVELOPMENT_BRANCHES=$(git branch -a | grep "development-v" | sed 's/*//' | sed 's/^[[:space:]]*//' | sort -V)

if [[ -n "$DEVELOPMENT_BRANCHES" ]]; then
    while IFS= read -r branch; do
        # Limpiar nombre de la rama
        CLEAN_BRANCH=$(echo "$branch" | sed 's/remotes\/origin\///')
        
        if [[ "$CLEAN_BRANCH" == "$CURRENT_BRANCH" ]]; then
            echo -e "${GREEN}├── $CLEAN_BRANCH ${CYAN}(actual)${NC}"
        else
            echo -e "${GREEN}├── $CLEAN_BRANCH${NC}"
        fi
    done <<< "$DEVELOPMENT_BRANCHES"
else
    echo -e "${YELLOW}├── No hay ramas de desarrollo específicas${NC}"
fi
echo ""

# Mostrar configuraciones de deployment disponibles
echo -e "${BLUE}🌐 CONFIGURACIONES DE DEPLOYMENT:${NC}"
echo ""

if [[ -d "deployment" ]]; then
    FOUND_DEPLOYS=false
    
    for DEPLOY_DIR in deployment/*/; do
        if [[ -d "$DEPLOY_DIR" ]]; then
            FOUND_DEPLOYS=true
            DEPLOY_VERSION=$(basename "$DEPLOY_DIR")
            
            # Leer configuración de deployment
            if [[ -f "$DEPLOY_DIR/deploy-config.json" ]]; then
                DEPLOY_CONFIG=$(cat "$DEPLOY_DIR/deploy-config.json")
                DEPLOY_URL=$(echo "$DEPLOY_CONFIG" | grep '"deployUrl"' | cut -d'"' -f4 2>/dev/null || echo "N/A")
                ENVIRONMENT=$(echo "$DEPLOY_CONFIG" | grep '"environment"' | cut -d'"' -f4 2>/dev/null || echo "development")
            else
                DEPLOY_URL="N/A"
                ENVIRONMENT="development"
            fi
            
            echo -e "${GREEN}├── $DEPLOY_VERSION${NC}"
            echo -e "${GREEN}│   ├── URL: $DEPLOY_URL${NC}"
            echo -e "${GREEN}│   └── Entorno: $ENVIRONMENT${NC}"
        fi
    done
    
    if [[ "$FOUND_DEPLOYS" == false ]]; then
        echo -e "${YELLOW}├── No hay configuraciones de deployment${NC}"
    fi
else
    echo -e "${YELLOW}├── Carpeta 'deployment/' no existe${NC}"
fi
echo ""

# Resumen
echo -e "${PURPLE}📊 RESUMEN:${NC}"
echo ""

# Contar versiones
VERSION_COUNT=0
if [[ -d "versions" ]]; then
    VERSION_COUNT=$(find versions/ -maxdepth 1 -type d | wc -l)
    VERSION_COUNT=$((VERSION_COUNT - 1))  # Restar 1 por la carpeta padre
fi

# Contar ramas
BRANCH_COUNT=$(echo "$DEVELOPMENT_BRANCHES" | wc -l | tr -d ' ')
if [[ -z "$DEVELOPMENT_BRANCHES" ]]; then
    BRANCH_COUNT=0
fi

# Contar deployments
DEPLOY_COUNT=0
if [[ -d "deployment" ]]; then
    DEPLOY_COUNT=$(find deployment/ -maxdepth 1 -type d | wc -l)
    DEPLOY_COUNT=$((DEPLOY_COUNT - 1))  # Restar 1 por la carpeta padre
fi

echo -e "${CYAN}├── 📦 Versiones respaldadas: $VERSION_COUNT${NC}"
echo -e "${CYAN}├── 🌿 Ramas de desarrollo: $BRANCH_COUNT${NC}"
echo -e "${CYAN}└── 🌐 Configuraciones deploy: $DEPLOY_COUNT${NC}"
echo ""

# Comandos útiles
echo -e "${YELLOW}🚀 COMANDOS ÚTILES:${NC}"
echo ""
echo -e "${YELLOW}├── /newversion${NC} - Crear nueva versión"
echo -e "${YELLOW}├── /dafelwork${NC} - Configurar entorno de trabajo"
echo -e "${YELLOW}└── /start${NC} - Inicio rápido para desarrollo"
echo ""

# URLs de desarrollo disponibles
echo -e "${BLUE}🌐 URLs DE DESARROLLO DISPONIBLES:${NC}"
echo ""

# Mostrar URLs basadas en las versiones encontradas
if [[ -d "versions" ]]; then
    for VERSION_DIR in versions/*/; do
        if [[ -d "$VERSION_DIR" ]]; then
            VERSION_NAME=$(basename "$VERSION_DIR")
            # Extraer número de versión
            VERSION_NUM=$(echo "$VERSION_NAME" | sed 's/v0\.\([0-9]*\)\.0/\1/')
            if [[ "$VERSION_NUM" =~ ^[0-9]+$ ]]; then
                FORMATTED_NUM=$(printf "%02d" $VERSION_NUM)
                if [[ "$VERSION_NAME" == "v$CURRENT_VERSION" ]]; then
                    echo -e "${GREEN}├── https://dafel.com.mx/dev/v$FORMATTED_NUM ${CYAN}($VERSION_NAME - actual)${NC}"
                else
                    echo -e "${GREEN}├── https://dafel.com.mx/dev/v$FORMATTED_NUM ${YELLOW}($VERSION_NAME)${NC}"
                fi
            fi
        fi
    done
else
    echo -e "${YELLOW}├── No hay URLs de desarrollo configuradas${NC}"
    echo -e "${YELLOW}└── Usa '/newversion' para crear la primera versión${NC}"
fi

echo ""
echo -e "${GREEN}✅ Listado completo de versiones${NC}"
echo ""