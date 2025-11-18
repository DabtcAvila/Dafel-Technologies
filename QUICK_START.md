# ⚡ QUICK START - DAFEL TECHNOLOGIES

## 🎯 Para Desarrolladores Nuevos (Humanos)

### 1️⃣ Primeros Pasos (5 minutos)
```bash
# Clonar el proyecto
git clone https://github.com/DabtcAvila/Dafel-Technologies.git
cd Dafel-Technologies

# ⚠️ IMPORTANTE: Cambiar a rama de desarrollo
git checkout development-v1.0

# Verificar que todo esté bien
./scripts/health-check.sh
```

### 2️⃣ Configurar la Aplicación (10 minutos)
```bash
# Ir a la aplicación principal
cd apps/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Configurar base de datos
npx prisma migrate dev
npx prisma generate

# Ejecutar en desarrollo
npm run dev
```

### 3️⃣ Verificar que Funciona
- 🌐 Abrir: http://localhost:3000
- 🎯 Ver la página principal cargando
- ✅ Login debe funcionar
- 🔧 Hub debe ser accesible

## 🤖 Para IA (Claude, ChatGPT, etc.)

### ⚠️ REGLAS CRÍTICAS PARA IA
1. **SIEMPRE** ejecutar `git branch` antes de cualquier cambio
2. **SIEMPRE** estar en `development-v1.0` para trabajar
3. **NUNCA** modificar `main` o `production` directamente
4. **LEER** `docs/WORKFLOW.md` si tienes dudas

### 🔄 Flujo Estándar para IA
```bash
# 1. Verificar ubicación actual
git branch

# 2. Cambiar a development si es necesario
git checkout development-v1.0

# 3. Verificar salud del sistema
./scripts/health-check.sh

# 4. Hacer cambios en apps/frontend/ principalmente
cd apps/frontend
# [realizar modificaciones]

# 5. Verificar cambios
npm run type-check
npm run lint

# 6. Commit con mensaje claro
git add .
git commit -m "tipo: descripción clara del cambio"
```

### 📁 Archivos Más Importantes para IA
| Archivo | Para Qué | ⚠️ Cuidado |
|---------|----------|-----------|
| `apps/frontend/src/app/page.tsx` | Página principal | 🟡 Testing requerido |
| `apps/frontend/src/components/` | Componentes UI | ✅ Seguro modificar |
| `apps/frontend/prisma/schema.prisma` | Base de datos | 🔥 Requiere migración |
| `apps/frontend/src/lib/` | Utilidades | ✅ Seguro modificar |

## 🛠️ Comandos Útiles

### Para Desarrollo Diario
```bash
# Verificar estado del sistema
./scripts/health-check.sh

# Trabajar en frontend
cd apps/frontend
npm run dev              # Desarrollo (puerto 3000)
npm run build           # Build de producción  
npm run test            # Ejecutar tests
npm run lint            # Verificar código
npm run type-check      # Verificar TypeScript

# Base de datos
npx prisma studio       # Interface visual
npx prisma migrate dev  # Aplicar cambios BD
```

### Para Verificar Todo Antes de Commit
```bash
# En apps/frontend/
npm run test && npm run lint && npm run type-check && npm run build
```

## 🔧 Solución de Problemas Comunes

### Error: "No puedo hacer commit"
```bash
# Verificar rama
git branch
# Si estás en main/production:
git checkout development-v1.0
```

### Error: "Dependencias faltantes"
```bash
cd apps/frontend
npm install
```

### Error: "Base de datos no conecta"
```bash
cd apps/frontend
# Verificar archivo .env.local
# Aplicar migraciones
npx prisma migrate dev
```

### Error: "Tests fallan"
```bash
cd apps/frontend
npm run test:debug
# Ver errores específicos
```

## 📋 Checklist Antes de Trabajar

### ✅ Para Humanos
- [ ] Estoy en rama `development-v1.0`
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos configurada
- [ ] Variables de entorno configuradas (.env.local)
- [ ] `./scripts/health-check.sh` pasa sin errores

### ✅ Para IA
- [ ] Ejecuté `git branch` y estoy en `development-v1.0`
- [ ] Lei `docs/WORKFLOW.md`
- [ ] Entiendo qué archivos puedo modificar
- [ ] Sé que NUNCA debo tocar `main` o `production`
- [ ] Ejecuté `./scripts/health-check.sh`

## 🎯 Objetivos del Proyecto

### 🚀 Aplicación Principal (`apps/frontend/`)
- **Qué es**: Plataforma web Next.js para conectores de datos
- **Características**: Autenticación, dashboard, gestión de clientes
- **Puerto**: 3000
- **Framework**: Next.js 14 + TypeScript + TailwindCSS

### 🎨 Librerías (`libs/`)
- **Qué es**: Componentes reutilizables y animaciones
- **Principal**: `dafel-banda-vectorization` (animaciones SVG)
- **Uso**: Se importan desde apps/frontend

### 📊 Sistema Completo
- **Frontend**: Interfaz web completa
- **Backend**: API integrada en Next.js
- **Base de Datos**: PostgreSQL con Prisma
- **Autenticación**: NextAuth.js
- **Estilos**: TailwindCSS + design tokens

## 🆘 Si Todo Sale Mal

### 🔄 Reset Completo (Último Recurso)
```bash
# Backup de cambios locales
git stash push -m "backup antes de reset"

# Volver a estado limpio
git checkout development-v1.0
git reset --hard origin/development-v1.0

# Reinstalar dependencias
cd apps/frontend
rm -rf node_modules package-lock.json
npm install

# Verificar sistema
cd ..
./scripts/health-check.sh
```

### 📞 Pedir Ayuda
1. **Verificar**: `./scripts/health-check.sh`
2. **Documentar**: Qué intentabas hacer
3. **Incluir**: Output de los comandos que fallaron
4. **Mencionar**: En qué rama estás trabajando

---

**⚡ OBJETIVO**: Cualquier persona (humana o IA) debe poder empezar a trabajar en menos de 15 minutos siguiendo esta guía.**