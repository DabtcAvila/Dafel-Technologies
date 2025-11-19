#!/bin/bash

# 🔒 PRODUCTION LOCK SYSTEM - Dafel Technologies
# Sistema de candado para proteger archivos de producción

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PRODUCTION_DIR="$PROJECT_ROOT/production"
LOCK_FILE="$PROJECT_ROOT/.production-lock"
LOG_FILE="$PROJECT_ROOT/logs/production-lock.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Crear directorio de logs si no existe
mkdir -p "$(dirname "$LOG_FILE")"

# Función de logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Función para mostrar estado actual
show_status() {
    echo -e "\n${BLUE}🔍 ESTADO DEL SISTEMA DE PRODUCCIÓN${NC}"
    echo "=================================================="
    
    if [ -f "$LOCK_FILE" ]; then
        LOCK_TIME=$(cat "$LOCK_FILE")
        echo -e "${RED}🔒 PRODUCCIÓN BLOQUEADA${NC}"
        echo "   Bloqueado desde: $LOCK_TIME"
        echo "   Solo lectura: SÍ"
        echo "   Archivos protegidos: $(find "$PRODUCTION_DIR" -type f | wc -l)"
    else
        echo -e "${GREEN}🔓 PRODUCCIÓN DESBLOQUEADA${NC}"
        echo "   Modificaciones: PERMITIDAS"
        echo "   Solo lectura: NO"
    fi
    
    echo ""
    echo "Directorio protegido: $PRODUCTION_DIR"
    echo "Archivo de candado: $LOCK_FILE"
    echo "Log del sistema: $LOG_FILE"
    echo "=================================================="
}

# Función para aplicar el candado
lock_production() {
    if [ -f "$LOCK_FILE" ]; then
        log "${YELLOW}⚠️  Producción ya está bloqueada"
        return 1
    fi
    
    log "${BLUE}🔒 Aplicando candado a producción..."
    
    # Crear archivo de candado con timestamp
    echo "$(date '+%Y-%m-%d %H:%M:%S')" > "$LOCK_FILE"
    
    # Aplicar permisos de solo lectura recursivamente
    if [ -d "$PRODUCTION_DIR" ]; then
        # Archivos: solo lectura (444)
        find "$PRODUCTION_DIR" -type f -exec chmod 444 {} \;
        # Directorios: lectura + ejecución (555)
        find "$PRODUCTION_DIR" -type d -exec chmod 555 {} \;
        
        log "${GREEN}✅ Candado aplicado exitosamente"
        log "${GREEN}   Archivos protegidos: $(find "$PRODUCTION_DIR" -type f | wc -l)"
        log "${GREEN}   Directorios protegidos: $(find "$PRODUCTION_DIR" -type d | wc -l)"
    else
        log "${RED}❌ Directorio de producción no encontrado: $PRODUCTION_DIR"
        rm -f "$LOCK_FILE"
        return 1
    fi
    
    # Hacer el archivo de candado inmutable (solo en sistemas que lo soporten)
    if command -v chattr >/dev/null 2>&1; then
        chattr +i "$LOCK_FILE" 2>/dev/null || true
    fi
}

# Función para quitar el candado
unlock_production() {
    if [ ! -f "$LOCK_FILE" ]; then
        log "${YELLOW}⚠️  Producción no está bloqueada"
        return 1
    fi
    
    log "${BLUE}🔓 Quitando candado de producción..."
    
    # Quitar inmutabilidad del archivo de candado
    if command -v chattr >/dev/null 2>&1; then
        chattr -i "$LOCK_FILE" 2>/dev/null || true
    fi
    
    # Restaurar permisos de escritura
    if [ -d "$PRODUCTION_DIR" ]; then
        # Archivos: lectura + escritura (644)
        find "$PRODUCTION_DIR" -type f -exec chmod 644 {} \;
        # Directorios: lectura + escritura + ejecución (755)
        find "$PRODUCTION_DIR" -type d -exec chmod 755 {} \;
        
        log "${GREEN}✅ Candado removido exitosamente"
        log "${GREEN}   Archivos liberados: $(find "$PRODUCTION_DIR" -type f | wc -l)"
        log "${GREEN}   Directorios liberados: $(find "$PRODUCTION_DIR" -type d | wc -l)"
    else
        log "${RED}❌ Directorio de producción no encontrado: $PRODUCTION_DIR"
        return 1
    fi
    
    # Eliminar archivo de candado
    rm -f "$LOCK_FILE"
}

# Función para verificar si está bloqueado
is_locked() {
    [ -f "$LOCK_FILE" ]
}

# Función para verificar intentos de modificación
check_violations() {
    if ! is_locked; then
        echo -e "${YELLOW}⚠️  Sistema no está bloqueado, no hay violaciones que reportar${NC}"
        return 0
    fi
    
    echo -e "\n${BLUE}🕵️  VERIFICANDO INTENTOS DE MODIFICACIÓN${NC}"
    echo "=================================================="
    
    # Buscar archivos que no deberían tener permisos de escritura
    violations=0
    while IFS= read -r -d '' file; do
        if [ -w "$file" ]; then
            echo -e "${RED}⚠️  VIOLACIÓN: $file tiene permisos de escritura${NC}"
            violations=$((violations + 1))
        fi
    done < <(find "$PRODUCTION_DIR" -type f -print0 2>/dev/null)
    
    if [ "$violations" -eq 0 ]; then
        echo -e "${GREEN}✅ No se detectaron violaciones${NC}"
    else
        echo -e "${RED}❌ Se detectaron $violations violaciones${NC}"
        echo -e "${YELLOW}💡 Ejecuta 'lock' para restaurar protecciones${NC}"
    fi
    
    echo "=================================================="
}

# Función para mostrar ayuda
show_help() {
    echo -e "\n${BLUE}🔒 SISTEMA DE CANDADO DE PRODUCCIÓN - Dafel Technologies${NC}"
    echo "================================================================"
    echo ""
    echo "COMANDOS DISPONIBLES:"
    echo "  lock     - 🔒 Bloquear producción (solo lectura)"
    echo "  unlock   - 🔓 Desbloquear producción (permitir escritura)"
    echo "  status   - 🔍 Mostrar estado actual del sistema"
    echo "  check    - 🕵️  Verificar intentos de modificación"
    echo "  help     - 📖 Mostrar esta ayuda"
    echo ""
    echo "EJEMPLOS:"
    echo "  $0 lock          # Proteger archivos de producción"
    echo "  $0 unlock        # Permitir modificaciones"
    echo "  $0 status        # Ver estado actual"
    echo "  $0 check         # Buscar violaciones de seguridad"
    echo ""
    echo "CARACTERÍSTICAS:"
    echo "  • Protección total contra modificaciones accidentales"
    echo "  • Logging detallado de todas las operaciones"
    echo "  • Verificación automática de integridad"
    echo "  • Compatible con sistemas de CI/CD"
    echo "================================================================"
}

# Función principal
main() {
    case "${1:-help}" in
        "lock")
            show_status
            echo ""
            lock_production
            echo ""
            show_status
            ;;
        "unlock")
            show_status
            echo ""
            unlock_production
            echo ""
            show_status
            ;;
        "status")
            show_status
            ;;
        "check")
            check_violations
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