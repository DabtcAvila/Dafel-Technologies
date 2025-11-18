#!/bin/bash
# 🚀 NEW VERSION SCRIPT - DAFEL TECHNOLOGIES
# 
# Script automático para crear nuevas versiones con backup completo
#
# USO: ./scripts/newversion.sh

set -e  # Exit on error

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}🚀 DAFEL TECHNOLOGIES - NEW VERSION SYSTEM${NC}"
echo -e "${PURPLE}===========================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo -e "${RED}❌ ERROR: No estás en el directorio raíz de Dafel Technologies${NC}"
    exit 1
fi

# Verificar rama actual
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
echo -e "${BLUE}📍 Rama actual: $CURRENT_BRANCH${NC}"

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "production" ]]; then
    echo -e "${RED}❌ ERROR: No puedes crear versiones desde ramas protegidas${NC}"
    echo -e "${YELLOW}💡 Cambia a development-v1.0 primero${NC}"
    exit 1
fi

# Obtener versión actual del package.json
cd apps/frontend
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.1.0")
cd ../..

echo -e "${CYAN}📦 Versión actual: v$CURRENT_VERSION${NC}"

# Calcular nueva versión
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Incrementar versión minor por defecto
NEW_MINOR=$((MINOR + 1))
NEW_VERSION="$MAJOR.$NEW_MINOR.0"
NEW_BRANCH="development-v$NEW_VERSION"

echo -e "${GREEN}🆕 Nueva versión: v$NEW_VERSION${NC}"
echo -e "${GREEN}🌿 Nueva rama: $NEW_BRANCH${NC}"
echo ""

# Confirmar
read -p "¿Proceder con la creación de la nueva versión? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Creación de versión cancelada${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔄 INICIANDO PROCESO DE NUEVA VERSIÓN...${NC}"
echo ""

# 1. CREAR DIRECTORIO DE VERSIONES
echo -e "${BLUE}📁 1. Creando estructura de versiones...${NC}"
mkdir -p versions
mkdir -p deployment

# 2. BACKUP COMPLETO DE VERSIÓN ACTUAL
echo -e "${BLUE}📦 2. Creando backup completo de v$CURRENT_VERSION...${NC}"
VERSION_DIR="versions/v$CURRENT_VERSION"
mkdir -p "$VERSION_DIR"

# Copiar archivos esenciales
echo "   Copiando apps/frontend..."
cp -r apps/frontend "$VERSION_DIR/"

echo "   Copiando documentación..."
cp -r docs "$VERSION_DIR/" 2>/dev/null || mkdir -p "$VERSION_DIR/docs"

echo "   Copiando scripts..."
cp -r scripts "$VERSION_DIR/"

echo "   Copiando configuraciones..."
cp -r config "$VERSION_DIR/" 2>/dev/null || mkdir -p "$VERSION_DIR/config"

echo "   Copiando librerías..."
cp -r libs "$VERSION_DIR/" 2>/dev/null || mkdir -p "$VERSION_DIR/libs"

# Crear metadata de versión
cat > "$VERSION_DIR/version-info.json" << EOF
{
  "version": "$CURRENT_VERSION",
  "date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "branch": "$CURRENT_BRANCH",
  "commit": "$(git rev-parse HEAD)",
  "description": "Backup automático antes de crear v$NEW_VERSION",
  "deployUrl": "https://dafel.com.mx/dev/v$(printf "%02d" $MINOR)",
  "technologies": {
    "nextjs": "14.2.32",
    "typescript": "5.5.4",
    "react": "18.3.1",
    "nodejs": "$(node --version)"
  }
}
EOF

echo -e "${GREEN}   ✅ Backup completo guardado en: $VERSION_DIR${NC}"

# 3. CREAR CHANGELOG AUTOMÁTICO
echo -e "${BLUE}📋 3. Generando changelog...${NC}"
CHANGELOG_FILE="$VERSION_DIR/CHANGELOG.md"

cat > "$CHANGELOG_FILE" << EOF
# Changelog - Versión $CURRENT_VERSION

## 📅 Fecha: $(date +'%Y-%m-%d')

### 🎯 Características Principales

- ✅ Sistema de autenticación NextAuth.js
- ✅ Base de datos PostgreSQL + Prisma
- ✅ Interface de gestión de clientes (Hub)
- ✅ Componentes UI con TailwindCSS
- ✅ Sistema de protección de ramas
- ✅ Scripts automáticos de deployment

