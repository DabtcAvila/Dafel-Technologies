# 📁 ARCHIVOS CLAVE - DAFEL TECHNOLOGIES

## 🎯 Guía Rápida de Navegación

### 🚀 Aplicaciones Principales

#### `apps/frontend/` - Aplicación Next.js Principal
```
apps/frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── page.tsx           # Página principal
│   │   ├── api/               # API routes
│   │   └── hub/               # Sistema de gestión
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base
│   │   ├── hub/              # Componentes del hub
│   │   └── windsurf/         # Animaciones
│   ├── lib/                  # Librerías y utilidades
│   │   ├── auth.ts          # Configuración NextAuth
│   │   ├── prisma.ts        # Cliente Prisma
│   │   └── utils.ts         # Utilidades generales
│   └── styles/               # Estilos globales
├── prisma/
│   ├── schema.prisma         # Esquema de base de datos
│   └── migrations/           # Migraciones
├── package.json              # Dependencias del proyecto
├── next.config.js           # Configuración Next.js
└── tailwind.config.ts       # Configuración TailwindCSS
```

**Archivos más importantes:**
- 📄 `apps/frontend/src/app/page.tsx` - Página principal del sitio
- 📄 `apps/frontend/src/app/hub/page.tsx` - Sistema de gestión de clientes
- 📄 `apps/frontend/prisma/schema.prisma` - Estructura de la base de datos
- 📄 `apps/frontend/src/lib/auth.ts` - Configuración de autenticación

### 📚 Librerías Compartidas

#### `libs/dafel-banda-vectorization/` - Sistema de Animaciones
```
libs/dafel-banda-vectorization/
├── components/               # Componentes por framework
│   ├── react/               # Componentes React
│   ├── vue/                 # Componentes Vue
│   └── angular/             # Componentes Angular
├── animations/              # Engines de animación
│   ├── Dafel3DEngine.js    # Motor 3D
│   └── DafelPhysicsEngine.js # Motor de física
├── svg/                    # Assets SVG
└── preview/                # Previews del sistema
```

**Archivos más importantes:**
- 📄 `libs/dafel-banda-vectorization/components/react/src/DafelBanda.tsx` - Componente principal React
- 📄 `libs/dafel-banda-vectorization/svg/original-correct.svg` - SVG base optimizado

### 📖 Documentación

#### `docs/` - Documentación del Proyecto
```
docs/
├── WORKFLOW.md             # 🔄 Flujo de trabajo obligatorio
├── ARCHIVOS_CLAVE.md      # 📁 Esta guía
├── ARCHITECTURE.md        # 🏗️ Arquitectura del sistema
└── DEPLOYMENT.md         # 🚀 Guías de despliegue
```

### ⚙️ Configuración

#### `config/` - Configuraciones del Sistema
```
config/
├── docker-compose.production.yml  # Docker para producción
├── _config.yml                   # Configuración Jekyll
└── secrets/                     # Archivos sensibles (no en git)
```

### 🔧 Scripts y Herramientas

#### `scripts/` - Scripts de Automatización
```
scripts/
├── health-check.sh         # Verificación de salud del sistema
├── backup.sh              # Scripts de backup
├── cleanup.sh             # Limpieza de archivos temporales
└── monitor.sh             # Monitoreo en tiempo real
```

### 🛠️ Herramientas de Desarrollo

#### `tools/` - Herramientas Específicas del Proyecto
```
tools/
├── migration-tools/        # Herramientas de migración
├── testing-utilities/      # Utilidades de testing
└── deployment-scripts/    # Scripts de deployment
```

## 🔑 Archivos de Configuración Críticos

### 📋 Configuración de Proyecto Principal
| Archivo | Ubicación | Descripción | ⚠️ Criticidad |
|---------|-----------|-------------|---------------|
| `package.json` | `/apps/frontend/` | Dependencias y scripts | 🔥 ALTA |
| `next.config.js` | `/apps/frontend/` | Configuración Next.js | 🔥 ALTA |
| `tailwind.config.ts` | `/apps/frontend/` | Estilos del sistema | 🟡 MEDIA |
| `prisma/schema.prisma` | `/apps/frontend/` | Estructura BD | 🔥 ALTA |

