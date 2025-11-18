# /start

## 🚀 INICIO AUTOMÁTICO COMPLETO DEL SISTEMA

**Comando más importante después de /dafelwork** - Inicia todo el stack automáticamente.

## ⚡ Qué hace este comando:

1. 🔍 **Verifica túneles** - Detecta y corrige túneles Cloudflare incorrectos
2. 🛑 **Limpia procesos** - Elimina túneles obsoletos automáticamente  
3. ✅ **Inicia túnel correcto** - `30ecd250-6d2c-45a5-987b-67b354281f90`
4. 🚀 **Lanza aplicación** - Puerto 3000 configurado automáticamente
5. 🌐 **Verifica conectividad** - Confirma que dafel.com.mx está online
6. 📊 **Reporta estado** - Muestra URLs y estado del sistema

## 🔧 Ejecuta esto:

```bash
./scripts/start-complete-system.sh
```

## ✅ Al ejecutar obtienes:

- **dafel.com.mx** - Funcionando ✅
- **app.dafel.com.mx** - Funcionando ✅  
- **www.dafel.com.mx** - Funcionando ✅
- **localhost:3000** - Desarrollo local ✅

## 🚨 Para IAs futuras:

**SI ALGUIEN REPORTA "no funciona el túnel":**
```bash
# SIEMPRE ejecutar primero:
/start

# Si eso no funciona:
./scripts/fix-tunnel-emergency.sh
```

## ⚠️ PROBLEMAS COMUNES RESUELTOS:

### 1. Túnel incorrecto ejecutándose
✅ **Detecta automáticamente** túneles obsoletos  
✅ **Elimina automáticamente** procesos incorrectos  
✅ **Inicia automáticamente** túnel correcto  

### 2. Puerto ocupado
✅ **Detecta automáticamente** procesos en puerto 3000  
✅ **Libera automáticamente** el puerto  
✅ **Inicia automáticamente** en puerto limpio  

### 3. Aplicación no conecta
✅ **Verifica automáticamente** conectividad  
✅ **Reporta automáticamente** errores específicos  
✅ **Sugiere automáticamente** soluciones  

## 🎯 Flujo típico:

```bash
# 1. OBLIGATORIO - Configurar entorno
/dafelwork

# 2. OBLIGATORIO - Iniciar sistema completo
/start

# 3. Desarrollo normal...
# Todo estará funcionando automáticamente
```

## 📁 Archivos principales:

- `apps/frontend/src/app/page.tsx` - Página principal
- `apps/frontend/src/app/hub/page.tsx` - Sistema hub  
- `apps/frontend/src/components/` - Componentes

## ⚠️ Reglas:

- ✅ SIEMPRE ejecutar `/dafelwork` primero
- ✅ SIEMPRE ejecutar `/start` después
- ✅ Trabajar solo en `development-v1.0`
- ❌ NUNCA tocar `main` o `production`