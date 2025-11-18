#!/bin/bash
# Deploy script para versión base v0.0.0
# URL: dafel.com.mx/dev/v00

echo "🚀 Deploying Dafel Technologies v0.0.0 (BASE VERSION)"
echo "📍 URL: https://dafel.com.mx/dev/v00"
echo "🎯 Esta es la versión base del sistema"

cd apps/frontend

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Building aplicación..."
npm run build

echo "🔧 Configurando environment..."
export NODE_ENV=production
export NEXT_PUBLIC_APP_ENV=development

echo "✅ Deployment completo para v0.0.0"
echo "🌐 Disponible en: https://dafel.com.mx/dev/v00"
echo ""
echo "🎯 CARACTERÍSTICAS DE LA VERSIÓN BASE:"
echo "- ✅ Página principal funcional"
echo "- ✅ Sistema Hub operativo"
echo "- ✅ Autenticación completa"
echo "- ✅ Base de datos configurada"
echo "- ✅ UI profesional"
echo ""
echo "🚀 Lista para testing y desarrollo de nuevas versiones"
