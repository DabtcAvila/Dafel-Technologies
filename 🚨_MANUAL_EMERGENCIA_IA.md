# 🚨 MANUAL DE EMERGENCIA PARA IA - DAFEL TECHNOLOGIES

## 🔥 SI EL USUARIO REPORTA "NO FUNCIONA EL TÚNEL" O SIMILAR

### 📋 PROTOCOLO OBLIGATORIO (en este orden):

```bash
# 1. SIEMPRE PRIMERO
/dafelwork

# 2. SIEMPRE SEGUNDO  
/start

# 3. Si aún no funciona
./scripts/fix-tunnel-emergency.sh
```

## ⚡ COMANDOS CRÍTICOS QUE DEBES CONOCER

### Comando /dafelwork
- **QUÉ HACE**: Configura entorno seguro, verifica estructura, cambia a rama correcta
- **CUÁNDO**: SIEMPRE antes de cualquier trabajo
- **ARCHIVO**: `.claude/commands/dafelwork.md`

### Comando /start  
- **QUÉ HACE**: Inicia túnel Cloudflare correcto + aplicación Next.js automáticamente
- **CUÁNDO**: Después de /dafelwork, especialmente si hay problemas de túnel
- **ARCHIVO**: `.claude/commands/start.md`

### Script fix-tunnel-emergency.sh
- **QUÉ HACE**: Diagnóstico completo + reparación forzada de túneles
- **CUÁNDO**: Si /start no resuelve el problema
- **ARCHIVO**: `scripts/fix-tunnel-emergency.sh`

## 🎯 INFORMACIÓN TÉCNICA CRÍTICA

### Túnel Cloudflare CORRECTO:
```
ID: 30ecd250-6d2c-45a5-987b-67b354281f90
Dominio: dafel.com.mx  
Puerto: 3000
```

### Túneles OBSOLETOS (eliminar si están activos):
- `78693914-e416-430f-99a0-0a3f0732f01f`
- `78416c32-96e2-41a3-aeca-32d761efb120`  
- `cba4d475-85ea-47f0-8109-c42cbcf0adbe`
- `d198c64a-c169-42ce-9279-e0abdd0b71df`

### URLs que DEBEN funcionar:
- ✅ http://localhost:3000 (desarrollo)
- ✅ https://dafel.com.mx (producción)
- ✅ https://app.dafel.com.mx/hub (sistema hub)
- ✅ https://www.dafel.com.mx (www redirect)

## 🔍 DIAGNÓSTICO RÁPIDO

### Ver túneles activos:
```bash
ps aux | grep cloudflared
```

### Ver qué usa puerto 3000:
```bash
lsof -i:3000
```

### Verificar conectividad:
```bash
curl -I http://localhost:3000
curl -I https://dafel.com.mx
```

### Terminar túneles incorrectos:
```bash
pkill -f cloudflared
```

### Iniciar túnel correcto:
```bash
cloudflared tunnel run 30ecd250-6d2c-45a5-987b-67b354281f90 &
```

## 📁 ESTRUCTURA DEL PROYECTO

### Archivos que NUNCA tocar:
- `main` branch
- `production` branch
- `versions/` (backups automáticos)

### Archivos donde SÍ trabajar:
- `apps/frontend/src/` (SOLO aquí)
- Rama: `development-v1.0`

### Comandos de versionado:
- `/newversion` - Crear nueva versión con backup
- `/versions` - Ver todas las versiones disponibles

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema: "Túnel no funciona"
**Solución**: `/dafelwork` → `/start`

### Problema: "Puerto 3000 ocupado"  
**Solución**: `/start` (lo limpia automáticamente)

### Problema: "Next.js no compila"
**Solución**: 
```bash
cd apps/frontend
npm install
npm run build
```

### Problema: "Página no carga en dafel.com.mx"
**Solución**: 
1. Verificar túnel correcto con `ps aux | grep cloudflared`
2. Ejecutar `/start` si no está el túnel correcto
3. Esperar 2-3 minutos para propagación

### Problema: "Credenciales Cloudflare no encontradas"
**Solución**: Contactar administrador - requiere acceso a Cloudflare

## 🎯 FLUJO TÍPICO PARA IA

```bash
# 1. Usuario reporta problema
# 2. Ejecutar protocolo obligatorio:
/dafelwork
/start

# 3. Verificar que funciona:
curl -I https://dafel.com.mx

# 4. Si no funciona, emergencia:
./scripts/fix-tunnel-emergency.sh

# 5. Reportar al usuario el estado
```

## 📊 VERIFICACIÓN DE ÉXITO

### Señales de que todo está bien:
- ✅ `ps aux | grep cloudflared` muestra el túnel correcto (30ecd250-6d2c-45a5-987b-67b354281f90)
- ✅ `lsof -i:3000` muestra proceso node
- ✅ `curl -I https://dafel.com.mx` devuelve 200
- ✅ `curl -I https://dafel.com.mx/dev/v00` devuelve 200 (versión baseline)
- ✅ `curl -I http://localhost:3000` devuelve 200
- ✅ `ls versions/v0.0.0` muestra backup completo

### Señales de problemas:
- ❌ Túnel ID incorrecto en `ps aux | grep cloudflared`
- ❌ Puerto 3000 ocupado por proceso no-node
- ❌ curl devuelve 502, 503, o timeout
- ❌ Error "credenciales no encontradas"
- ❌ `curl /dev/v00` devuelve 404 (falta contenido real)

## 🔧 COMANDOS DE ADMINISTRACIÓN

### Reiniciar sistema completo:
```bash
/dafelwork
/start
```

### Ver logs del túnel:
```bash
cloudflared tunnel run 30ecd250-6d2c-45a5-987b-67b354281f90 --loglevel debug
```

### Estado del sistema:
```bash
/versions
```

### Crear nueva versión:
```bash
/newversion
```

---

**🎯 REGLA DE ORO: Si no sabes qué hacer, ejecuta `/dafelwork` y `/start` - resuelve 95% de los problemas**

## 🚀 SISTEMA VERSIÓN 0.0.0 BASELINE ESTABLECIDO

### ✅ Estado Actual - COMPLETAMENTE FUNCIONAL
- 📊 **Versión 0.0.0**: Contenido real de producción capturado en /dev/v00
- 🌐 **URLs Activas**: dafel.com.mx, dafel.com.mx/dev, dafel.com.mx/dev/v00  
- 💾 **Backup Completo**: versions/v0.0.0/ con código funcional
- 🔄 **Sistema Automático**: /newversion listo para futuras versiones
- 🛡️ **A Prueba de Bobos**: Documentación completa para cualquier AI

### 🎯 Verificación Rápida del Sistema Completo
```bash
# Verificar todo en un comando
curl -I https://dafel.com.mx && curl -I https://dafel.com.mx/dev/v00 && ls versions/v0.0.0 && echo "✅ SISTEMA COMPLETAMENTE FUNCIONAL"
```

---

**📞 ESCALAR AL ADMINISTRADOR SI:**
- Credenciales Cloudflare faltantes
- Túnel no se puede crear
- Dominio no resuelve después de 10 minutos
- Errores de permisos en archivos del sistema