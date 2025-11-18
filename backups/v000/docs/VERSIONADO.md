# 📦 SISTEMA DE VERSIONADO AUTOMÁTICO - DAFEL TECHNOLOGIES

## 🎯 Resumen del Sistema

Sistema automático de versionado que crea **backups locales completos** y configuraciones de deployment para cada versión del proyecto.

### 🔥 Características Principales

- ✅ **Backup Local 100%** - Copia completa de código funcional
- ✅ **URLs de Desarrollo** - `dafel.com.mx/dev/v00`, `dafel.com.mx/dev/v01`, etc.
- ✅ **Ramas Automáticas** - `development-v0.X.0` por versión
- ✅ **Deployment Configurado** - Scripts listos para cada versión
- ✅ **Documentación Automática** - Changelog y metadata generados

## 🚀 Comandos Disponibles

### `/newversion` - Crear Nueva Versión
```bash
# En Claude Code:
/newversion

# O directamente:
./scripts/newversion.sh
```

**Lo que hace automáticamente:**
1. 📦 **Backup completo** de versión actual → `versions/v0.X.0/`
2. 🌿 **Nueva rama** → `development-v0.X.0`
3. 📝 **Actualiza package.json** → Nueva versión
4. 🌐 **Configura deployment** → `deployment/v0.X.0/`
5. 📋 **Genera documentación** → Changelog automático
6. ✅ **Commit inicial** → Versión lista para desarrollar

### `/versions` - Listar Versiones
```bash
# En Claude Code:
/versions

# O directamente:
./scripts/list-versions.sh
```

**Información que muestra:**
- 📦 Versiones respaldadas localmente
- 🌐 URLs de desarrollo disponibles
- 🌿 Ramas de desarrollo activas
- 📊 Estado y estadísticas
- 📁 Tamaños de backup

## 📁 Estructura Generada

```
Dafel-Technologies/
├── versions/                    # 📦 BACKUPS LOCALES
│   ├── v0.1.0/                 # Versión anterior completa
│   │   ├── apps/               # Código fuente respaldado
│   │   ├── docs/               # Documentación
│   │   ├── scripts/            # Scripts funcionales
│   │   ├── CHANGELOG.md        # Resumen de cambios
│   │   └── version-info.json   # Metadata técnica
│   ├── v0.2.0/                 # Nueva versión en desarrollo
│   └── v0.3.0/                 # Futuras versiones...
├── deployment/                  # 🌐 CONFIGURACIONES DEPLOY
│   ├── v0.1.0/
│   │   ├── deploy-config.json  # Config específica
│   │   └── deploy.sh           # Script de deployment
│   └── v0.2.0/
└── apps/frontend/               # 🎯 DESARROLLO ACTUAL
```

## 🌐 URLs de Desarrollo

Cada versión tiene su propia URL pública:

- `v0.1.0` → **dafel.com.mx/dev/v01**
- `v0.2.0` → **dafel.com.mx/dev/v02**  
- `v0.3.0` → **dafel.com.mx/dev/v03**
- `v0.4.0` → **dafel.com.mx/dev/v04**

**Ventajas:**
- ✅ Todas las versiones permanecen accesibles
- ✅ Testing independiente por versión
- ✅ Rollback inmediato si algo falla
- ✅ Demostración a clientes de evolución

## 🔄 Flujo de Trabajo Típico

### 1. Iniciar Nueva Versión
```bash
/newversion
```
- Sistema crea backup automático
- Nueva rama `development-v0.X.0`
- Configuración de deployment lista

### 2. Desarrollar Nuevas Funcionalidades
```bash
cd apps/frontend
npm run dev  # Desarrollo local
# ... trabajar en nuevas features ...
```

### 3. Verificar Estado
```bash
/versions  # Ver todas las versiones disponibles
```

### 4. Deploy a Desarrollo
```bash
# Usar script generado automáticamente
./deployment/v0.X.0/deploy.sh
```

### 5. Repetir Ciclo
- Cuando esté lista la siguiente versión, ejecutar `/newversion` de nuevo
- El ciclo se repite automáticamente

