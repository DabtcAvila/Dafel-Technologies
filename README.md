# 🏗️ DAFEL TECHNOLOGIES - SISTEMA EMPRESARIAL

[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/DabtcAvila/Dafel-Technologies)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)](https://dafel.com.mx)
[![Security](https://img.shields.io/badge/Security-AES--256--GCM-red.svg)](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
[![Protected](https://img.shields.io/badge/Branches-Protected-orange.svg)](.protected-branches)

**Plataforma empresarial de conectores de datos con seguridad bancaria y monitoreo en tiempo real.**

## 🤖 PARA INTELIGENCIA ARTIFICIAL - COMANDO OBLIGATORIO

### ⚠️ PRIMER COMANDO SIEMPRE:
```bash
/dafelwork
```

**NUNCA trabajar sin ejecutar este comando primero. Configura el entorno seguro y proporciona toda la información necesaria.**

📖 **Documentación IA**: [SETUP_DAFELWORK.md](./SETUP_DAFELWORK.md) | [docs/WORKFLOW.md](./docs/WORKFLOW.md)

---

## ⚡ Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/DabtcAvila/Dafel-Technologies.git
cd Dafel-Technologies

# Verificar rama de desarrollo
git checkout development-v1.0

# Instalar y ejecutar la aplicación principal
cd apps/frontend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
Dafel-Technologies/
├── apps/                    # 🚀 Aplicaciones principales
│   └── frontend/           # Next.js 14 + TypeScript
├── libs/                   # 📚 Librerías reutilizables
│   └── dafel-banda-vectorization/
├── docs/                   # 📖 Documentación
├── config/                 # ⚙️ Configuraciones
├── scripts/                # 🔧 Scripts de utilidad
├── tools/                  # 🛠️ Herramientas de desarrollo
├── archive/                # 📦 Archivos históricos
└── .protected-branches     # 🛡️ Protección de ramas
```

## 🔒 Ramas Protegidas

- **`main`** - ⛔ **INTOCABLE** - Solo releases estables
- **`production`** - ⛔ **INTOCABLE** - Solo para despliegue
- **`development-v1.0`** - ✅ Rama de trabajo actual

⚠️ **IMPORTANTE**: Nunca editar directamente `main` o `production`. Ver [Flujo de Trabajo](#-flujo-de-trabajo).

## 🚀 Características Principales

### 🎯 Aplicación Frontend (`apps/frontend/`)
- ✅ **Next.js 14** - Framework React de producción
- ✅ **TypeScript** - Tipado estático completo
- ✅ **PostgreSQL** - Base de datos empresarial
- ✅ **Prisma ORM** - Manejo de datos type-safe
- ✅ **NextAuth.js** - Autenticación empresarial
- ✅ **TailwindCSS** - Sistema de diseño consistente

### 🔐 Seguridad
- ✅ **AES-256-GCM** - Cifrado bancario para credenciales
- ✅ **RBAC** - Control de acceso basado en roles
- ✅ **Audit Logs** - Registro completo de actividad
- ✅ **Rate Limiting** - Protección contra ataques

### 📊 Monitoreo
- ✅ **Winston Logging** - Logs estructurados
- ✅ **Prometheus Metrics** - Métricas de rendimiento
- ✅ **Health Checks** - Verificación automática cada 30s
- ✅ **Connection Pooling** - Auto-escalado (2-10 conexiones)

### 🎨 Librerías (`libs/`)
- ✅ **dafel-banda-vectorization** - Sistema de animaciones SVG
- ✅ **Componentes React/Vue/Angular** - Cross-framework
- ✅ **Design System** - Tokens de diseño unificados

## 🔄 Flujo de Trabajo

### Para Desarrollo
```bash
# 1. Cambiar a rama de desarrollo
git checkout development-v1.0

# 2. Crear feature branch (opcional)
git checkout -b feature/nueva-funcionalidad

# 3. Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 4. Cuando esté listo, merge a development
git checkout development-v1.0
git merge feature/nueva-funcionalidad
```

### Para Release
```bash
# Solo para maintainers con permisos especiales
git checkout main
git merge development-v1.0
git tag v1.1.0
```

## 🧪 Testing y Calidad

```bash
# Ejecutar tests
cd apps/frontend
npm run test

# Verificar tipado
npm run type-check

# Linting y formato
npm run lint
npm run format

# Tests de performance
npm run test:performance
```

## 🚀 Despliegue

### Desarrollo Local
```bash
cd apps/frontend
npm run dev         # Puerto 3000
```

### Staging
```bash
npm run build
npm run start       # Puerto 3000
```

### Producción
```bash
docker-compose -f config/docker-compose.production.yml up -d
```

## 🔧 Configuración

### Variables de Entorno
```bash
# Crear archivo .env.local en apps/frontend/
cp .env.example .env.local
```

### Base de Datos
```bash
# Configurar PostgreSQL (ver docs/DATABASE_SETUP.md)
npx prisma migrate deploy
npx prisma generate
```

## 📊 Métricas de Rendimiento

- **Tiempo de Respuesta**: <50ms promedio
- **Uptime**: 99.9% objetivo
- **Conexiones Concurrentes**: 1000+
- **Seguridad**: Cifrado AES-256-GCM

## 🔧 Comandos Útiles

```bash
# Verificar estado del sistema
./scripts/health-check.sh

# Backup de base de datos
./scripts/backup.sh

# Limpieza de archivos temporales
./scripts/cleanup.sh

# Monitoreo en tiempo real
./scripts/monitor.sh
```

## 📞 Contacto y Soporte

**Dafel Consulting**  
📧 [contact@dafelconsulting.com](mailto:contact@dafelconsulting.com)  
🌐 [dafel.com.mx](https://dafel.com.mx)  
📖 [Documentación Completa](./docs/)

---

## ⚠️ IMPORTANTE PARA DESARROLLADORES E IA

### 🤖 Instrucciones para IA
- **NUNCA** modificar ramas `main` o `production` directamente
- **SIEMPRE** usar `development-v1.0` para cambios
- **LEER** `.protected-branches` antes de cualquier operación
- **VERIFICAR** que los tests pasen antes de commit

### 👥 Instrucciones para Humanos
- Seguir el flujo de trabajo establecido
- Crear PR para cambios importantes
- Documentar nuevas características
- Mantener código limpio y tipado

**Este sistema está diseñado para ser a prueba de errores. Sigue las reglas y todo funcionará perfectamente. 🚀**