#!/bin/bash

# 🚀 TRANSICIÓN DEVELOPMENT → PRODUCTION - Claude Code Assistant
# Comando especializado para que cualquier instancia de Claude Code pueda hacer migraciones

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/transicion-claude.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Crear directorio de logs
mkdir -p "$(dirname "$LOG_FILE")"

# Función de logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Función para mostrar header
show_header() {
    echo -e "\n${PURPLE}🤖 CLAUDE CODE - ASISTENTE DE TRANSICIÓN${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${BLUE}Sistema de Migración Desarrollo → Producción - Dafel Technologies${NC}"
    echo -e "${CYAN}================================================================${NC}"
}

# Función para verificar estado completo
check_system_status() {
    log "${BLUE}🔍 Verificando estado completo del sistema..."
    
    local errors=0
    local warnings=0
    
    echo -e "\n${YELLOW}📊 ESTADO DEL SISTEMA${NC}"
    echo "================================"
    
    # Verificar directorios
    if [ -d "$PROJECT_ROOT/development" ]; then
        echo -e "${GREEN}✅ Development: Disponible${NC}"
    else
        echo -e "${RED}❌ Development: No encontrado${NC}"
        errors=$((errors + 1))
    fi
    
    if [ -d "$PROJECT_ROOT/production" ]; then
        echo -e "${GREEN}✅ Production: Disponible${NC}"
    else
        echo -e "${RED}❌ Production: No encontrado${NC}"
        errors=$((errors + 1))
    fi
    
    # Verificar scripts
    if [ -f "$PROJECT_ROOT/scripts/smart-mirror.sh" ]; then
        echo -e "${GREEN}✅ Smart Mirror: Disponible${NC}"
    else
        echo -e "${RED}❌ Smart Mirror: No encontrado${NC}"
        errors=$((errors + 1))
    fi
    
    if [ -f "$PROJECT_ROOT/scripts/production-lock.sh" ]; then
        echo -e "${GREEN}✅ Production Lock: Disponible${NC}"
    else
        echo -e "${RED}❌ Production Lock: No encontrado${NC}"
        errors=$((errors + 1))
    fi
    
    # Verificar servidores
    echo -e "\n${YELLOW}🌐 ESTADO DE SERVIDORES${NC}"
    echo "================================"
    
    if curl -I https://dev.dafel.com.mx/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ dev.dafel.com.mx: Online${NC}"
    else
        echo -e "${YELLOW}⚠️  dev.dafel.com.mx: Offline o lento${NC}"
        warnings=$((warnings + 1))
    fi
    
    if curl -I https://dafel.com.mx/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ dafel.com.mx: Online${NC}"
    else
        echo -e "${YELLOW}⚠️  dafel.com.mx: Offline o lento${NC}"
        warnings=$((warnings + 1))
    fi
    
    # Estado del candado
    echo -e "\n${YELLOW}🔒 ESTADO DEL CANDADO${NC}"
    echo "================================"
    if "$PROJECT_ROOT/scripts/production-lock.sh" status | grep -q "BLOQUEADA"; then
        echo -e "${GREEN}✅ Production: PROTEGIDO (Solo lectura)${NC}"
    else
        echo -e "${YELLOW}⚠️  Production: DESPROTEGIDO (Editable)${NC}"
        warnings=$((warnings + 1))
    fi
    
    # Resumen
    echo -e "\n${YELLOW}📋 RESUMEN${NC}"
    echo "================================"
    if [ "$errors" -eq 0 ] && [ "$warnings" -eq 0 ]; then
        echo -e "${GREEN}✅ Sistema completamente funcional${NC}"
        return 0
    elif [ "$errors" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  Sistema funcional con $warnings advertencia(s)${NC}"
        return 1
    else
        echo -e "${RED}❌ Sistema con $errors error(es) crítico(s)${NC}"
        return 2
    fi
}

# Función para mostrar diferencias
show_differences() {
    log "${BLUE}🔍 Analizando diferencias development vs production..."
    
    if ! "$PROJECT_ROOT/scripts/smart-mirror.sh" diff; then
        echo -e "${GREEN}✅ No hay diferencias - Sistemas sincronizados${NC}"
        return 1
    fi
    
    return 0
}

# Función para preparar migración
prepare_migration() {
    log "${BLUE}🛠️  Preparando migración..."
    
    echo -e "\n${YELLOW}🔧 VERIFICACIONES PRE-MIGRACIÓN${NC}"
    echo "================================"
    
    # Verificar TypeScript en development
    echo -e "${BLUE}📝 Verificando TypeScript...${NC}"
    cd "$PROJECT_ROOT/development/apps/frontend" || return 1
    if npm run type-check >/dev/null 2>&1; then
        echo -e "${GREEN}✅ TypeScript: Sin errores${NC}"
    else
        echo -e "${RED}❌ TypeScript: Errores encontrados${NC}"
        echo "   Ejecute: cd development/apps/frontend && npm run type-check"
        return 1
    fi
    
    # Verificar Lint
    echo -e "${BLUE}🎨 Verificando Lint...${NC}"
    if npm run lint >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Lint: Sin errores${NC}"
    else
        echo -e "${YELLOW}⚠️  Lint: Advertencias encontradas${NC}"
        echo "   Recomendado: cd development/apps/frontend && npm run lint"
    fi
    
    # Verificar build
    echo -e "${BLUE}🏗️  Verificando Build...${NC}"
    if npm run build >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Build: Exitoso${NC}"
    else
        echo -e "${RED}❌ Build: Falló${NC}"
        echo "   Ejecute: cd development/apps/frontend && npm run build"
        return 1
    fi
    
    cd "$PROJECT_ROOT" || return 1
    
    echo -e "\n${GREEN}✅ Preparación completada - Sistema listo para migración${NC}"
    return 0
}

# Función para ejecutar migración
execute_migration() {
    log "${PURPLE}🚀 Ejecutando migración development → production..."
    
    echo -e "\n${PURPLE}🚀 INICIANDO MIGRACIÓN${NC}"
    echo "================================"
    
    # Confirmación final
    echo -e "${YELLOW}⚠️  CONFIRMACIÓN FINAL${NC}"
    echo ""
    echo "Esta acción va a:"
    echo "• Crear backup automático de production"
    echo "• Desbloquear production temporalmente"
    echo "• Sincronizar todos los cambios de development"
    echo "• Re-bloquear production automáticamente"
    echo ""
    
    # Ejecutar mirror con fuerza
    if "$PROJECT_ROOT/scripts/smart-mirror.sh" mirror --force; then
        echo -e "\n${GREEN}✅ MIGRACIÓN EXITOSA${NC}"
        echo "================================"
        echo -e "${GREEN}• Backup creado automáticamente${NC}"
        echo -e "${GREEN}• Cambios sincronizados${NC}"
        echo -e "${GREEN}• Production re-bloqueado${NC}"
        
        # Verificación post-migración
        echo -e "\n${BLUE}🔍 Verificando resultado...${NC}"
        sleep 3
        
        if curl -f https://dafel.com.mx/ >/dev/null 2>&1; then
            echo -e "${GREEN}✅ dafel.com.mx responde correctamente${NC}"
        else
            echo -e "${RED}❌ dafel.com.mx no responde${NC}"
            return 1
        fi
        
        return 0
    else
        echo -e "\n${RED}❌ MIGRACIÓN FALLÓ${NC}"
        echo "Revise los logs para más detalles:"
        echo "tail -20 logs/smart-mirror.log"
        return 1
    fi
}

# Función para rollback
execute_rollback() {
    log "${YELLOW}🔄 Ejecutando rollback a versión anterior..."
    
    echo -e "\n${YELLOW}🔄 ROLLBACK DE EMERGENCIA${NC}"
    echo "================================"
    
    # Buscar último backup
    local latest_backup
    latest_backup=$(ls -t "$PROJECT_ROOT/backups/mirror-backups/" 2>/dev/null | head -1)
    
    if [ -z "$latest_backup" ]; then
        echo -e "${RED}❌ No se encontraron backups disponibles${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📦 Backup encontrado: $latest_backup${NC}"
    echo -e "${YELLOW}⚠️  ¿Confirma el rollback a esta versión?${NC}"
    echo ""
    read -p "Escriba 'ROLLBACK' para confirmar: " confirmation
    
    if [ "$confirmation" != "ROLLBACK" ]; then
        echo -e "${YELLOW}🚫 Rollback cancelado${NC}"
        return 1
    fi
    
    # Ejecutar rollback
    echo -e "${BLUE}🔄 Restaurando desde backup...${NC}"
    
    # Desbloquear production
    if ! "$PROJECT_ROOT/scripts/production-lock.sh" unlock; then
        echo -e "${RED}❌ Error desbloqueando production${NC}"
        return 1
    fi
    
    # Restaurar desde backup
    if rsync -av --delete "$PROJECT_ROOT/backups/mirror-backups/$latest_backup/" "$PROJECT_ROOT/production/"; then
        echo -e "${GREEN}✅ Archivos restaurados${NC}"
    else
        echo -e "${RED}❌ Error restaurando archivos${NC}"
        return 1
    fi
    
    # Re-bloquear production
    if "$PROJECT_ROOT/scripts/production-lock.sh" lock; then
        echo -e "${GREEN}✅ Production re-bloqueado${NC}"
    else
        echo -e "${YELLOW}⚠️  Advertencia: Error aplicando candado${NC}"
    fi
    
    # Verificar resultado
    if curl -f https://dafel.com.mx/ >/dev/null 2>&1; then
        echo -e "\n${GREEN}✅ ROLLBACK EXITOSO${NC}"
        echo -e "${GREEN}• Production restaurado${NC}"
        echo -e "${GREEN}• Sistema funcional${NC}"
        return 0
    else
        echo -e "\n${RED}❌ ROLLBACK FALLÓ${NC}"
        return 1
    fi
}

# Función para mostrar ayuda completa
show_help() {
    show_header
    echo ""
    echo -e "${YELLOW}COMANDOS DISPONIBLES:${NC}"
    echo "  check     - 🔍 Verificar estado completo del sistema"
    echo "  diff      - 📊 Mostrar diferencias development vs production"
    echo "  prepare   - 🛠️  Preparar y verificar para migración"
    echo "  migrate   - 🚀 Ejecutar migración completa"
    echo "  rollback  - 🔄 Revertir a versión anterior"
    echo "  status    - 📋 Resumen rápido del estado"
    echo "  help      - 📖 Mostrar esta ayuda"
    echo ""
    echo -e "${YELLOW}FLUJO RECOMENDADO:${NC}"
    echo "  1. $0 check     # Verificar que todo esté en orden"
    echo "  2. $0 diff      # Ver qué cambios se van a migrar"
    echo "  3. $0 prepare   # Verificar que development esté listo"
    echo "  4. $0 migrate   # Ejecutar migración"
    echo ""
    echo -e "${YELLOW}COMANDOS DE EMERGENCIA:${NC}"
    echo "  $0 rollback     # Si algo sale mal después de migrar"
    echo ""
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${BLUE}Para más información detallada, consulte: ~/.claude/commands/transicion.md${NC}"
    echo -e "${CYAN}================================================================${NC}"
}

# Función principal
main() {
    case "${1:-help}" in
        "check")
            show_header
            check_system_status
            ;;
        "diff")
            show_header
            show_differences
            ;;
        "prepare")
            show_header
            prepare_migration
            ;;
        "migrate")
            show_header
            if check_system_status >/dev/null 2>&1; then
                if prepare_migration; then
                    execute_migration
                else
                    echo -e "${RED}❌ Preparación falló. No se puede proceder con la migración.${NC}"
                    exit 1
                fi
            else
                echo -e "${RED}❌ Sistema no está en estado válido para migración.${NC}"
                echo "Ejecute: $0 check para ver detalles"
                exit 1
            fi
            ;;
        "rollback")
            show_header
            execute_rollback
            ;;
        "status")
            show_header
            echo -e "\n${BLUE}📋 RESUMEN RÁPIDO${NC}"
            echo "================================"
            "$PROJECT_ROOT/scripts/smart-mirror.sh" status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log "${RED}❌ Comando no válido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"