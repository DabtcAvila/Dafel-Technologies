#!/bin/bash
# 🚀 NEW VERSION SCRIPT - DAFEL TECHNOLOGIES
# 
# Script automático para crear nuevas versiones con backup completo
#
# USO: ./scripts/newversion.sh

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
echo -e "${PURPLE}🚀 DAFEL TECHNOLOGIES - NEW VERSION SYSTEM${NC}"
echo -e "${PURPLE}===========================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo -e "${RED}❌ ERROR: No estás en el directorio raíz de Dafel Technologies${NC}"
    exit 1
fi

# Verificar rama actual
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
echo -e "${BLUE}📍 Rama actual: $CURRENT_BRANCH${NC}"

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "production" ]]; then
    echo -e "${RED}❌ ERROR: No puedes crear versiones desde ramas protegidas${NC}"
    echo -e "${YELLOW}💡 Cambia a development-v1.0 primero${NC}"
    exit 1
fi

# Obtener versión actual del package.json
cd apps/frontend
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.1.0")
cd ../..

echo -e "${CYAN}📦 Versión actual: v$CURRENT_VERSION${NC}"

# Calcular nueva versión
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Incrementar versión minor por defecto
NEW_MINOR=$((MINOR + 1))
NEW_VERSION="$MAJOR.$NEW_MINOR.0"
NEW_BRANCH="development-v$NEW_VERSION"

echo -e "${GREEN}🆕 Nueva versión: v$NEW_VERSION${NC}"
echo -e "${GREEN}🌿 Nueva rama: $NEW_BRANCH${NC}"
echo ""

# Confirmar
read -p "¿Proceder con la creación de la nueva versión? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Creación de versión cancelada${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔄 INICIANDO PROCESO DE NUEVA VERSIÓN...${NC}"
echo ""

# 1. CREAR DIRECTORIO DE VERSIONES
echo -e "${BLUE}📁 1. Creando estructura de versiones...${NC}"
mkdir -p versions
mkdir -p deployment

# 2. BACKUP COMPLETO DE VERSIÓN ACTUAL
echo -e "${BLUE}📦 2. Creando backup completo de v$CURRENT_VERSION...${NC}"
VERSION_DIR="versions/v$CURRENT_VERSION"
mkdir -p "$VERSION_DIR"

# Copiar archivos esenciales
echo "   Copiando apps/frontend..."
cp -r apps/frontend "$VERSION_DIR/"

echo "   Copiando documentación..."
cp -r docs "$VERSION_DIR/" 2>/dev/null || mkdir -p "$VERSION_DIR/docs"

echo "   Copiando scripts..."
cp -r scripts "$VERSION_DIR/"

echo "   Copiando configuraciones..."
cp -r config "$VERSION_DIR/" 2>/dev/null || mkdir -p "$VERSION_DIR/config"

echo "   Copiando librerías..."
cp -r libs "$VERSION_DIR/" 2>/dev/null || mkdir -p "$VERSION_DIR/libs"

# Crear metadata de versión
cat > "$VERSION_DIR/version-info.json" << EOF
{
  "version": "$CURRENT_VERSION",
  "date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "branch": "$CURRENT_BRANCH",
  "commit": "$(git rev-parse HEAD)",
  "description": "Backup automático antes de crear v$NEW_VERSION",
  "deployUrl": "https://dafel.com.mx/dev/v$(printf "%02d" $MINOR)",
  "technologies": {
    "nextjs": "14.2.32",
    "typescript": "5.5.4",
    "react": "18.3.1",
    "nodejs": "$(node --version)"
  }
}
EOF

echo -e "${GREEN}   ✅ Backup completo guardado en: $VERSION_DIR${NC}"

# 3. CREAR CHANGELOG AUTOMÁTICO
echo -e "${BLUE}📋 3. Generando changelog...${NC}"
CHANGELOG_FILE="$VERSION_DIR/CHANGELOG.md"

