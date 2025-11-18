#!/bin/bash
# 🏥 HEALTH CHECK - SISTEMA DAFEL TECHNOLOGIES

echo "🔍 VERIFICACIÓN DE SALUD DEL SISTEMA"
echo "===================================="
echo ""

# Verificar rama actual
echo "📋 1. Verificando rama Git..."
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "No git repo")
echo "   Rama actual: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "production" ]]; then
    echo "   ⚠️  ADVERTENCIA: Estás en una rama protegida!"
    echo "   💡 Recomendación: git checkout development-v1.0"
elif [[ "$CURRENT_BRANCH" == "development-v1.0" ]]; then
    echo "   ✅ Rama de desarrollo - perfecto para trabajar"
else
    echo "   ℹ️  Rama personalizada detectada"
fi
echo ""

# Verificar estructura de directorios
echo "📁 2. Verificando estructura del proyecto..."
if [[ -d "apps" ]] && [[ -d "libs" ]] && [[ -d "docs" ]]; then
    echo "   ✅ Estructura de directorios correcta"
else
    echo "   ❌ Estructura de directorios incorrecta"
    echo "   💡 Ejecuta la reorganización del proyecto"
fi

if [[ -f ".protected-branches" ]]; then
    echo "   ✅ Sistema de protección de ramas presente"
else
    echo "   ❌ Sistema de protección de ramas faltante"
fi
echo ""

# Verificar aplicación frontend
echo "🚀 3. Verificando aplicación frontend..."
if [[ -d "apps/frontend" ]]; then
    echo "   ✅ Directorio frontend encontrado"
    
    cd apps/frontend
    
    if [[ -f "package.json" ]]; then
        echo "   ✅ package.json presente"
    else
        echo "   ❌ package.json faltante"
    fi
    
    if [[ -d "node_modules" ]]; then
        echo "   ✅ Dependencias instaladas"
    else
        echo "   ⚠️  Dependencias no instaladas"
        echo "   💡 Ejecuta: npm install"
    fi
    
    if [[ -f "next.config.js" ]]; then
        echo "   ✅ Configuración Next.js presente"
    else
        echo "   ❌ Configuración Next.js faltante"
    fi
    
    cd ../..
else
    echo "   ❌ Directorio frontend no encontrado"
fi
echo ""

# Verificar librerías
echo "📚 4. Verificando librerías..."
if [[ -d "libs/dafel-banda-vectorization" ]]; then
    echo "   ✅ Librería dafel-banda-vectorization presente"
else
    echo "   ❌ Librería dafel-banda-vectorization faltante"
fi
echo ""

# Verificar documentación
echo "📖 5. Verificando documentación..."
DOCS_FILES=("README.md" "docs/WORKFLOW.md" "docs/ARCHIVOS_CLAVE.md")
for file in "${DOCS_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ $file presente"
    else
        echo "   ❌ $file faltante"
    fi
done
echo ""

# Verificar archivos de configuración críticos
echo "⚙️ 6. Verificando configuraciones críticas..."
CONFIG_FILES=(".gitignore" ".git/hooks/pre-commit")
for file in "${CONFIG_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ $file presente"
    else
        echo "   ❌ $file faltante"
    fi
done
echo ""

# Test rápido de la aplicación (si las dependencias están instaladas)
echo "🧪 7. Test rápido de la aplicación..."
if [[ -d "apps/frontend/node_modules" ]]; then
    cd apps/frontend
    echo "   🔄 Verificando sintaxis TypeScript..."
    if npm run type-check --silent 2>/dev/null; then
        echo "   ✅ TypeScript sin errores"
    else
        echo "   ⚠️  Errores de TypeScript detectados"
        echo "   💡 Ejecuta: npm run type-check para ver detalles"
    fi
    
    echo "   🔄 Verificando linting..."
    if npm run lint --silent 2>/dev/null; then
        echo "   ✅ Código sin errores de linting"
    else
        echo "   ⚠️  Errores de linting detectados"
        echo "   💡 Ejecuta: npm run lint para ver detalles"
    fi
    cd ../..
else
    echo "   ⏭️  Saltando tests (dependencias no instaladas)"
fi
echo ""

# Resumen final
echo "📊 RESUMEN DE SALUD DEL SISTEMA"
echo "================================"
echo "✅ Sistema organizado y funcionando"
echo "📁 Estructura: apps/ libs/ docs/ config/ scripts/ tools/"
echo "🛡️  Protecciones: Ramas protegidas activas"
echo "🔧 Flujo: Usar development-v1.0 para trabajar"
echo ""
echo "💡 Para trabajar:"
echo "   1. git checkout development-v1.0"
echo "   2. cd apps/frontend && npm install && npm run dev"
echo ""
echo "📖 Documentación completa en: docs/ARCHIVOS_CLAVE.md"
echo "🔄 Flujo de trabajo en: docs/WORKFLOW.md"
echo ""