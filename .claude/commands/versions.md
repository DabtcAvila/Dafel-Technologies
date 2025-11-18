# /versions

## 📋 LISTAR VERSIONES DISPONIBLES

Muestra todas las versiones del proyecto con sus URLs y estado.

## Ejecuta esto:

```bash
./scripts/list-versions.sh
```

## 📊 Información que muestra:

- 📦 **Versiones respaldadas** en `versions/`
- 🌐 **URLs de desarrollo** `dafel.com.mx/dev/vXX`
- 🌿 **Ramas disponibles** en Git
- ✅ **Estado actual** de cada versión
- 📁 **Tamaño de backups** locales

## 🎯 Ejemplo de output:

```
📋 VERSIONES DAFEL TECHNOLOGIES
==============================

v0.1.0 ✅ Completa
├── 📁 Backup: versions/v0.1.0/ (45.2 MB)
├── 🌐 URL: dafel.com.mx/dev/v01
├── 📅 Fecha: 2024-11-18
└── 🌿 Rama: development-v1.0

v0.2.0 🔄 En desarrollo  
├── 📁 Backup: versions/v0.2.0/ (preparando...)
├── 🌐 URL: dafel.com.mx/dev/v02
├── 📅 Fecha: 2024-11-18
└── 🌿 Rama: development-v0.2.0 (actual)
```

## 🚀 Comandos relacionados:

- `/newversion` - Crear nueva versión
- `/dafelwork` - Configurar entorno
- `/start` - Inicio rápido desarrollo