### 🔒 Archivos de Protección
| Archivo | Ubicación | Descripción | ⚠️ Criticidad |
|---------|-----------|-------------|---------------|
| `.protected-branches` | `/` | Script de protección | 🔥 ALTA |
| `.git/hooks/pre-commit` | `/` | Hook de Git | 🔥 ALTA |
| `.gitignore` | `/` | Exclusiones de Git | 🟡 MEDIA |

### 📚 Documentación Esencial
| Archivo | Ubicación | Descripción | ⚠️ Criticidad |
|---------|-----------|-------------|---------------|
| `README.md` | `/` | Documentación principal | 🔥 ALTA |
| `docs/WORKFLOW.md` | `/docs/` | Flujo de trabajo | 🔥 ALTA |
| `docs/ARCHIVOS_CLAVE.md` | `/docs/` | Esta guía | 🟡 MEDIA |

## 🚀 Comandos por Tipo de Archivo

### Para Aplicación Frontend (`apps/frontend/`)
```bash
cd apps/frontend

# Desarrollo
npm install          # Instalar dependencias
npm run dev         # Servidor desarrollo (puerto 3000)
npm run build       # Build de producción
npm run start       # Servidor producción

# Base de datos
npx prisma generate  # Generar cliente Prisma
npx prisma migrate dev # Aplicar migraciones
npx prisma studio   # Interface visual BD

# Testing y calidad
npm run test        # Ejecutar tests
npm run lint        # Linting
npm run type-check  # Verificar TypeScript
```

### Para Librerías (`libs/`)
```bash
cd libs/dafel-banda-vectorization

# Ver preview del sistema
open preview/index.html

# Ejecutar tests de animaciones
npm run test:animations

# Build componentes
npm run build
```

### Para Scripts (`scripts/`)
```bash
# Verificar salud del sistema
./scripts/health-check.sh

# Hacer backup
./scripts/backup.sh

# Limpiar archivos temporales
./scripts/cleanup.sh

# Monitoreo continuo
./scripts/monitor.sh
```

## 🔍 Búsqueda Rápida de Funcionalidades

### 🎨 Componentes UI
- **Componentes base**: `apps/frontend/src/components/ui/`
- **Componentes del Hub**: `apps/frontend/src/components/hub/`
- **Animaciones**: `apps/frontend/src/components/windsurf/`

### 🔐 Autenticación y Seguridad
- **Configuración NextAuth**: `apps/frontend/src/lib/auth.ts`
- **Middleware de seguridad**: `apps/frontend/src/middleware.ts`
- **Tipos de auth**: `apps/frontend/src/types/next-auth.d.ts`

### 🗄️ Base de Datos
- **Esquema**: `apps/frontend/prisma/schema.prisma`
- **Migraciones**: `apps/frontend/prisma/migrations/`
- **Cliente**: `apps/frontend/src/lib/prisma.ts`

### 🌐 API y Rutas
- **API Routes**: `apps/frontend/src/app/api/`
- **Páginas**: `apps/frontend/src/app/`
- **Layouts**: `apps/frontend/src/app/layout.tsx`

### 🎭 Estilos y Diseño
- **Estilos globales**: `apps/frontend/src/styles/`
- **Tokens de diseño**: `apps/frontend/src/styles/design-tokens.css`
- **Configuración Tailwind**: `apps/frontend/tailwind.config.ts`

## ⚠️ REGLAS IMPORTANTES

### ❌ NUNCA Modificar
- Archivos en `main` o `production` directamente
- `.git/hooks/pre-commit` sin entender las consecuencias
- `apps/frontend/prisma/migrations/` manualmente
- Archivos de configuración sin backup

### ✅ SIEMPRE Verificar Antes de Editar
- Estás en la rama `development-v1.0`
- Los tests pasan: `npm run test`
- El linting está limpio: `npm run lint`
- TypeScript compila: `npm run type-check`

### 🔄 Flujo Recomendado para Ediciones
1. `git checkout development-v1.0`
2. Localizar archivo en esta guía
3. Leer documentación relacionada
4. Hacer cambios pequeños e incrementales
5. Probar inmediatamente
6. Commit con mensaje descriptivo

---

**🎯 OBJETIVO**: Esta guía debe permitir a cualquier desarrollador o IA encontrar cualquier funcionalidad en menos de 2 minutos. Si algo no está claro, ¡actualiza esta guía!**