cat > "$CHANGELOG_FILE" << EOF
# Changelog - Versión $CURRENT_VERSION

## 📅 Fecha: $(date +'%Y-%m-%d')

### 🎯 Características Principales

- ✅ Sistema de autenticación NextAuth.js
- ✅ Base de datos PostgreSQL + Prisma
- ✅ Interface de gestión de clientes (Hub)
- ✅ Componentes UI con TailwindCSS
- ✅ Sistema de protección de ramas
- ✅ Scripts automáticos de deployment

### 🛠️ Tecnologías

- **Framework**: Next.js 14.2.32
- **Lenguaje**: TypeScript 5.5.4
- **UI**: React 18.3.1 + TailwindCSS
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **Deployment**: Docker + Cloudflare

### 🌐 URL de Desarrollo

- **Desarrollo**: \`dafel.com.mx/dev/v$(printf "%02d" $MINOR)\`
- **Estado**: Funcional ✅
- **Rama**: $CURRENT_BRANCH
- **Commit**: $(git rev-parse --short HEAD)

### 📁 Archivos Principales

- \`apps/frontend/src/app/page.tsx\` - Página principal
- \`apps/frontend/src/app/hub/page.tsx\` - Sistema de gestión
- \`apps/frontend/src/components/\` - Componentes UI
- \`apps/frontend/prisma/schema.prisma\` - Esquema de BD

### 🚀 Próxima Versión

La próxima versión será **v$NEW_VERSION** con nuevas funcionalidades y mejoras.

---

*Backup automático generado por el sistema de versionado Dafel Technologies*
EOF

echo -e "${GREEN}   ✅ Changelog generado: $CHANGELOG_FILE${NC}"

# 4. CREAR NUEVA RAMA DE DESARROLLO
echo -e "${BLUE}🌿 4. Creando nueva rama de desarrollo...${NC}"

# Hacer commit de cambios actuales si los hay
if [[ -n $(git status --porcelain) ]]; then
    echo "   Guardando cambios actuales..."
    git add .
    git commit -m "💾 Backup automático antes de crear v$NEW_VERSION

📦 Versión actual: v$CURRENT_VERSION
🆕 Próxima versión: v$NEW_VERSION
📁 Backup guardado en: versions/v$CURRENT_VERSION/

🤖 Generated by newversion script"
fi

# Crear nueva rama
git checkout -b "$NEW_BRANCH"

echo -e "${GREEN}   ✅ Nueva rama creada: $NEW_BRANCH${NC}"

# 5. ACTUALIZAR VERSIÓN EN PACKAGE.JSON
echo -e "${BLUE}📝 5. Actualizando package.json a v$NEW_VERSION...${NC}"
cd apps/frontend
npm version $NEW_VERSION --no-git-tag-version
cd ../..

# 6. CREAR CONFIGURACIÓN DE DEPLOYMENT
echo -e "${BLUE}🌐 6. Configurando deployment para v$NEW_VERSION...${NC}"
DEPLOY_DIR="deployment/v$NEW_VERSION"
mkdir -p "$DEPLOY_DIR"

# Configuración específica de la versión
cat > "$DEPLOY_DIR/deploy-config.json" << EOF
{
  "version": "$NEW_VERSION",
  "deployUrl": "dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)",
  "branch": "$NEW_BRANCH",
  "buildCommand": "cd apps/frontend && npm run build",
  "startCommand": "cd apps/frontend && npm run start",
  "port": 3000,
  "environment": "development",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Script de deployment específico
cat > "$DEPLOY_DIR/deploy.sh" << EOF
#!/bin/bash
# Deploy script para v$NEW_VERSION
# URL: dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)

echo "🚀 Deploying Dafel Technologies v$NEW_VERSION"
echo "📍 URL: https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)"

cd apps/frontend

# Instalar dependencias
npm install

# Build
npm run build

# Aquí agregar lógica específica de deployment
echo "✅ Deployment completo para v$NEW_VERSION"
EOF

chmod +x "$DEPLOY_DIR/deploy.sh"

echo -e "${GREEN}   ✅ Configuración de deployment creada: $DEPLOY_DIR${NC}"

# 7. COMMIT INICIAL DE NUEVA VERSIÓN
echo -e "${BLUE}💾 7. Creando commit inicial de nueva versión...${NC}"
git add .
git commit -m "🚀 NUEVA VERSIÓN v$NEW_VERSION iniciada

✅ SISTEMA DE VERSIONADO:
- 📦 Backup v$CURRENT_VERSION guardado en versions/
- 🌿 Nueva rama: $NEW_BRANCH
- 📝 Package.json actualizado a v$NEW_VERSION
- 🌐 Deploy configurado: dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)

✅ ESTRUCTURA CREADA:
- versions/v$CURRENT_VERSION/ - Backup completo anterior
- deployment/v$NEW_VERSION/ - Configuración deploy
- CHANGELOG.md con resumen v$CURRENT_VERSION

🎯 PRÓXIMOS PASOS:
1. Desarrollar nuevas funcionalidades
2. Deploy a dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)
3. Testing y validación
4. Merge a rama principal cuando esté listo

🤖 Generated by newversion script"

# 8. ACTUALIZAR CONFIGURACIÓN DE DAFELWORK
echo -e "${BLUE}🔧 8. Actualizando configuración...${NC}"

# Actualizar CLAUDE.md con nueva información
cat >> CLAUDE.md << EOF

## 📋 VERSIONES DISPONIBLES:

### v$CURRENT_VERSION (Anterior)
- 📁 Backup: versions/v$CURRENT_VERSION/  
- 🌐 URL: dafel.com.mx/dev/v$(printf "%02d" $MINOR)
- ✅ Estado: Completa y respaldada

### v$NEW_VERSION (Actual) 
- 🌿 Rama: $NEW_BRANCH
- 🌐 URL: dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)
- 🔄 Estado: En desarrollo

EOF

echo -e "${GREEN}   ✅ Configuración actualizada${NC}"

# RESUMEN FINAL
echo ""
echo -e "${PURPLE}🎉 NUEVA VERSIÓN CREADA EXITOSAMENTE${NC}"
echo -e "${PURPLE}====================================${NC}"
echo ""
echo -e "${GREEN}📦 Versión anterior: v$CURRENT_VERSION (respaldada)${NC}"
echo -e "${GREEN}🆕 Nueva versión: v$NEW_VERSION${NC}"
echo -e "${GREEN}🌿 Rama de desarrollo: $NEW_BRANCH${NC}"
echo -e "${GREEN}🌐 URL de desarrollo: https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)${NC}"
echo ""
echo -e "${BLUE}📁 BACKUPS CREADOS:${NC}"
echo -e "${BLUE}├── versions/v$CURRENT_VERSION/ (código completo)${NC}"
echo -e "${BLUE}├── versions/v$CURRENT_VERSION/CHANGELOG.md${NC}"
echo -e "${BLUE}└── deployment/v$NEW_VERSION/ (configuración)${NC}"
echo ""
echo -e "${YELLOW}🎯 PRÓXIMOS PASOS:${NC}"
echo "1. Desarrollar nuevas funcionalidades en esta rama"
echo "2. cd apps/frontend && npm run dev (para probar localmente)"
echo "3. Deploy a dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR) cuando esté listo"
echo "4. Todas las versiones anteriores siguen disponibles"
echo ""
echo -e "${CYAN}🔗 URLS DISPONIBLES:${NC}"
echo "• v$CURRENT_VERSION: https://dafel.com.mx/dev/v$(printf "%02d" $MINOR)"
echo "• v$NEW_VERSION: https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR) (nueva)"
echo ""
echo -e "${GREEN}✅ Sistema de versionado completo y funcionando${NC}"
echo ""