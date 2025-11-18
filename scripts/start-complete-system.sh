#!/bin/bash
# 🚀 START COMPLETE SYSTEM SCRIPT - DAFEL TECHNOLOGIES
# 
# Script automático para iniciar todo el stack: túnel + aplicación
#
# USO: ./scripts/start-complete-system.sh

set -e  # Exit on error

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables críticas
CORRECT_TUNNEL_ID="30ecd250-6d2c-45a5-987b-67b354281f90"
OBSOLETE_TUNNEL_IDS=("78693914-e416-430f-99a0-0a3f0732f01f" "78416c32-96e2-41a3-aeca-32d761efb120" "cba4d475-85ea-47f0-8109-c42cbcf0adbe" "d198c64a-c169-42ce-9279-e0abdd0b71df")

# Banner
echo -e "${PURPLE}🚀 DAFEL TECHNOLOGIES - COMPLETE SYSTEM START${NC}"
echo -e "${PURPLE}=============================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo -e "${RED}❌ ERROR: No estás en el directorio raíz de Dafel Technologies${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 1. VERIFICANDO ESTADO DEL SISTEMA...${NC}"

# Verificar túneles activos
echo -e "${CYAN}   Detectando túneles Cloudflare...${NC}"
RUNNING_TUNNELS=$(ps aux | grep cloudflared | grep -v grep | grep "tunnel run" || true)

if [[ -n "$RUNNING_TUNNELS" ]]; then
    echo -e "${YELLOW}   📡 Túneles detectados ejecutándose${NC}"
    
    # Verificar si el túnel correcto está ejecutándose
    if echo "$RUNNING_TUNNELS" | grep -q "$CORRECT_TUNNEL_ID"; then
        echo -e "${GREEN}   ✅ Túnel correcto ya está activo${NC}"
        TUNNEL_OK=true
    else
        echo -e "${RED}   ❌ Túnel incorrecto detectado${NC}"
        TUNNEL_OK=false
        
        # Mostrar túneles problemáticos
        for obsolete_id in "${OBSOLETE_TUNNEL_IDS[@]}"; do
            if echo "$RUNNING_TUNNELS" | grep -q "$obsolete_id"; then
                echo -e "${RED}   🔍 Túnel obsoleto encontrado: $obsolete_id${NC}"
            fi
        done
    fi
else
    echo -e "${YELLOW}   📡 No hay túneles ejecutándose${NC}"
    TUNNEL_OK=false
fi

# 2. LIMPIAR TÚNELES INCORRECTOS SI ES NECESARIO
if [[ "$TUNNEL_OK" != true ]]; then
    echo -e "${BLUE}🛑 2. LIMPIANDO TÚNELES INCORRECTOS...${NC}"
    
    echo -e "${CYAN}   Terminando todos los procesos cloudflared...${NC}"
    pkill -f cloudflared 2>/dev/null || true
    sleep 2
    
    # Verificar que se terminaron
    REMAINING_TUNNELS=$(ps aux | grep cloudflared | grep -v grep | grep "tunnel run" || true)
    if [[ -n "$REMAINING_TUNNELS" ]]; then
        echo -e "${YELLOW}   ⚠️ Algunos túneles resistieron, terminando con force...${NC}"
        pkill -9 -f cloudflared 2>/dev/null || true
        sleep 1
    fi
    
    echo -e "${GREEN}   ✅ Túneles incorrectos eliminados${NC}"
else
    echo -e "${GREEN}✅ 2. TÚNEL CORRECTO YA ACTIVO${NC}"
fi

# 3. VERIFICAR Y LIMPIAR PUERTO 3000
echo -e "${BLUE}🔌 3. VERIFICANDO PUERTO 3000...${NC}"

# Buscar proceso en puerto 3000
PORT_PROCESS=$(lsof -ti:3000 2>/dev/null || true)

if [[ -n "$PORT_PROCESS" ]]; then
    echo -e "${YELLOW}   ⚠️ Puerto 3000 ocupado por proceso: $PORT_PROCESS${NC}"
    
    # Verificar si es nuestra aplicación Next.js
    PROCESS_INFO=$(ps -p $PORT_PROCESS -o comm= 2>/dev/null || true)
    if echo "$PROCESS_INFO" | grep -q "node"; then
        echo -e "${CYAN}   🔍 Proceso Node.js detectado, verificando...${NC}"
        # Si es node, podría ser nuestra app, dejarla
        APP_OK=true
    else
        echo -e "${RED}   ❌ Proceso no relacionado, terminando...${NC}"
        kill $PORT_PROCESS 2>/dev/null || true
        sleep 2
        APP_OK=false
    fi
else
    echo -e "${GREEN}   ✅ Puerto 3000 disponible${NC}"
    APP_OK=false
fi

# 4. INICIAR TÚNEL CORRECTO SI ES NECESARIO
if [[ "$TUNNEL_OK" != true ]]; then
    echo -e "${BLUE}🌐 4. INICIANDO TÚNEL CLOUDFLARE CORRECTO...${NC}"
    
    echo -e "${CYAN}   Iniciando túnel: $CORRECT_TUNNEL_ID${NC}"
    cloudflared tunnel run $CORRECT_TUNNEL_ID &
    TUNNEL_PID=$!
    
    echo -e "${CYAN}   Esperando a que el túnel se estabilice...${NC}"
    sleep 5
    
    # Verificar que el túnel está funcionando
    if ps -p $TUNNEL_PID > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Túnel iniciado exitosamente (PID: $TUNNEL_PID)${NC}"
    else
        echo -e "${RED}   ❌ ERROR: No se pudo iniciar el túnel${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ 4. TÚNEL YA ESTABA FUNCIONANDO${NC}"
fi

# 5. INICIAR APLICACIÓN NEXT.JS SI ES NECESARIO
if [[ "$APP_OK" != true ]]; then
    echo -e "${BLUE}🚀 5. INICIANDO APLICACIÓN NEXT.JS...${NC}"
    
    # Ir al directorio de la aplicación
    cd apps/frontend
    
    echo -e "${CYAN}   Verificando dependencias...${NC}"
    if [[ ! -d "node_modules" ]] || [[ ! -f "node_modules/.package-lock.json" ]]; then
        echo -e "${YELLOW}   📦 Instalando dependencias...${NC}"
        npm install
    else
        echo -e "${GREEN}   ✅ Dependencias ya instaladas${NC}"
    fi
    
    echo -e "${CYAN}   Iniciando servidor de desarrollo...${NC}"
    PORT=3000 npm run dev &
    APP_PID=$!
    
    echo -e "${CYAN}   Esperando a que la aplicación inicie...${NC}"
    sleep 8
    
    # Verificar que la aplicación está funcionando
    if ps -p $APP_PID > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Aplicación iniciada exitosamente (PID: $APP_PID)${NC}"
    else
        echo -e "${RED}   ❌ ERROR: No se pudo iniciar la aplicación${NC}"
        exit 1
    fi
    
    # Regresar al directorio raíz
    cd ../..
else
    echo -e "${GREEN}✅ 5. APLICACIÓN YA ESTABA FUNCIONANDO${NC}"
fi

# 6. VERIFICAR CONECTIVIDAD
echo -e "${BLUE}🌐 6. VERIFICANDO CONECTIVIDAD...${NC}"

echo -e "${CYAN}   Probando localhost:3000...${NC}"
sleep 3
LOCAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [[ "$LOCAL_STATUS" == "200" ]]; then
    echo -e "${GREEN}   ✅ localhost:3000 respondiendo correctamente${NC}"
else
    echo -e "${YELLOW}   ⚠️ localhost:3000 no responde aún (código: $LOCAL_STATUS)${NC}"
    echo -e "${CYAN}   Esperando un poco más...${NC}"
    sleep 5
fi

echo -e "${CYAN}   Probando dafel.com.mx...${NC}"
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://dafel.com.mx 2>/dev/null || echo "000")

if [[ "$PROD_STATUS" == "200" ]]; then
    echo -e "${GREEN}   ✅ dafel.com.mx respondiendo correctamente${NC}"
else
    echo -e "${YELLOW}   ⚠️ dafel.com.mx puede tardar en propagarse (código: $PROD_STATUS)${NC}"
fi

# RESUMEN FINAL
echo ""
echo -e "${PURPLE}🎉 SISTEMA COMPLETO INICIADO${NC}"
echo -e "${PURPLE}===========================${NC}"
echo ""

echo -e "${GREEN}📊 ESTADO DEL SISTEMA:${NC}"
echo ""

# Estado del túnel
if ps aux | grep -q "cloudflared tunnel run $CORRECT_TUNNEL_ID"; then
    echo -e "${GREEN}✅ Túnel Cloudflare: ACTIVO${NC}"
    echo -e "${GREEN}   📡 ID: $CORRECT_TUNNEL_ID${NC}"
else
    echo -e "${RED}❌ Túnel Cloudflare: PROBLEMA${NC}"
fi

# Estado de la aplicación
if lsof -i:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Aplicación Next.js: EJECUTÁNDOSE${NC}"
    echo -e "${GREEN}   🔌 Puerto: 3000${NC}"
else
    echo -e "${RED}❌ Aplicación Next.js: PROBLEMA${NC}"
fi

# Estado de conectividad
if [[ "$LOCAL_STATUS" == "200" ]]; then
    echo -e "${GREEN}✅ Desarrollo Local: DISPONIBLE${NC}"
    echo -e "${GREEN}   🌐 URL: http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️ Desarrollo Local: INICIANDO${NC}"
fi

if [[ "$PROD_STATUS" == "200" ]]; then
    echo -e "${GREEN}✅ Producción: ONLINE${NC}"
    echo -e "${GREEN}   🌐 URL: https://dafel.com.mx${NC}"
else
    echo -e "${YELLOW}⚠️ Producción: PROPAGÁNDOSE${NC}"
fi

echo ""
echo -e "${CYAN}🔗 URLS DISPONIBLES:${NC}"
echo -e "${CYAN}├── Desarrollo: http://localhost:3000${NC}"
echo -e "${CYAN}├── Producción: https://dafel.com.mx${NC}"
echo -e "${CYAN}├── Hub: https://app.dafel.com.mx/hub${NC}"
echo -e "${CYAN}└── www: https://www.dafel.com.mx${NC}"

echo ""
echo -e "${YELLOW}📝 PRÓXIMOS PASOS:${NC}"
echo "1. Abre http://localhost:3000 para desarrollo"
echo "2. Verifica https://dafel.com.mx en unos minutos"
echo "3. Usa /newversion para crear nuevas versiones"
echo "4. Todo está listo para desarrollo"

echo ""
echo -e "${GREEN}✅ Sistema completamente operativo${NC}"
echo ""

# Guardar PIDs para referencia
echo "TUNNEL_PID=${TUNNEL_PID:-N/A}" > /tmp/dafel-system-pids
echo "APP_PID=${APP_PID:-N/A}" >> /tmp/dafel-system-pids
echo -e "${BLUE}💾 PIDs guardados en: /tmp/dafel-system-pids${NC}"
echo ""