## 🔧 Configuración Automática

### Metadata de Versión (`version-info.json`)
```json
{
  "version": "0.2.0",
  "date": "2024-11-18T15:30:00Z",
  "branch": "development-v0.2.0",
  "commit": "a1b2c3d4...",
  "deployUrl": "https://dafel.com.mx/dev/v02",
  "technologies": {
    "nextjs": "14.2.32",
    "typescript": "5.5.4",
    "react": "18.3.1"
  }
}
```

### Configuración de Deploy (`deploy-config.json`)
```json
{
  "version": "0.2.0",
  "deployUrl": "dafel.com.mx/dev/v02",
  "branch": "development-v0.2.0",
  "buildCommand": "cd apps/frontend && npm run build",
  "startCommand": "cd apps/frontend && npm run start",
  "port": 3000,
  "environment": "development"
}
```

## ✅ Beneficios del Sistema

### 🛡️ Seguridad Total
- **Cero pérdida de trabajo** - Backup local completo
- **Rollback instantáneo** - Cualquier versión anterior funcional
- **Branches protegidas** - main/production intocables

### 🚀 Productividad
- **Setup automático** - Un comando crea toda la estructura
- **URLs inmediatas** - Testing público sin configuración manual
- **Documentación auto-generada** - Changelog y notas técnicas

### 👥 Colaboración
- **Versiones paralelas** - Múltiples features en desarrollo
- **Testing independiente** - Cada versión tiene su entorno
- **Demostración clara** - URLs permanentes para mostrar progreso

## ⚠️ Reglas Importantes

### ❌ Nunca Hacer
- Trabajar directamente en `main` o `production`
- Modificar carpeta `versions/` manualmente
- Borrar backups locales sin verificar
- Saltarse el comando `/dafelwork` al empezar

### ✅ Siempre Hacer
- Ejecutar `/dafelwork` primero (configura entorno)
- Usar `/newversion` cuando quieras nueva versión
- Mantener backups en `versions/` intactos
- Verificar con `/versions` el estado actual

## 🔧 Troubleshooting

### Problema: `/newversion` no funciona
```bash
# Verificar que estás en directorio correcto
ls .protected-branches  # Debe existir
ls apps/frontend        # Debe existir

# Verificar rama
git branch  # No debe estar en main/production
```

### Problema: No aparecen versiones
```bash
# Verificar estructura
ls versions/    # Ver backups disponibles
ls deployment/ # Ver configuraciones
```

### Problema: URLs no funcionan
```bash
# Verificar configuración de deployment
cat deployment/v0.X.0/deploy-config.json
```

## 🎯 Ejemplo Completo de Uso

```bash
# 1. Configurar entorno (OBLIGATORIO)
/dafelwork

# 2. Ver estado actual
/versions
# Resultado: v0.2.0 en development-v1.0

# 3. Crear nueva versión
/newversion
# Sistema crea:
# - versions/v0.2.0/ (backup completo)
# - development-v0.3.0 (nueva rama)
# - deployment/v0.3.0/ (config deployment)
# - URL: dafel.com.mx/dev/v03

# 4. Desarrollar en nueva versión
cd apps/frontend
npm run dev

# 5. Verificar cambios
/versions
# Resultado: v0.3.0 en development-v0.3.0

# 6. Repetir ciclo cuando sea necesario
```

## 📊 Estadísticas del Sistema

Al ejecutar `/versions` verás:

```
📊 RESUMEN:
├── 📦 Versiones respaldadas: 3
├── 🌿 Ramas de desarrollo: 4  
└── 🌐 Configuraciones deploy: 3

🌐 URLs DE DESARROLLO DISPONIBLES:
├── https://dafel.com.mx/dev/v01 (v0.1.0)
├── https://dafel.com.mx/dev/v02 (v0.2.0)
└── https://dafel.com.mx/dev/v03 (v0.3.0 - actual)
```

---

**🎉 Sistema de versionado completo y funcional**

Con este sistema nunca perderás trabajo y siempre tendrás acceso a todas las versiones anteriores funcionando públicamente.