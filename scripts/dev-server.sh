#!/bin/bash

# 🚀 DAFEL DEVELOPMENT SERVER
# dev.dafel.com.mx → localhost:3001 → /versions/v001/

echo "🚀 Iniciando servidor de desarrollo..."
echo "📂 Directorio: /development/apps/frontend/"
echo "🌐 URL: http://localhost:3001"
echo "🔗 Público: https://dev.dafel.com.mx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "/Users/davicho/MASTER proyectos/Dafel-Technologies/development/apps/frontend"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json en el directorio de desarrollo"
    echo "📂 Directorio actual: $(pwd)"
    exit 1
fi

echo "✅ Directorio correcto encontrado"
echo "🔧 Iniciando Next.js en puerto 3001..."

PORT=3001 npm run dev