#!/bin/bash
# 🤖 /DAFELWORK - COMANDO OBLIGATORIO PARA IA
# 
# Este comando DEBE ejecutarse al inicio de CADA sesión de IA
# Configura el entorno seguro y proporciona toda la información necesaria
#
# USO: ./scripts/dafelwork.sh
# ALIAS: /dafelwork (configurar en sistema)

clear
echo "🤖 INICIALIZANDO SESIÓN IA - PROYECTO DAFEL TECHNOLOGIES"
echo "=================================================="
echo ""

# Banner de seguridad
echo "⚠️  ADVERTENCIA CRÍTICA DE SEGURIDAD ⚠️"
echo "======================================="
echo "❌ NUNCA modificar ramas: main, production"
echo "✅ SIEMPRE usar rama: development-v1.0"
echo "📖 LEER documentación antes de cualquier cambio"
echo ""

# Verificar ubicación
echo "📍 1. VERIFICANDO UBICACIÓN DEL PROYECTO..."
if [[ ! -f ".protected-branches" ]] || [[ ! -d "apps/frontend" ]]; then
    echo "❌ ERROR: No estás en el directorio raíz de Dafel Technologies"
    echo "💡 Navega al directorio correcto del proyecto"
    echo "💡 Debe contener: apps/, docs/, scripts/, .protected-branches"
    exit 1
fi
echo "✅ Directorio correcto detectado"
echo ""

# Verificar y cambiar a rama segura
echo "🔄 2. CONFIGURANDO RAMA DE TRABAJO SEGURA..."
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "No git repo")

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "production" ]]; then
    echo "🚨 PELIGRO: Estás en rama protegida '$CURRENT_BRANCH'"
    echo "🔧 Cambiando automáticamente a development-v1.0..."
    git checkout development-v1.0
    if [ $? -eq 0 ]; then
        echo "✅ Cambiado exitosamente a development-v1.0"
    else
        echo "❌ ERROR: No se pudo cambiar a development-v1.0"
        echo "💡 Ejecuta manualmente: git checkout development-v1.0"
        exit 1
    fi
elif [[ "$CURRENT_BRANCH" == "development-v1.0" ]]; then
    echo "✅ Ya estás en la rama correcta: development-v1.0"
else
    echo "⚠️  Estás en rama personalizada: $CURRENT_BRANCH"
    echo "💡 Se recomienda usar: git checkout development-v1.0"
    read -p "¿Cambiar a development-v1.0? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout development-v1.0
        echo "✅ Cambiado a development-v1.0"
    else
        echo "⚠️  Continuando en rama personalizada"
    fi
fi
echo ""

# Verificar estructura del proyecto
echo "🏗️  3. VERIFICANDO ESTRUCTURA DEL PROYECTO..."
STRUCTURE_OK=true

# Verificar directorios principales
REQUIRED_DIRS=("apps" "libs" "docs" "config" "scripts")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "✅ $dir/ - presente"
    else
        echo "❌ $dir/ - faltante"
        STRUCTURE_OK=false
    fi
done

# Verificar archivos críticos
REQUIRED_FILES=("README.md" "QUICK_START.md" "docs/WORKFLOW.md" "docs/ARCHIVOS_CLAVE.md")
for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file - presente"
    else
        echo "❌ $file - faltante"
        STRUCTURE_OK=false
    fi
done

if [[ "$STRUCTURE_OK" == false ]]; then
    echo "❌ ESTRUCTURA INCOMPLETA - Revisar organización del proyecto"
else
    echo "✅ Estructura del proyecto correcta"
fi
echo ""

# Verificar aplicación frontend
echo "🚀 4. VERIFICANDO APLICACIÓN PRINCIPAL..."
cd apps/frontend
if [[ -f "package.json" ]]; then
    echo "✅ Frontend package.json presente"
    
    # Verificar dependencias
    if [[ -d "node_modules" ]]; then
        echo "✅ Dependencias instaladas"
    else
        echo "⚠️  Dependencias no instaladas"
        echo "💡 Ejecutar: cd apps/frontend && npm install"
    fi
    
    # Verificar archivos críticos
    if [[ -f "next.config.js" ]] && [[ -f "tailwind.config.ts" ]] && [[ -d "src" ]]; then
        echo "✅ Configuración Next.js completa"
    else
        echo "⚠️  Configuración Next.js incompleta"
    fi
else
    echo "❌ Frontend no encontrado correctamente"