### 🛠️ Tecnologías

- **Framework**: Next.js 14.2.32
- **Lenguaje**: TypeScript 5.5.4
- **UI**: React 18.3.1 + TailwindCSS
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **Deployment**: Docker + Cloudflare

### 🌐 URL de Desarrollo

- **Desarrollo**: \`dafel.com.mx/dev/v$(printf "%02d" $MINOR)\`
- **Estado**: Funcional ✅
- **Rama**: $CURRENT_BRANCH
- **Commit**: $(git rev-parse --short HEAD)

### 📁 Archivos Principales

- \`apps/frontend/src/app/page.tsx\` - Página principal
- \`apps/frontend/src/app/hub/page.tsx\` - Sistema de gestión
- \`apps/frontend/src/components/\` - Componentes UI
- \`apps/frontend/prisma/schema.prisma\` - Esquema de BD

### 🚀 Próxima Versión

La próxima versión será **v$NEW_VERSION** con nuevas funcionalidades y mejoras.

---

*Backup automático generado por el sistema de versionado Dafel Technologies*
EOF

echo -e "${GREEN}   ✅ Changelog generado: $CHANGELOG_FILE${NC}"

# 4. CREAR NUEVA RAMA DE DESARROLLO
echo -e "${BLUE}🌿 4. Creando nueva rama de desarrollo...${NC}"

# Hacer commit de cambios actuales si los hay
if [[ -n $(git status --porcelain) ]]; then
    echo "   Guardando cambios actuales..."
    git add .
    git commit -m "💾 Backup automático antes de crear v$NEW_VERSION

📦 Versión actual: v$CURRENT_VERSION
🆕 Próxima versión: v$NEW_VERSION
📁 Backup guardado en: versions/v$CURRENT_VERSION/

🤖 Generated by newversion script"
fi

# Crear nueva rama
git checkout -b "$NEW_BRANCH"

echo -e "${GREEN}   ✅ Nueva rama creada: $NEW_BRANCH${NC}"

# 5. ACTUALIZAR VERSIÓN EN PACKAGE.JSON
echo -e "${BLUE}📝 5. Actualizando package.json a v$NEW_VERSION...${NC}"
cd apps/frontend
npm version $NEW_VERSION --no-git-tag-version
cd ../..

# 6. CREAR CONFIGURACIÓN DE DEPLOYMENT
echo -e "${BLUE}🌐 6. Configurando deployment para v$NEW_VERSION...${NC}"
DEPLOY_DIR="deployment/v$NEW_VERSION"
mkdir -p "$DEPLOY_DIR"

# Configuración específica de la versión
cat > "$DEPLOY_DIR/deploy-config.json" << EOF
{
  "version": "$NEW_VERSION",
  "deployUrl": "dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)",
  "branch": "$NEW_BRANCH",
  "buildCommand": "cd apps/frontend && npm run build",
  "startCommand": "cd apps/frontend && npm run start",
  "port": 3000,
  "environment": "development",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Script de deployment específico
cat > "$DEPLOY_DIR/deploy.sh" << EOF
#!/bin/bash
# Deploy script para v$NEW_VERSION
# URL: dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)

echo "🚀 Deploying Dafel Technologies v$NEW_VERSION"
echo "📍 URL: https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)"

cd apps/frontend

# Instalar dependencias
npm install

# Build
npm run build

# Aquí agregar lógica específica de deployment
echo "✅ Deployment completo para v$NEW_VERSION"
EOF

chmod +x "$DEPLOY_DIR/deploy.sh"

echo -e "${GREEN}   ✅ Configuración de deployment creada: $DEPLOY_DIR${NC}"

# 7. CREAR PÁGINA DE DESARROLLO /dev/vXX
echo -e "${BLUE}📱 7. Creando página de desarrollo /dev/v$(printf "%02d" $NEW_MINOR)...${NC}"
DEV_PAGE_DIR="apps/frontend/src/app/dev/v$(printf "%02d" $NEW_MINOR)"
mkdir -p "$DEV_PAGE_DIR"

cat > "$DEV_PAGE_DIR/page.tsx" << EOF
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CodeBracketIcon, ServerIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DevV$(printf "%02d" $NEW_MINOR)Page() {
  const [buildTime] = useState(new Date().toLocaleString());
  const [systemInfo, setSystemInfo] = useState({
    version: '$NEW_VERSION',
    environment: 'development',
    status: 'active'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSystemInfo({
        version: '$NEW_VERSION',
        environment: 'development', 
        status: 'active'
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      name: 'Nuevas Funcionalidades',
      description: 'Características implementadas en esta versión',
      status: 'development',
      icon: CheckCircleIcon
    },
    {
      name: 'Sistema Base',
      description: 'Hereda todas las funcionalidades de v0.0.0',
      status: 'completed',
      icon: ServerIcon
    },
    {
      name: 'Mejoras y Optimizaciones',
      description: 'Refinamientos y nuevas características',
      status: 'development',
      icon: CodeBracketIcon
    },
    {
      name: 'Testing y Validación',
      description: 'Pruebas completas antes de producción',
      status: 'development',
      icon: GlobeAltIcon
    }
  ];

  const urls = [
    {
      name: 'Esta Versión',
      url: 'https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)',
      description: 'Versión $NEW_VERSION en desarrollo'
    },
    {
      name: 'Versión Base',
      url: 'https://dafel.com.mx/dev/v00',
      description: 'Versión base v0.0.0 estable'
    },
    {
      name: 'Página Principal',
      url: 'https://dafel.com.mx',
      description: 'Sitio principal en producción'
    },
    {
      name: 'Desarrollo Local',
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo local'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src="/dafel-logo-optimized.svg"
                alt="Dafel Technologies"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dafel Technologies</h1>
                <p className="text-sm text-gray-600">Versión de Desarrollo v{\`\${systemInfo.version}\`}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-600">En Desarrollo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <CodeBracketIcon className="w-4 h-4 mr-2" />
            Nueva Versión v$NEW_VERSION - Development Environment
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Versión $NEW_VERSION
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nueva versión en desarrollo con funcionalidades mejoradas y características adicionales.
            Basada en la versión base v0.0.0 con todas las funcionalidades estables.
          </p>
        </motion.div>

        {/* System Status */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado</h3>
              <CheckCircleIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">Desarrollo</p>
            <p className="text-sm text-gray-600">Version activa en desarrollo</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Versión</h3>
              <CodeBracketIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">v{\`\${systemInfo.version}\`}</p>
            <p className="text-sm text-gray-600">Nueva versión incremental</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Build</h3>
              <ServerIcon className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-purple-600 mb-2">{\`\${buildTime.split(',')[1]}\`}</p>
            <p className="text-sm text-gray-600">{\`\${buildTime.split(',')[0]}\`}</p>
          </div>
        </motion.div>

        {/* Features Status */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Estado de Desarrollo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="bg-white rounded-lg p-6 shadow-sm border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <feature.icon className={\`w-8 h-8 \${feature.status === 'completed' ? 'text-green-500' : 'text-blue-500'}\`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{feature.name}</h4>
                      <span className={\`px-2 py-1 text-xs font-medium rounded-full \${feature.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}\`}>
                        {feature.status === 'completed' ? '✅ Completo' : '🔄 En desarrollo'}
                      </span>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* URLs Available */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">URLs de Testing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urls.map((url, index) => (
              <motion.div
                key={url.name}
                className="bg-white rounded-lg p-4 shadow-sm border hover:border-blue-300 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{url.name}</h4>
                    <p className="text-sm text-gray-600">{url.description}</p>
                    <a 
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-mono break-all"
                    >
                      {url.url}
                    </a>
                  </div>
                  <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Development Info */}
        <motion.div
          className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-6">Información de Desarrollo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-blue-200 mb-1">Framework</p>
              <p className="font-mono text-green-300">Next.js 14.2.32</p>
            </div>
            <div>
              <p className="text-sm text-blue-200 mb-1">Lenguaje</p>
              <p className="font-mono text-blue-300">TypeScript 5.5.4</p>
            </div>
            <div>
              <p className="text-sm text-blue-200 mb-1">Base de Datos</p>
              <p className="font-mono text-purple-300">PostgreSQL + Prisma</p>
            </div>
            <div>
              <p className="text-sm text-blue-200 mb-1">Versión Base</p>
              <p className="font-mono text-yellow-300">v0.0.0 Estable</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-blue-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold mb-2">🎯 Nuevas características en desarrollo:</p>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Funcionalidades mejoradas del sistema base</li>
                  <li>• Optimizaciones de rendimiento</li>
                  <li>• Nuevas características de usuario</li>
                  <li>• Mejoras en la experiencia de usuario</li>
                  <li>• Testing y validación extendidos</li>
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <Link
                  href="/dev"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-900 bg-white hover:bg-gray-50 transition-colors"
                >
                  ← Ver todas las versiones
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <p className="text-gray-600">
            <strong>Versión de Desarrollo v$NEW_VERSION</strong> - Basada en sistema base v0.0.0
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta versión hereda toda la funcionalidad estable y agrega nuevas características
          </p>
        </motion.div>
      </div>
    </div>
  );
}
EOF

echo -e "${GREEN}   ✅ Página de desarrollo creada: /dev/v$(printf "%02d" $NEW_MINOR)${NC}"

# 8. COMMIT INICIAL DE NUEVA VERSIÓN
echo -e "${BLUE}💾 7. Creando commit inicial de nueva versión...${NC}"
git add .
git commit -m "🚀 NUEVA VERSIÓN v$NEW_VERSION iniciada

✅ SISTEMA DE VERSIONADO:
- 📦 Backup v$CURRENT_VERSION guardado en versions/
- 🌿 Nueva rama: $NEW_BRANCH
- 📝 Package.json actualizado a v$NEW_VERSION
- 🌐 Deploy configurado: dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)

✅ ESTRUCTURA CREADA:
- versions/v$CURRENT_VERSION/ - Backup completo anterior
- deployment/v$NEW_VERSION/ - Configuración deploy
- CHANGELOG.md con resumen v$CURRENT_VERSION

🎯 PRÓXIMOS PASOS:
1. Desarrollar nuevas funcionalidades
2. Deploy a dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)
3. Testing y validación
4. Merge a rama principal cuando esté listo

🤖 Generated by newversion script"

# 8. ACTUALIZAR CONFIGURACIÓN DE DAFELWORK
echo -e "${BLUE}🔧 8. Actualizando configuración...${NC}"

# Actualizar CLAUDE.md con nueva información
cat >> CLAUDE.md << EOF

## 📋 VERSIONES DISPONIBLES:

### v$CURRENT_VERSION (Anterior)
- 📁 Backup: versions/v$CURRENT_VERSION/  
- 🌐 URL: dafel.com.mx/dev/v$(printf "%02d" $MINOR)
- ✅ Estado: Completa y respaldada

### v$NEW_VERSION (Actual) 
- 🌿 Rama: $NEW_BRANCH
- 🌐 URL: dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)
- 🔄 Estado: En desarrollo

EOF

echo -e "${GREEN}   ✅ Configuración actualizada${NC}"

# RESUMEN FINAL
echo ""
echo -e "${PURPLE}🎉 NUEVA VERSIÓN CREADA EXITOSAMENTE${NC}"
echo -e "${PURPLE}====================================${NC}"
echo ""
echo -e "${GREEN}📦 Versión anterior: v$CURRENT_VERSION (respaldada)${NC}"
echo -e "${GREEN}🆕 Nueva versión: v$NEW_VERSION${NC}"
echo -e "${GREEN}🌿 Rama de desarrollo: $NEW_BRANCH${NC}"
echo -e "${GREEN}🌐 URL de desarrollo: https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR)${NC}"
echo ""
echo -e "${BLUE}📁 BACKUPS CREADOS:${NC}"
echo -e "${BLUE}├── versions/v$CURRENT_VERSION/ (código completo)${NC}"
echo -e "${BLUE}├── versions/v$CURRENT_VERSION/CHANGELOG.md${NC}"
echo -e "${BLUE}└── deployment/v$NEW_VERSION/ (configuración)${NC}"
echo ""
echo -e "${YELLOW}🎯 PRÓXIMOS PASOS:${NC}"
echo "1. Desarrollar nuevas funcionalidades en esta rama"
echo "2. cd apps/frontend && npm run dev (para probar localmente)"
echo "3. Deploy a dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR) cuando esté listo"
echo "4. Todas las versiones anteriores siguen disponibles"
echo ""
echo -e "${CYAN}🔗 URLS DISPONIBLES:${NC}"
echo "• v$CURRENT_VERSION: https://dafel.com.mx/dev/v$(printf "%02d" $MINOR)"
echo "• v$NEW_VERSION: https://dafel.com.mx/dev/v$(printf "%02d" $NEW_MINOR) (nueva)"
echo ""
echo -e "${GREEN}✅ Sistema de versionado completo y funcionando${NC}"
echo ""