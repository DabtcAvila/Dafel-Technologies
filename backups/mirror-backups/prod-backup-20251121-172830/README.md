# 🚀 DAFEL TECHNOLOGIES

**Plataforma empresarial Next.js con sistema de gestión de clientes**

## 🤖 PARA INTELIGENCIA ARTIFICIAL

### ⚠️ EJECUTAR ESTO PRIMERO SIEMPRE:

**En VSCode:**
1. **Cmd+Shift+P** → **Tasks: Run Task** → **🤖 /dafelwork**

**En Terminal:**
```bash
./scripts/dafelwork.sh
```

**🔥 NUNCA trabajar sin ejecutar esto primero**

---

## ⚡ Inicio Rápido

```bash
# 1. Ejecutar comando obligatorio (SIEMPRE PRIMERO)
./scripts/dafelwork.sh

# 2. Ir a la aplicación
cd apps/frontend

# 3. Instalar dependencias
npm install

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir http://localhost:3000
```

## 📁 Estructura Simple

```
Dafel-Technologies/
├── apps/frontend/          # ⭐ APLICACIÓN PRINCIPAL
├── scripts/                # 🔧 Scripts automáticos
├── docs/                   # 📖 Documentación
└── README.md              # Este archivo
```

## ⚠️ Reglas Obligatorias

- ❌ **NUNCA** tocar ramas `main` o `production`
- ✅ **SIEMPRE** trabajar en `development-v1.0`
- ✅ **SIEMPRE** ejecutar `/dafelwork` primero
- ✅ **SOLO** modificar archivos en `apps/frontend/src/`

## 🎯 Archivos Importantes

- `apps/frontend/src/app/page.tsx` - Página principal
- `apps/frontend/src/app/hub/page.tsx` - Sistema de gestión 
- `apps/frontend/src/components/` - Componentes UI
- `apps/frontend/package.json` - Configuración del proyecto

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático  
- **PostgreSQL + Prisma** - Base de datos
- **TailwindCSS** - Estilos
- **NextAuth.js** - Autenticación

## 🔧 Comandos Útiles

```bash
cd apps/frontend

npm run dev          # Desarrollo (puerto 3000)
npm run build        # Build producción
npm run test         # Ejecutar tests
npm run lint         # Verificar código
```

## 📖 Documentación

- `docs/WORKFLOW.md` - Flujo de trabajo completo
- `docs/ARCHIVOS_CLAVE.md` - Navegación de archivos
- `apps/frontend/README.md` - Guía específica del frontend

---

## ⚡ PARA TRABAJAR RÁPIDO

1. **Ejecuta `/dafelwork`** (obligatorio)
2. **`cd apps/frontend && npm run dev`**
3. **Modifica archivos en `src/`**
4. **¡Ya está!**

**🎯 Si algo no funciona, lee `docs/WORKFLOW.md`**