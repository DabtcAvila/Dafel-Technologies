#!/bin/bash

# 🚀 DEPLOY DEVELOPMENT → PRODUCTION
# Copia código perfecto de development a production

echo "🚀 DEPLOY DE DESARROLLO A PRODUCCIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Origen: /development/apps/frontend/"
echo "🏭 Destino: /production/apps/frontend/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar que development existe
if [ ! -d "/Users/davicho/MASTER proyectos/Dafel-Technologies/development/apps/frontend" ]; then
    echo "❌ Error: No se encuentra el directorio de desarrollo"
    exit 1
fi

# Crear backup antes del deploy
echo "💾 Creando backup de producción actual..."
BACKUP_DIR="/Users/davicho/MASTER proyectos/Dafel-Technologies/backups/pre-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "/Users/davicho/MASTER proyectos/Dafel-Technologies/production" "$BACKUP_DIR/"
echo "✅ Backup creado en: $BACKUP_DIR"

# Confirmar deploy
echo "⚠️  ¿Estás seguro de hacer deploy a PRODUCCIÓN? (y/N)"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado"
    exit 0
fi

# Realizar deploy
echo "🚀 Copiando desarrollo → producción..."
rsync -av --delete \
    "/Users/davicho/MASTER proyectos/Dafel-Technologies/development/apps/frontend/" \
    "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/apps/frontend/"

# Actualizar documentación
echo "📋 Actualizando documentación de deploy..."
echo "# 📅 ÚLTIMO DEPLOY - $(date)" > "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/LAST-DEPLOY.md"
echo "" >> "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/LAST-DEPLOY.md"
echo "**Fecha:** $(date)" >> "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/LAST-DEPLOY.md"
echo "**Origen:** development/apps/frontend/" >> "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/LAST-DEPLOY.md"
echo "**Deploy exitoso:** ✅" >> "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/LAST-DEPLOY.md"
echo "**Backup creado:** $BACKUP_DIR" >> "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/LAST-DEPLOY.md"

echo "✅ DEPLOY COMPLETADO EXITOSAMENTE"
echo "🌐 Producción actualizada: https://dafel.com.mx"
echo "💾 Backup disponible en: $BACKUP_DIR"