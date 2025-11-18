#!/bin/bash

# 🔗 DAFEL DEVELOPMENT TUNNEL
# Conecta dev.dafel.com.mx → localhost:3001

echo "🔗 Iniciando túnel de desarrollo..."
echo "🆔 Tunnel ID: c6dc1760-5964-4258-946a-e2a4d34cdb41"  
echo "🌐 Subdominio: dev.dafel.com.mx"
echo "📡 Puerto local: 3001"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar que el archivo de configuración existe
if [ ! -f "/Users/davicho/.cloudflared/config-dev.yml" ]; then
    echo "❌ Error: No se encuentra la configuración del túnel de desarrollo"
    echo "📂 Esperado en: /Users/davicho/.cloudflared/config-dev.yml"
    exit 1
fi

echo "✅ Configuración encontrada"
echo "🚀 Iniciando túnel..."

cloudflared tunnel --config /Users/davicho/.cloudflared/config-dev.yml run dafel-dev