# /help

## 🆘 AYUDA PARA IA - DAFEL TECHNOLOGIES

### 🔥 PRIMER COMANDO OBLIGATORIO:
```
/dafelwork
```

### 📋 COMANDOS DISPONIBLES:

- `/dafelwork` - ⚠️ **OBLIGATORIO PRIMERO** - Configura todo el entorno
- `/start` - ⚡ Inicio rápido para desarrollar
- `/help` - 📖 Esta ayuda

### 🎯 ESTRUCTURA SIMPLE:

```
Dafel-Technologies/
└── apps/frontend/          # ⭐ APLICACIÓN PRINCIPAL
    └── src/                # 👈 MODIFICA SOLO AQUÍ
        ├── app/            # Páginas
        └── components/     # Componentes UI
```

### 📁 ARCHIVOS MÁS IMPORTANTES:

1. `apps/frontend/src/app/page.tsx` - Página principal
2. `apps/frontend/src/app/hub/page.tsx` - Sistema hub
3. `apps/frontend/package.json` - Configuración

### 🚨 REGLAS CRÍTICAS:

- ❌ **NUNCA** trabajar sin ejecutar `/dafelwork` primero  
- ❌ **NUNCA** tocar ramas `main` o `production`
- ✅ **SIEMPRE** trabajar en rama `development-v1.0`
- ✅ **SOLO** modificar archivos en `apps/frontend/src/`

### 🏃‍♂️ FLUJO RÁPIDO:

1. Ejecutar `/dafelwork`
2. `cd apps/frontend && npm run dev`  
3. Modificar archivos en `src/`
4. ¡Listo!

**Si algo no funciona: Lee `docs/WORKFLOW.md`**