#!/bin/bash

# 🪞 SMART MIRROR SYSTEM - Dafel Technologies
# Sistema de mirroring inteligente development → production

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEV_DIR="$PROJECT_ROOT/development"
PROD_DIR="$PROJECT_ROOT/production"
BACKUP_DIR="$PROJECT_ROOT/backups/mirror-backups"
LOG_FILE="$PROJECT_ROOT/logs/smart-mirror.log"
LOCK_SCRIPT="$SCRIPT_DIR/production-lock.sh"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Crear directorios necesarios
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$BACKUP_DIR"

# Función de logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Función para verificar prerrequisitos
check_prerequisites() {
    local errors=0
    
    log "${BLUE}🔍 Verificando prerrequisitos..."
    
    # Verificar directorios
    if [ ! -d "$DEV_DIR" ]; then
        log "${RED}❌ Directorio development no encontrado: $DEV_DIR"
        errors=$((errors + 1))
    fi
    
    if [ ! -d "$PROD_DIR" ]; then
        log "${YELLOW}⚠️  Directorio production no existe, se creará: $PROD_DIR"
        mkdir -p "$PROD_DIR"
    fi
    
    # Verificar script de candado
    if [ ! -f "$LOCK_SCRIPT" ]; then
        log "${RED}❌ Script de candado no encontrado: $LOCK_SCRIPT"
        errors=$((errors + 1))
    fi
    
    # Verificar comandos necesarios
    for cmd in rsync git; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log "${RED}❌ Comando requerido no encontrado: $cmd"
            errors=$((errors + 1))
        fi
    done
    
    if [ "$errors" -gt 0 ]; then
        log "${RED}❌ $errors error(es) encontrado(s). Abortando."
        return 1
    fi
    
    log "${GREEN}✅ Prerrequisitos verificados"
    return 0
}

# Función para crear backup antes del mirror
create_backup() {
    if [ ! -d "$PROD_DIR" ] || [ -z "$(ls -A "$PROD_DIR" 2>/dev/null)" ]; then
        log "${YELLOW}⚠️  Production está vacío, no se necesita backup"
        return 0
    fi
    
    local backup_name="prod-backup-$(date '+%Y%m%d-%H%M%S')"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log "${BLUE}💾 Creando backup de production..."
    log "   Backup: $backup_path"
    
    if rsync -av --delete "$PROD_DIR/" "$backup_path/"; then
        log "${GREEN}✅ Backup creado exitosamente"
        
        # Limpiar backups antiguos (mantener solo los últimos 5)
        cd "$BACKUP_DIR" || return 1
        ls -dt prod-backup-* | tail -n +6 | xargs rm -rf 2>/dev/null || true
        
        return 0
    else
        log "${RED}❌ Error creando backup"
        return 1
    fi
}

# Función para verificar diferencias
check_differences() {
    log "${BLUE}🔍 Analizando diferencias development vs production..."
    
    # Usar rsync para mostrar diferencias sin copiar
    local diff_output
    diff_output=$(rsync -avun --delete "$DEV_DIR/" "$PROD_DIR/" 2>/dev/null)
    
    if [ -z "$diff_output" ]; then
        log "${GREEN}✅ No hay diferencias entre development y production"
        return 1 # No hay nada que sincronizar
    fi
    
    log "${YELLOW}📊 Diferencias encontradas:"
    echo "$diff_output" | head -20
    
    local total_changes
    total_changes=$(echo "$diff_output" | wc -l)
    
    if [ "$total_changes" -gt 20 ]; then
        log "${YELLOW}   ... y $((total_changes - 20)) cambios más"
    fi
    
    return 0 # Hay diferencias
}

