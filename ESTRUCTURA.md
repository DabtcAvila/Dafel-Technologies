# 📁 ESTRUCTURA VISUAL

```
📂 Dafel-Technologies/
│
├── 🔧 development/                   ← DESARROLLO ACTIVO
│   ├── CAMBIOS.md                   ← Log de modificaciones  
│   └── apps/frontend/               ← Código desarrollo
│       └── src/app/dev/v01/         ← Carrusel 3 imágenes ✅
│
├── 🏭 production/                   ← CÓDIGO EN VIVO  
│   ├── DEPLOYMENT.md               ← Guía deploy
│   ├── LAST-DEPLOY.md              ← Último deploy
│   ├── changelog-produccion.md     ← Historial releases
│   └── apps/frontend/              ← dafel.com.mx
│
├── 🔒 backups/v000/                 ← RESPALDO SEGURO
│   └── apps/frontend/              ← Baseline original
│
├── 🛠️ scripts/                      ← HERRAMIENTAS
│   ├── dev-server.sh               ← dev.dafel.com.mx (3001)
│   ├── prod-server.sh              ← dafel.com.mx (3000)
│   ├── start-dev-tunnel.sh         ← Túnel desarrollo
│   └── deploy-to-production.sh     ← Deploy seguro
│
├── 📚 docs/                         ← DOCUMENTACIÓN
│   ├── FLUJO-DESARROLLO.md         ← Workflow completo
│   └── ARQUITECTURA.md             ← Diseño enterprise
│
├── 📄 README.md                     ← Entrada principal
└── 📋 ESTRUCTURA.md                 ← Este archivo
```

## 🎯 **REGLAS CRYSTAL CLEAR**

### **DESARROLLO:**
- Claude modifica SOLO: `development/apps/frontend/`
- Usuario ve: `dev.dafel.com.mx` (Puerto 3001)

### **PRODUCCIÓN:**  
- Deploy manual: `./scripts/deploy-to-production.sh`
- URL: `dafel.com.mx` (Puerto 3000)

### **BACKUP:**
- Automático antes de cada deploy
- Rollback disponible en `backups/`

---

**🏆 ESTRUCTURA ENTERPRISE-GRADE SIN CONFUSIONES**