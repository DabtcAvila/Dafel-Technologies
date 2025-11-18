#!/bin/bash
# 🚨 FIX TUNNEL EMERGENCY SCRIPT - DAFEL TECHNOLOGIES
# 
# Script de emergencia para resolver problemas críticos de túneles
#
# USO: ./scripts/fix-tunnel-emergency.sh

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

# Banner
echo -e "${RED}🚨 EMERGENCY TUNNEL REPAIR - DAFEL TECHNOLOGIES${NC}"
echo -e "${RED}=============================================${NC}"
echo ""

echo -e "${YELLOW}⚠️ MODO EMERGENCIA ACTIVADO${NC}"
echo -e "${YELLOW}Este script resolverá problemas críticos de túneles automáticamente${NC}"
echo ""

echo -e "${BLUE}🔍 1. DIAGNÓSTICO COMPLETO DEL SISTEMA...${NC}"

# Verificar procesos cloudflared
echo -e "${CYAN}   Buscando todos los procesos cloudflared...${NC}"
ALL_CLOUDFLARED=$(ps aux | grep cloudflared | grep -v grep || true)

if [[ -n "$ALL_CLOUDFLARED" ]]; then
    echo -e "${YELLOW}   📡 Procesos cloudflared encontrados:${NC}"
    echo "$ALL_CLOUDFLARED" | while read line; do
        echo -e "${YELLOW}   🔍 $line${NC}"
    done
else
    echo -e "${GREEN}   ✅ No hay procesos cloudflared ejecutándose${NC}"
fi

# Verificar puerto 3000
echo -e "${CYAN}   Verificando puerto 3000...${NC}"
PORT_3000=$(lsof -ti:3000 2>/dev/null || true)

if [[ -n "$PORT_3000" ]]; then
    echo -e "${YELLOW}   🔌 Puerto 3000 ocupado por proceso: $PORT_3000${NC}"
    PROCESS_DETAILS=$(ps -p $PORT_3000 -o pid,ppid,comm,args 2>/dev/null || true)
    echo -e "${CYAN}   📝 Detalles: $PROCESS_DETAILS${NC}"
else
    echo -e "${GREEN}   ✅ Puerto 3000 disponible${NC}"
fi

echo ""
echo -e "${RED}🛑 2. LIMPIEZA TOTAL DEL SISTEMA...${NC}"

echo -e "${CYAN}   Terminando TODOS los procesos cloudflared...${NC}"
pkill -9 -f cloudflared 2>/dev/null || true

echo -e "${CYAN}   Liberando puerto 3000...${NC}"
if [[ -n "$PORT_3000" ]]; then
    kill -9 $PORT_3000 2>/dev/null || true
fi

echo -e "${CYAN}   Esperando limpieza completa...${NC}"
sleep 3

echo -e "${CYAN}   Verificando limpieza...${NC}"
REMAINING_CLOUDFLARED=$(ps aux | grep cloudflared | grep -v grep || true)
REMAINING_PORT=$(lsof -ti:3000 2>/dev/null || true)

if [[ -z "$REMAINING_CLOUDFLARED" ]] && [[ -z "$REMAINING_PORT" ]]; then
    echo -e "${GREEN}   ✅ Sistema completamente limpio${NC}"
else
    echo -e "${RED}   ❌ Algunos procesos persistieron${NC}"
    if [[ -n "$REMAINING_CLOUDFLARED" ]]; then
        echo -e "${RED}   🔍 Cloudflared restante: $REMAINING_CLOUDFLARED${NC}"
    fi
    if [[ -n "$REMAINING_PORT" ]]; then
        echo -e "${RED}   🔍 Puerto 3000 restante: $REMAINING_PORT${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🔧 3. VERIFICACIÓN DE CONFIGURACIÓN...${NC}"

# Verificar archivo de credenciales del túnel
CREDS_FILE="$HOME/.cloudflared/$CORRECT_TUNNEL_ID.json"
echo -e "${CYAN}   Verificando credenciales del túnel...${NC}"

if [[ -f "$CREDS_FILE" ]]; then
    echo -e "${GREEN}   ✅ Credenciales encontradas: $CREDS_FILE${NC}"
else
    echo -e "${RED}   ❌ ERROR CRÍTICO: Credenciales no encontradas${NC}"
    echo -e "${RED}   📍 Archivo esperado: $CREDS_FILE${NC}"
    echo ""
    echo -e "${YELLOW}   🔧 SOLUCIÓN REQUERIDA:${NC}"
    echo "   1. Verificar que cloudflared esté instalado"
    echo "   2. Verificar que las credenciales del túnel estén configuradas"
    echo "   3. Ejecutar: cloudflared tunnel list"
    echo "   4. Contactar administrador si persiste"
    exit 1
fi

# Verificar que el túnel existe
echo -e "${CYAN}   Verificando existencia del túnel...${NC}"
TUNNEL_INFO=$(cloudflared tunnel info $CORRECT_TUNNEL_ID 2>/dev/null || true)

if [[ -n "$TUNNEL_INFO" ]]; then
    echo -e "${GREEN}   ✅ Túnel verificado exitosamente${NC}"
    echo -e "${CYAN}   📝 Info: $TUNNEL_INFO${NC}"
