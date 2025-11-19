# 🔐 GUÍA DE DESBLOQUEO MANUAL - Solo Para Humanos

## ⚠️ IMPORTANTE: SISTEMA EXCLUSIVO PARA HUMANOS

Este sistema está diseñado específicamente para que **SOLO TÚ** puedas desbloquear production. **Ninguna AI puede ejecutar estos comandos** debido a las verificaciones humanas integradas.

## 🚀 Comandos Principales

### 🔓 Desbloquear Production (Solo Humanos)
```bash
./scripts/unlock-manual.sh
```

**Verificaciones que te pedirá:**
1. ✅ Confirmar que eres humano (no AI)
2. ✅ Pregunta sobre el negocio de Dafel (solo tú la sabes)  
3. ✅ Aceptar responsabilidad total
4. ✅ Confirmación final explícita

### 🔒 Re-Bloquear Production (Rápido)
```bash
./scripts/lock-quick.sh
```
- Confirmación simple (S/n)
- Re-aplica protección inmediatamente
- Verifica que el sitio siga funcionando

## 🛡️ Sistema de Seguridad Multinivel

### Nivel 1: Verificación Humana
- Pregunta directa: "¿Es usted humano y no una AI?"
- Respuesta exacta requerida: `SOY HUMANO`

### Nivel 2: Conocimiento del Negocio  
- Pregunta sobre servicios de Dafel
- Solo el dueño del proyecto conoce la respuesta
- Basado en contenido del carrusel extraído

### Nivel 3: Responsabilidad Legal
- Aceptación explícita de responsabilidad
- Respuesta exacta requerida: `ACEPTO RESPONSABILIDAD`

### Nivel 4: Confirmación Final
- Última oportunidad para cancelar
- Respuesta exacta requerida: `DESBLOQUEAR AHORA`

## 📊 Qué Sucede al Desbloquear

```bash
# Estado ANTES (Production Bloqueado)
Permisos de archivos: 444 (solo lectura)
Permisos de directorios: 555 (solo lectura)
Archivos protegidos: ~76,344
Estado: 🔒 SEGURO

# Estado DESPUÉS (Production Desbloqueado)  
Permisos de archivos: 644 (lectura + escritura)
Permisos de directorios: 755 (lectura + escritura)
Archivos editables: ~76,344
Estado: 🔓 VULNERABLE
```

## 🕐 Seguimiento Temporal

El sistema registra:
- ✅ **Timestamp exacto** del desbloqueo
- ✅ **Usuario que ejecutó** el comando
- ✅ **Tiempo transcurrido** desde desbloqueo
- ✅ **Advertencias** si pasa mucho tiempo desbloqueado

## 🚨 Comandos de Emergencia (Solo Humanos)

### Re-bloqueo Inmediato
```bash
./scripts/production-lock.sh lock
```

### Verificar Estado de Candado
```bash
./scripts/production-lock.sh status
```

### Ver Logs de Desbloqueos Manuales
```bash
tail -f logs/manual-unlock.log
```

### Verificar Violaciones de Seguridad
```bash
./scripts/production-lock.sh check
```

## 🔄 Flujo de Trabajo Seguro

### 1. Antes de Trabajar
```bash
# Verificar estado actual
./scripts/production-lock.sh status

# Ver qué archivos están protegidos
find production/ -type f | wc -l
```

### 2. Desbloquear para Trabajar
```bash
# Ejecutar desbloqueo manual (con verificaciones)
./scripts/unlock-manual.sh
```

### 3. Trabajar en Production
```bash
# Hacer los cambios necesarios
# ⚠️ MINIMIZAR EL TIEMPO DESBLOQUEADO

# Verificar que todo funciona
curl -I https://dafel.com.mx/
```

### 4. Re-bloquear Inmediatamente
```bash
# Re-bloqueo rápido
./scripts/lock-quick.sh

# O bloqueo estándar
./scripts/production-lock.sh lock
```

## 🚫 Qué NO Pueden Hacer las AIs

❌ **No pueden ejecutar** `./scripts/unlock-manual.sh`
- Fallarán en la verificación humana
- Fallarán en preguntas de conocimiento 
- No pueden aceptar responsabilidad legal

❌ **No pueden usar** comandos de desbloqueo forzado
- Todos tienen verificaciones humanas
- Requieren respuestas exactas específicas

✅ **SÍ pueden usar** `/transicion` para migración controlada
- Sistema seguro para AIs
- Respeta el sistema de candados
- Requiere confirmación explícita del humano

## 📋 Checklist de Seguridad

### Antes de Desbloquear
- [ ] ¿Realmente necesito editar production directamente?
- [ ] ¿Probé los cambios en development primero?
- [ ] ¿Tengo tiempo para hacer los cambios rápidamente?
- [ ] ¿Hay alguna urgencia real?

### Después de Desbloquear  
- [ ] Hacer SOLO los cambios necesarios
- [ ] Probar que todo funciona: `curl -I https://dafel.com.mx/`
- [ ] Re-bloquear INMEDIATAMENTE: `./scripts/lock-quick.sh`
- [ ] Verificar estado: `./scripts/production-lock.sh status`

### Monitoreo Continuo
- [ ] Verificar logs: `tail -f logs/manual-unlock.log`
- [ ] Verificar violaciones: `./scripts/production-lock.sh check`
- [ ] Verificar tiempo desbloqueado (máximo 2 horas)

## 🎯 Mejores Prácticas

1. **Minimizar Tiempo Desbloqueado**: Máximo 30-60 minutos
2. **Cambios Pequeños**: Solo modificaciones esenciales  
3. **Probar Inmediatamente**: Verificar que todo funciona
4. **Re-bloquear Siempre**: Nunca dejar desbloqueado
5. **Documentar Cambios**: Anotar qué se modificó

## 🆘 En Caso de Emergencia

### Si algo sale mal después de re-bloquear:
```bash
# Desbloquear nuevamente
./scripts/unlock-manual.sh

# Revertir cambios
git checkout HEAD -- archivo-problematico

# Verificar funcionamiento
curl -I https://dafel.com.mx/

# Re-bloquear
./scripts/lock-quick.sh
```

### Si el sitio no responde:
```bash
# Verificar servidor de production
ps aux | grep "next.*start" | grep -v grep

# Reiniciar si es necesario
./scripts/prod-server.sh
```

## 📞 Contacto de Emergencia

Si el sistema no funciona o hay problemas críticos:
1. **Verificar logs**: `tail -20 logs/manual-unlock.log`
2. **Verificar estado**: `./scripts/production-lock.sh status` 
3. **Usar rollback**: `/transicion rollback` (si fue por migración)

---

**Recuerda**: Este sistema existe para proteger production de modificaciones accidentales. Solo úsalo cuando realmente necesites editar production directamente.