fi
cd ../..
echo ""

# Mostrar información crítica para la IA
echo "🧠 5. INFORMACIÓN CRÍTICA PARA IA"
echo "=================================="
echo ""

echo "📁 ESTRUCTURA DE ARCHIVOS:"
echo "├── apps/frontend/          # 🎯 APLICACIÓN PRINCIPAL"
echo "│   ├── src/app/            # Páginas y API routes"
echo "│   ├── src/components/     # Componentes React"
echo "│   ├── src/lib/            # Utilidades y configuraciones"
echo "│   └── prisma/             # Base de datos"
echo "├── libs/                   # 📚 Librerías compartidas"
echo "├── docs/                   # 📖 Documentación"
echo "└── scripts/                # 🔧 Herramientas automáticas"
echo ""

echo "⚠️  REGLAS OBLIGATORIAS PARA IA:"
echo "1. ❌ NUNCA tocar ramas 'main' o 'production'"
echo "2. ✅ SIEMPRE trabajar en 'development-v1.0'"
echo "3. 📖 LEER docs/WORKFLOW.md antes de cambios grandes"
echo "4. 🔍 USAR docs/ARCHIVOS_CLAVE.md para navegación"
echo "5. 🧪 EJECUTAR tests antes de commits importantes"
echo "6. 💾 HACER commits frecuentes con mensajes claros"
echo ""

echo "🎯 ARCHIVOS MÁS IMPORTANTES:"
echo "• apps/frontend/src/app/page.tsx           # Página principal"
echo "• apps/frontend/src/app/hub/page.tsx       # Sistema hub"
echo "• apps/frontend/src/components/            # Componentes UI"
echo "• apps/frontend/prisma/schema.prisma       # Base de datos"
echo "• apps/frontend/src/lib/                   # Configuraciones"
echo ""

echo "🛠️  COMANDOS ÚTILES:"
echo "• ./scripts/health-check.sh                # Verificar sistema"
echo "• cd apps/frontend && npm run dev          # Ejecutar desarrollo"
echo "• cd apps/frontend && npm run build        # Build producción"
echo "• cd apps/frontend && npm run test         # Ejecutar tests"
echo "• cd apps/frontend && npm run lint         # Verificar código"
echo ""

echo "🚨 COMANDOS DE EMERGENCIA:"
echo "• git stash                                 # Guardar cambios temporalmente"
echo "• git checkout development-v1.0            # Volver a rama segura"
echo "• git status                               # Ver estado actual"
echo "• ./scripts/health-check.sh                # Diagnosticar problemas"
echo ""

# Verificar herramientas de desarrollo
echo "🔧 6. VERIFICANDO HERRAMIENTAS DE DESARROLLO..."
cd apps/frontend

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION instalado"
else
    echo "❌ Node.js no encontrado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm $NPM_VERSION disponible"
else
    echo "❌ npm no encontrado"
fi

cd ../..
echo ""

# Estado final y recomendaciones
echo "📋 7. ESTADO FINAL Y RECOMENDACIONES"
echo "===================================="

CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
echo "📍 Rama actual: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" == "development-v1.0" ]]; then
    echo "✅ LISTO PARA TRABAJAR SEGURO"
    echo ""
    echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
    echo "1. cd apps/frontend                    # Ir a aplicación principal"
    echo "2. npm install                        # Instalar dependencias (si es necesario)"
    echo "3. npm run dev                        # Ejecutar en desarrollo"
    echo ""
    echo "📚 DOCUMENTACIÓN CLAVE:"
    echo "• README.md                           # Visión general"
    echo "• QUICK_START.md                      # Inicio rápido"
    echo "• docs/WORKFLOW.md                    # Flujo de trabajo"
    echo "• docs/ARCHIVOS_CLAVE.md              # Navegación de archivos"
    echo ""
    echo "🤖 IA CONFIGURADA CORRECTAMENTE"
    echo "Puedes proceder con cualquier tarea de desarrollo de forma segura."
else
    echo "⚠️  ATENCIÓN: No estás en la rama segura"
    echo "Ejecuta: git checkout development-v1.0"
fi

echo ""
echo "=================================================="
echo "🎉 /DAFELWORK EJECUTADO EXITOSAMENTE"
echo "🤖 IA lista para trabajar de forma segura en Dafel Technologies"
echo "📞 En caso de dudas, consulta docs/WORKFLOW.md"
echo "=================================================="
echo ""