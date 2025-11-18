# 🤖 PARA CUALQUIER IA - LEE ESTO PRIMERO

## ⚠️ COMANDO OBLIGATORIO ANTES DE TRABAJAR

### En VSCode: 
1. **Cmd+Shift+P** (Mac) o **Ctrl+Shift+P** (Windows)
2. Escribir: **Tasks: Run Task**
3. Seleccionar: **🤖 /dafelwork - COMANDO OBLIGATORIO PARA IA**

### O desde terminal:
```bash
./scripts/dafelwork.sh
```

**NUNCA trabajes sin ejecutar este comando primero.**

---

## 📁 ESTRUCTURA SIMPLE

```
Dafel-Technologies/
├── apps/frontend/          # ⭐ LA APLICACIÓN PRINCIPAL
│   ├── src/                # Código fuente
│   ├── package.json        # Dependencias
│   └── README.md          # Guía específica del frontend
├── scripts/               # 🔧 Scripts automáticos
│   ├── dafelwork.sh       # ⚠️ COMANDO OBLIGATORIO
│   ├── health-check.sh    # Verificar sistema
│   └── deploy.sh          # Deployment
├── docs/                  # 📖 Documentación
└── README.md             # Este archivo
```

---

## 🎯 PARA TRABAJAR

### 1. Ejecuta /dafelwork (OBLIGATORIO)
### 2. Ve a la aplicación:
```bash
cd apps/frontend
npm run dev
```

### 3. Archivo principal:
- `apps/frontend/src/app/page.tsx` - Página principal
- `apps/frontend/src/app/hub/page.tsx` - Sistema hub

---

## ⛔ NUNCA HAGAS ESTO

- ❌ NO tocar ramas `main` o `production`
- ❌ NO trabajar sin ejecutar `/dafelwork`
- ❌ NO modificar archivos fuera de `apps/frontend/src/`

## ✅ SIEMPRE HAZ ESTO

- ✅ Ejecutar `/dafelwork` primero
- ✅ Trabajar en rama `development-v1.0`
- ✅ Hacer cambios en `apps/frontend/src/`
- ✅ Probar con `npm run dev`

---

**Si tienes dudas, lee `docs/WORKFLOW.md`**