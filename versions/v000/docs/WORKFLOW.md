# 🔄 FLUJO DE TRABAJO - DAFEL TECHNOLOGIES

## 🎯 Objetivo
Mantener un control de versiones perfecto, donde **NUNCA se pierde trabajo** y **TODO está organizado**.

## 🏗️ Estructura de Ramas

### 📊 Jerarquía de Ramas
```
main (INTOCABLE)
├── production (INTOCABLE)
└── development-v1.0 (TRABAJO)
    ├── feature/nueva-funcionalidad
    ├── fix/correccion-urgente
    └── experiment/prueba-concepto
```

## 🛡️ Ramas Protegidas

### `main` - Rama Principal
- ⛔ **COMPLETAMENTE INTOCABLE**
- 🎯 Solo código 100% estable y probado
- 🚀 Solo releases oficiales
- ⚠️ Requiere permisos especiales para modificar

### `production` - Rama de Producción  
- ⛔ **COMPLETAMENTE INTOCABLE**
- 🎯 Exactamente lo que está en el servidor
- 🚀 Solo deployments verificados
- ⚠️ Requiere permisos especiales para modificar

### `development-v1.0` - Rama de Desarrollo
- ✅ **RAMA DE TRABAJO PRINCIPAL**
- 🎯 Todo el desarrollo diario
- 🔧 Features, fixes, experimentos
- ✅ Libre para trabajar

## 🔄 Flujos de Trabajo

### 1. Desarrollo Normal (IA y Humanos)
```bash
# ✅ CORRECTO
git checkout development-v1.0
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin development-v1.0
```

### 2. Feature Específico (Opcional)
```bash
# Para features grandes
git checkout development-v1.0
git checkout -b feature/sistema-reportes
# Desarrollar feature
git add .
git commit -m "feat: agregar sistema de reportes"
# Cuando termine
git checkout development-v1.0
git merge feature/sistema-reportes
git branch -d feature/sistema-reportes
```

### 3. Fix Urgente
```bash
# Para correcciones rápidas
git checkout development-v1.0
git checkout -b fix/error-login
# Corregir error
git add .
git commit -m "fix: corregir error de login"
git checkout development-v1.0
git merge fix/error-login
```

## ⚠️ QUÉ NUNCA HACER

### ❌ PROHIBIDO ABSOLUTAMENTE
```bash
# ❌ NUNCA HACER ESTO
git checkout main
git add .
git commit -m "cambios"

# ❌ NUNCA HACER ESTO
git checkout production  
git add .
git commit -m "fix"

# ❌ NUNCA HACER ESTO
git push --force origin main

# ❌ NUNCA HACER ESTO  
git reset --hard HEAD~5  # en main o production
```

### 🚨 Si Te Equivocas
```bash
# Si accidentalmente estás en main/production
git status  # verificar rama
git checkout development-v1.0  # cambiar inmediatamente
# NO hacer commit en main/production
```

## 🚀 Proceso de Release

### Para Maintainers Autorizados ÚNICAMENTE
```bash
# 1. Verificar que development esté listo
git checkout development-v1.0
npm run test
npm run build
npm run lint

# 2. Merge a main (solo con permisos)
git checkout main
git merge development-v1.0
git tag v1.1.0

# 3. Desplegar a production (solo con permisos)
git checkout production
git merge main
```

## 📁 Organización de Archivos

### Apps (Aplicaciones Principales)
```
apps/
├── frontend/          # Next.js principal
├── backend/           # API cuando sea necesaria
└── mobile/           # App móvil futura
```

### Libs (Librerías Compartidas)
```
libs/
├── dafel-banda-vectorization/  # Animaciones SVG
├── ui-components/              # Componentes UI
└── utils/                     # Utilidades
```

### Docs (Documentación)
```
docs/
├── API.md            # Documentación API
├── DEPLOYMENT.md     # Guías de despliegue
├── ARCHITECTURE.md   # Arquitectura del sistema
└── TROUBLESHOOTING.md # Solución de problemas
```

## 🔧 Comandos de Verificación

### Antes de Trabajar
```bash
# Verificar rama actual
git branch

# Cambiar a development si no estás ahí
git checkout development-v1.0

# Verificar estado
git status
```

### Antes de Commit
```bash
# Verificar que estás en la rama correcta
git branch | grep "*"
# Debe mostrar: * development-v1.0

# Ejecutar tests
cd apps/frontend
npm run test
npm run lint
```

### Verificación de Seguridad
```bash
# Ejecutar el script de protección
./.protected-branches

# Debería mostrar advertencia si estás en rama protegida
```

## 🤖 Instrucciones Especiales para IA

### ✅ SIEMPRE Hacer
1. `git branch` - verificar rama actual ANTES de cualquier cambio
2. `git checkout development-v1.0` - cambiar a development si no estás ahí
3. Hacer cambios solo en `development-v1.0`
4. Commit con mensajes descriptivos
5. Leer este documento si hay dudas

### ⛔ NUNCA Hacer
1. Modificar `main` o `production` directamente
2. `git push --force` en ramas principales
3. `git reset --hard` en ramas principales
4. Borrar ramas principales
5. Cambiar permisos de ramas protegidas

### 🔄 Flujo Estándar para IA
```bash
# 1. Verificar ubicación
git branch

# 2. Cambiar a development (si es necesario)
git checkout development-v1.0

# 3. Hacer cambios
# [modificar archivos]

# 4. Commit
git add .
git commit -m "tipo: descripción clara"

# 5. Push (opcional)
git push origin development-v1.0
```

## 📞 Soporte

Si algo sale mal o tienes dudas:
1. **PARA** - No continues
2. **VERIFICA** - Qué rama estás usando
3. **LEE** - Este documento completo
4. **PREGUNTA** - Al maintainer del proyecto

---

**⚡ REGLA DE ORO**: Cuando tengas duda, usa `development-v1.0`. Es imposible romper algo ahí. 🚀**