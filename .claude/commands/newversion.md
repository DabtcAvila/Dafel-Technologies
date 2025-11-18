# /newversion

## 🚀 CREAR NUEVA VERSIÓN - SISTEMA AUTOMÁTICO

Comando para iniciar el desarrollo de una nueva versión con backup completo y estructura organizada.

## ⚡ Qué hace este comando:

1. 🔍 **Analiza versión actual** - Determina la siguiente versión
2. 📦 **Backup completo local** - Guarda 100% de archivos necesarios  
3. 🌿 **Crea nueva rama** - `development-v0.X.0`
4. 🏗️ **Duplica estructura** - Copia archivos para nueva versión
5. 🌐 **Configura deployment** - `dafel.com.mx/dev/v0X`
6. 📋 **Genera documentación** - Changelog y notas de versión

## 🔧 Ejecuta esto:

```bash
./scripts/newversion.sh
```

## 📁 Estructura que crea:

```
Dafel-Technologies/
├── versions/                    # 📦 BACKUPS LOCALES
│   ├── v0.1.0/                 # Versión anterior completa
│   │   ├── apps/               # Código fuente
│   │   ├── docs/               # Documentación
│   │   ├── CHANGELOG.md        # Cambios
│   │   └── version-info.json   # Metadata
│   └── v0.2.0/                 # Nueva versión
├── apps/frontend/               # 🎯 DESARROLLO ACTUAL
└── deployment/                  # 🌐 CONFIGS POR VERSIÓN
    ├── v0.1.0/
    └── v0.2.0/
```

## 🌐 URLs de desarrollo:

- `dafel.com.mx/dev/v01` - Versión 0.1.0
- `dafel.com.mx/dev/v02` - Versión 0.2.0  
- `dafel.com.mx/dev/v03` - Versión 0.3.0

## ⚠️ IMPORTANTE:

- ✅ Ejecutar solo cuando quieras iniciar nueva versión
- ✅ Hará backup completo automáticamente
- ✅ Creará nueva rama de desarrollo
- ✅ Todas las versiones quedan disponibles públicamente

## 🎯 Flujo después del comando:

1. Nueva rama creada: `development-v0.X.0`
2. Backup guardado en: `versions/v0.X.0/`
3. Deploy URL: `dafel.com.mx/dev/v0X`
4. Listo para desarrollar nueva versión