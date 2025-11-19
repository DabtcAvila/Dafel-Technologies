#!/bin/bash

# 🔐 DESBLOQUEO MANUAL EXCLUSIVO PARA HUMANOS - Dafel Technologies
# Solo el usuario autorizado puede desbloquear production
# ❌ PROHIBIDO PARA IA - Solo para uso manual directo

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOCK_SCRIPT="$SCRIPT_DIR/production-lock.sh"
LOG_FILE="$PROJECT_ROOT/logs/manual-unlock.log"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Crear directorio de logs
mkdir -p "$(dirname "$LOG_FILE")"

# Función de logging específica para desbloqueos manuales
log_manual() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - MANUAL UNLOCK - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Verificar que NO sea una AI ejecutando esto
verify_human() {
    echo -e "${RED}🔐 VERIFICACIÓN DE SEGURIDAD - SOLO HUMANOS${NC}"
    echo "=========================================="
    echo ""
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Este comando está diseñado EXCLUSIVAMENTE para uso manual.${NC}"
    echo -e "${YELLOW}⚠️  Si es una AI intentando ejecutar esto: DETÉNGASE INMEDIATAMENTE.${NC}"
    echo ""
    
    # Primera verificación: Confirmar que es humano
    echo -e "${BLUE}🤖 ¿Es usted humano y no una AI?${NC}"
    echo "Escriba exactamente: SOY HUMANO"
    echo ""
    read -p "Respuesta: " human_confirm
    
    if [ "$human_confirm" != "SOY HUMANO" ]; then
        log_manual "❌ Verificación humana falló: '$human_confirm'"
        echo -e "${RED}❌ Verificación falló. Acceso denegado.${NC}"
        exit 1
    fi
    
    # Segunda verificación: Pregunta que solo el dueño del proyecto sabría
    echo -e "\n${BLUE}🎯 ¿Cuál es el nombre del sistema de consultoría de Dafel?${NC}"
    echo "Pista: Se extrajo de dafelconsulting.com.mx para el carrusel"
    echo ""
    read -p "Respuesta: " business_answer
    
    # Respuestas válidas (case insensitive)
    business_answer_lower=$(echo "$business_answer" | tr '[:upper:]' '[:lower:]')
    if [[ ! "$business_answer_lower" =~ (pasivos.*laborales|estudios.*actuariales|precios.*transferencia) ]]; then
        log_manual "❌ Verificación de conocimiento falló: '$business_answer'"
        echo -e "${RED}❌ Respuesta incorrecta. Acceso denegado.${NC}"
        exit 1
    fi
    
    # Tercera verificación: Confirmación de responsabilidad
    echo -e "\n${YELLOW}⚠️  CONFIRMACIÓN DE RESPONSABILIDAD${NC}"
    echo "Al desbloquear production, usted acepta total responsabilidad por:"
    echo "• Cualquier modificación realizada en archivos de producción"
    echo "• Mantener la estabilidad del sitio dafel.com.mx"
    echo "• Re-bloquear el sistema cuando termine"
    echo ""
    echo "Escriba exactamente: ACEPTO RESPONSABILIDAD"
    echo ""
    read -p "Confirmación: " responsibility_confirm
    
    if [ "$responsibility_confirm" != "ACEPTO RESPONSABILIDAD" ]; then
        log_manual "❌ Confirmación de responsabilidad falló: '$responsibility_confirm'"
        echo -e "${RED}❌ Responsabilidad no aceptada. Acceso denegado.${NC}"
        exit 1
    fi
    
    log_manual "✅ Verificación humana completada exitosamente"
    echo -e "${GREEN}✅ Verificación completada. Procediendo con desbloqueo...${NC}"
}

# Función para mostrar estado antes del desbloqueo
show_current_state() {
    echo -e "\n${BLUE}📊 ESTADO ACTUAL DEL SISTEMA${NC}"
    echo "================================"
    
    # Estado del candado
    if "$LOCK_SCRIPT" status | grep -q "BLOQUEADA"; then
        echo -e "${GREEN}✅ Production: PROTEGIDO (Como debe ser)${NC}"
    else
        echo -e "${YELLOW}⚠️  Production: YA ESTÁ DESBLOQUEADO${NC}"
        echo ""
        echo -e "${YELLOW}¿Desea continuar de todos modos? (s/N)${NC}"
        read -p "Respuesta: " continue_anyway
        if [[ ! "$continue_anyway" =~ ^[sS]$ ]]; then
            echo -e "${YELLOW}Operación cancelada.${NC}"
            exit 0
        fi
    fi
    
    # Mostrar archivos protegidos
    local protected_files
    protected_files=$(find "$PROJECT_ROOT/production" -type f 2>/dev/null | wc -l)
    echo -e "${BLUE}📁 Archivos protegidos: $protected_files${NC}"
    
    # Estado de servidores
    if curl -I https://dafel.com.mx/ >/dev/null 2>&1; then
        echo -e "${GREEN}🌐 dafel.com.mx: Online${NC}"
    else
        echo -e "${RED}🌐 dafel.com.mx: Offline o problemas${NC}"
    fi
}

