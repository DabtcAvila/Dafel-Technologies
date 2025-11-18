#!/bin/bash
# 📋 VERSION SCRIPT - DAFEL TECHNOLOGIES
# 
# Script para manejo de versiones semánticas
#
# USO: ./scripts/version.sh [tipo]
# TIPOS: patch, minor, major

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 DAFEL TECHNOLOGIES VERSION MANAGER${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f "apps/frontend/package.json" ]]; then
    echo "❌ Error: No se encontró package.json en apps/frontend/"
    exit 1
fi

cd apps/frontend

# Obtener versión actual
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "📦 Versión actual: ${YELLOW}v$CURRENT_VERSION${NC}"

# Obtener tipo de versión
VERSION_TYPE=${1:-""}

if [[ -z "$VERSION_TYPE" ]]; then
    echo ""
    echo "🎯 ¿Qué tipo de versión quieres crear?"
    echo ""
    echo "1) patch   - Bug fixes (v0.1.0 → v0.1.1)"
    echo "2) minor   - Nuevas funcionalidades (v0.1.0 → v0.2.0)"  
    echo "3) major   - Cambios que rompen compatibilidad (v0.1.0 → v1.0.0)"
    echo ""
    read -p "Opción (1-3): " choice
    
    case $choice in
        1) VERSION_TYPE="patch";;
        2) VERSION_TYPE="minor";;
        3) VERSION_TYPE="major";;
        *) echo "❌ Opción inválida"; exit 1;;
    esac
fi

# Calcular nueva versión
IFS='.' read -ra ADDR <<< "$CURRENT_VERSION"
MAJOR=${ADDR[0]}
MINOR=${ADDR[1]}
PATCH=${ADDR[2]}

case $VERSION_TYPE in
    "patch")
        PATCH=$((PATCH + 1))
        ;;
    "minor")
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    "major")
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    *)
        echo "❌ Tipo de versión inválido: $VERSION_TYPE"
        exit 1
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo ""
echo -e "🚀 Nueva versión: ${GREEN}v$NEW_VERSION${NC}"
echo ""

# Confirmar
read -p "¿Proceder con la actualización de versión? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Actualización cancelada"
    exit 1
fi

# Actualizar package.json
echo "📝 Actualizando package.json..."
npm version $NEW_VERSION --no-git-tag-version

echo -e "${GREEN}✅ Versión actualizada a v$NEW_VERSION${NC}"

# Generar changelog automático
echo ""
echo "📋 Generando entrada de changelog..."

CHANGELOG_ENTRY="
## [v$NEW_VERSION] - $(date +'%Y-%m-%d')

### $VERSION_TYPE Release

"

case $VERSION_TYPE in
    "patch")
        CHANGELOG_ENTRY+="### 🐛 Bug Fixes
- [Agregar descripción de fixes]

### 🔧 Improvements
- [Agregar mejoras menores]
"
        ;;
    "minor")
        CHANGELOG_ENTRY+="### ✨ New Features
- [Agregar nuevas funcionalidades]

### 🐛 Bug Fixes
- [Agregar fixes incluidos]

### 🔧 Improvements
- [Agregar mejoras]
"
        ;;
    "major")
        CHANGELOG_ENTRY+="### 💥 BREAKING CHANGES
- [Describir cambios que rompen compatibilidad]

### ✨ New Features
- [Agregar nuevas funcionalidades principales]

### 🐛 Bug Fixes
- [Agregar fixes incluidos]

### 🔧 Improvements
- [Agregar mejoras]
"
        ;;
esac

# Crear o actualizar CHANGELOG.md
if [[ ! -f "CHANGELOG.md" ]]; then
    echo "# Changelog - Dafel Technologies

Todos los cambios notables del proyecto serán documentados aquí.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
$CHANGELOG_ENTRY" > CHANGELOG.md
else
    # Insertar nueva entrada después del header
    sed -i.bak "1,/^## / { /^## /i\\
$CHANGELOG_ENTRY
}" CHANGELOG.md && rm CHANGELOG.md.bak
fi

echo -e "${GREEN}✅ Changelog actualizado${NC}"
echo ""

# Mostrar siguiente pasos
echo -e "${BLUE}📋 PRÓXIMOS PASOS RECOMENDADOS:${NC}"
echo ""
echo "1. 📝 Editar CHANGELOG.md con detalles específicos"
echo "2. 🧪 Ejecutar tests: npm run test"
echo "3. 🏗️  Build: npm run build"
echo "4. 💾 Commit cambios:"
echo "   git add ."
echo "   git commit -m \"🏷️ Release v$NEW_VERSION\""
echo "5. 🏷️  Crear tag:"
echo "   git tag v$NEW_VERSION"
echo "6. 📤 Push:"
echo "   git push origin $(git branch --show-current)"
echo "   git push origin v$NEW_VERSION"

if [[ "$MAJOR" -ge 1 ]]; then
    echo ""
    echo -e "${YELLOW}🚀 VERSIÓN DE PRODUCCIÓN DETECTADA${NC}"
    echo "7. 🏭 Deploy a producción:"
    echo "   ./scripts/deploy.sh production"
fi

echo ""
echo -e "${GREEN}🎉 Versión v$NEW_VERSION lista${NC}"