else
    echo -e "${RED}   ❌ ERROR: No se puede obtener información del túnel${NC}"
    echo -e "${YELLOW}   🔧 Intentando listar todos los túneles...${NC}"
    cloudflared tunnel list || echo -e "${RED}   ❌ No se pueden listar túneles${NC}"
fi

echo ""
echo -e "${GREEN}🚀 4. REINICIO COMPLETO DEL SISTEMA...${NC}"

# Verificar directorio de trabajo
echo -e "${CYAN}   Verificando directorio de trabajo...${NC}"
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo -e "${RED}   ❌ ERROR: No estás en el directorio raíz de Dafel Technologies${NC}"
    exit 1
else
    echo -e "${GREEN}   ✅ Directorio correcto confirmado${NC}"
fi

echo -e "${CYAN}   Iniciando túnel correcto...${NC}"
cloudflared tunnel run $CORRECT_TUNNEL_ID &
TUNNEL_PID=$!

echo -e "${CYAN}   Esperando estabilización del túnel...${NC}"
sleep 7

# Verificar que el túnel está funcionando
if ps -p $TUNNEL_PID > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Túnel iniciado exitosamente (PID: $TUNNEL_PID)${NC}"
else
    echo -e "${RED}   ❌ ERROR CRÍTICO: No se pudo iniciar el túnel${NC}"
    echo -e "${YELLOW}   📝 Último intento con logs detallados...${NC}"
    cloudflared tunnel run $CORRECT_TUNNEL_ID --loglevel debug &
    TUNNEL_PID=$!
    sleep 5
    
    if ps -p $TUNNEL_PID > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Túnel iniciado en modo debug${NC}"
    else
        echo -e "${RED}   ❌ FALLO TOTAL: Contactar administrador inmediatamente${NC}"
        exit 1
    fi
fi

echo -e "${CYAN}   Iniciando aplicación...${NC}"
cd apps/frontend

# Verificar package.json
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}   ❌ ERROR: package.json no encontrado${NC}"
    exit 1
fi

echo -e "${CYAN}   Instalando dependencias por seguridad...${NC}"
npm install --silent

echo -e "${CYAN}   Iniciando servidor de desarrollo...${NC}"
PORT=3000 npm run dev &
APP_PID=$!

echo -e "${CYAN}   Esperando inicio de aplicación...${NC}"
sleep 10

# Verificar aplicación
if ps -p $APP_PID > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Aplicación iniciada exitosamente (PID: $APP_PID)${NC}"
else
    echo -e "${RED}   ❌ ERROR: Aplicación falló al iniciar${NC}"
    echo -e "${YELLOW}   🔧 Intentando inicio manual...${NC}"
    npm run build
    npm run start &
    APP_PID=$!
fi

cd ../..

echo ""
echo -e "${GREEN}✅ 5. VERIFICACIÓN FINAL...${NC}"

echo -e "${CYAN}   Probando conectividad local...${NC}"
sleep 5
LOCAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

echo -e "${CYAN}   Probando conectividad externa...${NC}"
EXTERNAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://dafel.com.mx 2>/dev/null || echo "000")

echo ""
echo -e "${PURPLE}🎯 REPORTE DE REPARACIÓN EMERGENCIA${NC}"
echo -e "${PURPLE}===================================${NC}"
echo ""

# Estado del túnel
if ps -p $TUNNEL_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Túnel Cloudflare: REPARADO Y ACTIVO${NC}"
else
    echo -e "${RED}❌ Túnel Cloudflare: REQUIERE ATENCIÓN MANUAL${NC}"
fi

# Estado de la aplicación
if ps -p $APP_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Aplicación Next.js: REPARADA Y EJECUTÁNDOSE${NC}"
else
    echo -e "${RED}❌ Aplicación Next.js: REQUIERE ATENCIÓN MANUAL${NC}"
fi

# Estado de conectividad
if [[ "$LOCAL_TEST" == "200" ]]; then
    echo -e "${GREEN}✅ Conectividad Local: REPARADA${NC}"
else
    echo -e "${RED}❌ Conectividad Local: FALLA (código: $LOCAL_TEST)${NC}"
fi

if [[ "$EXTERNAL_TEST" == "200" ]]; then
    echo -e "${GREEN}✅ Conectividad Externa: REPARADA${NC}"
else
    echo -e "${YELLOW}⚠️ Conectividad Externa: PROPAGÁNDOSE (código: $EXTERNAL_TEST)${NC}"
fi

echo ""
if [[ "$LOCAL_TEST" == "200" ]] && ps -p $TUNNEL_PID > /dev/null 2>&1; then
    echo -e "${GREEN}🎉 REPARACIÓN EMERGENCIA EXITOSA${NC}"
    echo -e "${GREEN}El sistema está operativo nuevamente${NC}"
else
    echo -e "${RED}⚠️ REPARACIÓN PARCIAL - REQUIERE INTERVENCIÓN MANUAL${NC}"
    echo -e "${YELLOW}Contacta al administrador del sistema${NC}"
fi

echo ""
echo -e "${CYAN}📋 PIDs de procesos reparados:${NC}"
echo -e "${CYAN}├── Túnel: $TUNNEL_PID${NC}"
echo -e "${CYAN}└── Aplicación: $APP_PID${NC}"

echo ""