# Función principal de mirroring
perform_mirror() {
    local force_mode="${1:-false}"
    
    log "${PURPLE}🪞 INICIANDO SMART MIRROR${NC}"
    log "=============================================="
    
    # Verificar prerrequisitos
    if ! check_prerequisites; then
        return 1
    fi
    
    # Verificar si production está bloqueado
    if "$LOCK_SCRIPT" status | grep -q "BLOQUEADA"; then
        if [ "$force_mode" = "true" ]; then
            log "${YELLOW}⚠️  Production está bloqueado, desbloqueando temporalmente..."
            if ! "$LOCK_SCRIPT" unlock; then
                log "${RED}❌ Error desbloqueando production"
                return 1
            fi
        else
            log "${RED}❌ Production está bloqueado. Use --force para desbloquear temporalmente"
            log "${YELLOW}💡 O ejecute: $LOCK_SCRIPT unlock"
            return 1
        fi
    fi
    
    # Verificar diferencias
    if ! check_differences; then
        log "${GREEN}✅ No hay cambios que sincronizar"
        return 0
    fi
    
    # Crear backup
    if ! create_backup; then
        log "${RED}❌ Error creando backup, abortando mirror"
        return 1
    fi
    
    # Confirmar acción (solo si no es automático)
    if [ "$force_mode" != "true" ] && [ "${AUTO_CONFIRM:-false}" != "true" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  CONFIRMACIÓN REQUERIDA${NC}"
        echo "¿Proceder con el mirror development → production?"
        echo "Esto sobrescribirá TODOS los archivos de production."
        echo ""
        read -p "Escriba 'SI' para confirmar: " confirmation
        
        if [ "$confirmation" != "SI" ]; then
            log "${YELLOW}🚫 Mirror cancelado por el usuario"
            return 1
        fi
    fi
    
    # Realizar mirror
    log "${BLUE}🪞 Ejecutando mirror development → production..."
    
    if rsync -av --delete --progress "$DEV_DIR/" "$PROD_DIR/"; then
        log "${GREEN}✅ Mirror completado exitosamente"
        
        # Mostrar estadísticas
        local file_count
        file_count=$(find "$PROD_DIR" -type f | wc -l)
        log "${GREEN}   Archivos sincronizados: $file_count"
        
        # Re-aplicar candado si estaba activo
        if [ "$force_mode" = "true" ]; then
            log "${BLUE}🔒 Re-aplicando candado de production..."
            "$LOCK_SCRIPT" lock
        fi
        
        return 0
    else
        log "${RED}❌ Error durante el mirror"
        return 1
    fi
}

# Función para mirror automático (sin confirmación)
auto_mirror() {
    log "${BLUE}🤖 Iniciando mirror automático..."
    AUTO_CONFIRM=true perform_mirror true
}

# Función para mostrar estado
show_status() {
    echo -e "\n${BLUE}🪞 ESTADO DEL SMART MIRROR${NC}"
    echo "=============================================="
    
    # Estado de directorios
    if [ -d "$DEV_DIR" ]; then
        local dev_files
        dev_files=$(find "$DEV_DIR" -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}📁 Development: $dev_files archivos${NC}"
    else
        echo -e "${RED}📁 Development: No encontrado${NC}"
    fi
    
    if [ -d "$PROD_DIR" ]; then
        local prod_files
        prod_files=$(find "$PROD_DIR" -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}📁 Production: $prod_files archivos${NC}"
    else
        echo -e "${YELLOW}📁 Production: No encontrado${NC}"
    fi
    
    # Estado del candado
    if "$LOCK_SCRIPT" status | grep -q "BLOQUEADA"; then
        echo -e "${RED}🔒 Production: BLOQUEADA${NC}"
    else
        echo -e "${GREEN}🔓 Production: DESBLOQUEADA${NC}"
    fi
    
    # Backups disponibles
    local backup_count
    backup_count=$(ls -1 "$BACKUP_DIR"/prod-backup-* 2>/dev/null | wc -l)
    echo -e "${BLUE}💾 Backups disponibles: $backup_count${NC}"
    
    # Verificar diferencias
    echo ""
    check_differences >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}📊 Hay diferencias pendientes de sincronización${NC}"
    else
        echo -e "${GREEN}✅ Development y production están sincronizados${NC}"
    fi
    
    echo "=============================================="
}

# Función para mostrar ayuda
show_help() {
    echo -e "\n${BLUE}🪞 SMART MIRROR SYSTEM - Dafel Technologies${NC}"
    echo "=============================================="
    echo ""
    echo "COMANDOS DISPONIBLES:"
    echo "  mirror     - 🪞 Ejecutar mirror development → production"
    echo "  auto       - 🤖 Mirror automático (sin confirmación)"
    echo "  diff       - 🔍 Mostrar diferencias sin sincronizar"
    echo "  status     - 📊 Mostrar estado del sistema"
    echo "  help       - 📖 Mostrar esta ayuda"
    echo ""
    echo "OPCIONES:"
    echo "  --force    - Desbloquear production temporalmente"
    echo ""
    echo "EJEMPLOS:"
    echo "  $0 mirror              # Mirror interactivo"
    echo "  $0 mirror --force      # Mirror forzando desbloqueo"
    echo "  $0 auto                # Mirror sin confirmación"
    echo "  $0 diff                # Solo mostrar diferencias"
    echo "  $0 status              # Ver estado actual"
    echo ""
    echo "CARACTERÍSTICAS:"
    echo "  • Backup automático antes de sincronizar"
    echo "  • Verificación de integridad"
    echo "  • Respeto al sistema de candados"
    echo "  • Logging detallado"
    echo "  • Gestión automática de backups"
    echo "=============================================="
}

# Función principal
main() {
    local force_mode=false
    
    # Procesar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force)
                force_mode=true
                shift
                ;;
            mirror)
                perform_mirror "$force_mode"
                exit $?
                ;;
            auto)
                auto_mirror
                exit $?
                ;;
            diff)
                check_differences
                exit $?
                ;;
            status)
                show_status
                exit 0
                ;;
            help|--help|-h)
                show_help
                exit 0
                ;;
            *)
                log "${RED}❌ Comando no válido: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Si no se especifica comando, mostrar ayuda
    show_help
}

# Ejecutar función principal
main "$@"