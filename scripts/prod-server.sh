#!/bin/bash

# 🏭 DAFEL PRODUCTION SERVER  
# dafel.com.mx → localhost:3000 → /versions/produccion/

echo "🏭 Iniciando servidor de producción..."
echo "📂 Directorio: /production/apps/frontend/"
echo "🌐 URL: http://localhost:3000"
echo "🔗 Público: https://dafel.com.mx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "/Users/davicho/MASTER proyectos/Dafel-Technologies/production/apps/frontend"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json en el directorio de producción"
    echo "📂 Directorio actual: $(pwd)"
    exit 1
fi

echo "✅ Directorio correcto encontrado"
echo "🔧 Iniciando Next.js en puerto 3000..."

PORT=3000 npm run dev