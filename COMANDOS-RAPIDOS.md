# 🚀 COMANDOS RÁPIDOS - Dafel Technologies

## 🔒 Sistema de Candado de Producción

```bash
# Bloquear production (SOLO LECTURA)
./scripts/production-lock.sh lock

# Desbloquear production (PERMITIR ESCRITURA) - Uso interno
./scripts/production-lock.sh unlock

# Ver estado del candado
./scripts/production-lock.sh status

# Verificar intentos de modificación
./scripts/production-lock.sh check
```

## 🔐 Desbloqueo Manual (Solo Humanos)

```bash
# 🔓 DESBLOQUEAR - Solo para humanos (verificación múltiple)
./scripts/unlock-manual.sh

# 🔒 RE-BLOQUEAR - Rápido cuando termines
./scripts/lock-quick.sh
```

**⚠️ IMPORTANTE:** Los comandos de desbloqueo manual tienen verificaciones que **solo humanos** pueden pasar. Las AIs no pueden ejecutarlos.

## 🪞 Smart Mirror (Development → Production)

```bash
# Mirror interactivo con confirmación
./scripts/smart-mirror.sh mirror

# Mirror automático sin confirmación
./scripts/smart-mirror.sh auto

# Mirror forzando desbloqueo temporal
./scripts/smart-mirror.sh mirror --force

# Ver diferencias sin sincronizar
./scripts/smart-mirror.sh diff

# Estado del sistema
./scripts/smart-mirror.sh status
```

## 🌐 Servidores

```bash
# Desarrollo (dev.dafel.com.mx)
./scripts/dev-server.sh

# Producción (dafel.com.mx)
./scripts/prod-server.sh

# Verificar estado de ambos
curl -I https://dev.dafel.com.mx/
curl -I https://dafel.com.mx/
```

## 🔄 Flujo de Trabajo Completo

### 1. Desarrollo Seguro
```bash
# 1. Verificar que production esté bloqueado
./scripts/production-lock.sh status

# 2. Trabajar en development
# (modificar archivos en /development/)

# 3. Probar en dev.dafel.com.mx
```

### 2. Deploy a Producción
```bash
# 1. Verificar diferencias
./scripts/smart-mirror.sh diff

# 2. Desbloquear production temporalmente y hacer mirror
./scripts/smart-mirror.sh mirror --force

# 3. Production queda bloqueado automáticamente
```

## 🎯 URLs

- **Desarrollo**: https://dev.dafel.com.mx/
- **Producción**: https://dafel.com.mx/
- **Carrusel v01**: https://dev.dafel.com.mx/dev/v01

## 🔐 Características del Sistema de Candado

✅ **Protección Total**: 76,344 archivos protegidos en production
✅ **Solo Lectura**: Imposible modificar archivos accidentalmente  
✅ **Logging Completo**: Todas las operaciones registradas
✅ **Backup Automático**: Smart mirror crea backups antes de sincronizar
✅ **Independencia Total**: dev.dafel.com.mx completamente independiente

## 🚨 Comandos de Emergencia

```bash
# Forzar desbloqueo inmediato
sudo ./scripts/production-lock.sh unlock

# Mirror de emergencia
AUTO_CONFIRM=true ./scripts/smart-mirror.sh auto

# Verificar servidores
ps aux | grep -E "(next|node)" | grep -v grep
```