# Función para desbloquear con confirmación adicional
perform_unlock() {
    echo -e "\n${PURPLE}🔓 REALIZANDO DESBLOQUEO MANUAL${NC}"
    echo "================================"
    
    # Última confirmación
    echo -e "${RED}⚠️  ÚLTIMA CONFIRMACIÓN${NC}"
    echo ""
    echo "Una vez desbloqueado, production será EDITABLE y vulnerable."
    echo "Es su responsabilidad:"
    echo "1. Hacer solo los cambios necesarios"
    echo "2. Probar que todo funciona"
    echo "3. Re-bloquear inmediatamente cuando termine"
    echo ""
    echo "Para confirmar, escriba exactamente: DESBLOQUEAR AHORA"
    echo ""
    read -p "Confirmación final: " final_confirm
    
    if [ "$final_confirm" != "DESBLOQUEAR AHORA" ]; then
        log_manual "❌ Confirmación final falló: '$final_confirm'"
        echo -e "${RED}❌ Confirmación final falló. Operación cancelada.${NC}"
        exit 1
    fi
    
    # Crear timestamp del desbloqueo
    local unlock_time=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$unlock_time" > "$PROJECT_ROOT/.manual-unlock-time"
    
    # Realizar desbloqueo
    log_manual "🔓 Iniciando desbloqueo manual por usuario autorizado"
    
    if "$LOCK_SCRIPT" unlock; then
        log_manual "✅ Desbloqueo manual exitoso"
        echo -e "\n${GREEN}✅ PRODUCTION DESBLOQUEADO EXITOSAMENTE${NC}"
        echo "================================"
        echo -e "${GREEN}• Archivos ahora editables${NC}"
        echo -e "${GREEN}• Permisos de escritura restaurados${NC}"
        echo -e "${YELLOW}• Timestamp registrado: $unlock_time${NC}"
        
        # Mostrar comandos importantes
        echo -e "\n${BLUE}📋 COMANDOS IMPORTANTES PARA CUANDO TERMINE:${NC}"
        echo "• Para re-bloquear: ./scripts/production-lock.sh lock"
        echo "• Para verificar estado: ./scripts/production-lock.sh status"
        echo "• Para ver este log: tail -f logs/manual-unlock.log"
        
        # Advertencia final
        echo -e "\n${YELLOW}⚠️  RECORDATORIO: Re-bloquee el sistema cuando termine${NC}"
        
        return 0
    else
        log_manual "❌ Error durante desbloqueo manual"
        echo -e "\n${RED}❌ ERROR DURANTE EL DESBLOQUEO${NC}"
        return 1
    fi
}

# Función para mostrar tiempo desde último desbloqueo
show_unlock_time() {
    if [ -f "$PROJECT_ROOT/.manual-unlock-time" ]; then
        local unlock_time
        unlock_time=$(cat "$PROJECT_ROOT/.manual-unlock-time")
        echo -e "\n${YELLOW}⏰ Último desbloqueo manual: $unlock_time${NC}"
        
        # Calcular tiempo transcurrido
        local unlock_timestamp
        unlock_timestamp=$(date -d "$unlock_time" +%s 2>/dev/null || date -j -f "%Y-%m-%d %H:%M:%S" "$unlock_time" +%s 2>/dev/null)
        if [ -n "$unlock_timestamp" ]; then
            local current_timestamp
            current_timestamp=$(date +%s)
            local elapsed_seconds=$((current_timestamp - unlock_timestamp))
            local elapsed_minutes=$((elapsed_seconds / 60))
            local elapsed_hours=$((elapsed_minutes / 60))
            
            if [ $elapsed_hours -gt 0 ]; then
                echo -e "${YELLOW}⏱️  Hace $elapsed_hours horas y $((elapsed_minutes % 60)) minutos${NC}"
            else
                echo -e "${YELLOW}⏱️  Hace $elapsed_minutes minutos${NC}"
            fi
            
            # Advertencia si ha pasado mucho tiempo desbloqueado
            if [ $elapsed_hours -gt 2 ]; then
                echo -e "${RED}⚠️  ADVERTENCIA: Production ha estado desbloqueado por mucho tiempo${NC}"
            fi
        fi
    fi
}

# Función principal
main() {
    echo -e "${PURPLE}🔐 SISTEMA DE DESBLOQUEO MANUAL - Dafel Technologies${NC}"
    echo -e "${PURPLE}====================================================${NC}"
    
    # Verificar que existe el sistema de candado
    if [ ! -f "$LOCK_SCRIPT" ]; then
        echo -e "${RED}❌ Sistema de candado no encontrado: $LOCK_SCRIPT${NC}"
        exit 1
    fi
    
    # Mostrar tiempo desde último desbloqueo
    show_unlock_time
    
    # Verificar que es humano
    verify_human
    
    # Mostrar estado actual
    show_current_state
    
    # Realizar desbloqueo
    perform_unlock
}

# Ejecutar solo si no está siendo llamado por otro script
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi