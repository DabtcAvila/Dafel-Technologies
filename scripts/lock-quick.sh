#!/bin/bash

# 🔒 RE-BLOQUEO RÁPIDO - Dafel Technologies
# Para re-bloquear production rápidamente después de trabajar

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOCK_SCRIPT="$SCRIPT_DIR/production-lock.sh"
LOG_FILE="$PROJECT_ROOT/logs/manual-unlock.log"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función de logging
log_lock() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - MANUAL LOCK - $1" >> "$LOG_FILE"
    echo -e "$1"
}

echo -e "${BLUE}🔒 RE-BLOQUEO RÁPIDO DE PRODUCTION${NC}"
echo "=================================="

# Verificar estado actual
if "$LOCK_SCRIPT" status | grep -q "BLOQUEADA"; then
    echo -e "${GREEN}✅ Production ya está bloqueado${NC}"
    echo "No se requiere acción."
    exit 0
fi

# Mostrar archivos que serán protegidos
files_count=$(find "$PROJECT_ROOT/production" -type f 2>/dev/null | wc -l)
echo -e "${BLUE}📁 Archivos a proteger: $files_count${NC}"

# Confirmación simple
echo -e "\n${YELLOW}¿Confirmar re-bloqueo de production? (S/n)${NC}"
read -p "Respuesta: " confirm

if [[ "$confirm" =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}Re-bloqueo cancelado${NC}"
    exit 0
fi

# Ejecutar bloqueo
log_lock "🔒 Iniciando re-bloqueo manual por usuario autorizado"

if "$LOCK_SCRIPT" lock; then
    # Limpiar timestamp de desbloqueo
    rm -f "$PROJECT_ROOT/.manual-unlock-time"
    
    log_lock "✅ Re-bloqueo manual exitoso"
    echo -e "\n${GREEN}✅ PRODUCTION RE-BLOQUEADO EXITOSAMENTE${NC}"
    echo "================================"
    echo -e "${GREEN}• $files_count archivos protegidos${NC}"
    echo -e "${GREEN}• Solo lectura aplicado${NC}"
    echo -e "${GREEN}• Sistema seguro nuevamente${NC}"
    
    # Verificar que el sitio sigue funcionando
    echo -e "\n${BLUE}🔍 Verificando que el sitio siga funcionando...${NC}"
    if curl -f https://dafel.com.mx/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ dafel.com.mx responde correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️  dafel.com.mx no responde (podría ser normal)${NC}"
    fi
    
else
    log_lock "❌ Error durante re-bloqueo manual"
    echo -e "\n${RED}❌ ERROR DURANTE EL RE-BLOQUEO${NC}"
    exit 1
fi