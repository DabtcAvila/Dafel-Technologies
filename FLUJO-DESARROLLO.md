# 🔄 FLUJO DE DESARROLLO CORRECTO

## 🚫 **PROBLEMA DETECTADO Y CORREGIDO**

**Lo que NO se debe hacer:**
- ❌ Modificar `/apps/frontend/` directamente
- ❌ Hacer cambios en versiones de respaldo Y versión activa
- ❌ Crear duplicaciones de código
- ❌ Generar confusión sobre "fuente de verdad"

---

## ✅ **FLUJO CORRECTO DE TRABAJO**

### **1. FUENTE DE VERDAD ÚNICA**
```
/versions/v001/    ← AQUÍ SE TRABAJA (development)
├── CAMBIOS.md     ← Documentación de cambios
└── apps/frontend/ ← Código fuente maestro
```

### **2. VERSIÓN ACTIVA (SOLO DEPLOY)**
```
/apps/frontend/    ← SOLO para testing/producción
└── src/app/       ← Copia desde v001 cuando esté lista
```

---

## 🔧 **PROCESO PASO A PASO**

### **DESARROLLO (en v001):**
1. Trabajar en `/versions/v001/apps/frontend/`
2. Hacer modificaciones necesarias
3. Documentar en `/versions/v001/CAMBIOS.md`
4. Testing local si es necesario

### **DEPLOY A ACTIVO:**
1. Solo cuando v001 esté completamente lista
2. Copiar desde v001 → apps/frontend/
3. Testing final en servidor activo
4. Commit y push a GitHub

---

## 📋 **COMANDOS ESTÁNDAR**

### **Trabajar en desarrollo:**
```bash
# Editar en v001
vi /versions/v001/apps/frontend/src/app/dev/v01/page.tsx

# Documentar cambios
vi /versions/v001/CAMBIOS.md
```

### **Deploy a activo (solo cuando esté listo):**
```bash
# Copiar archivo específico
cp versions/v001/apps/frontend/src/app/dev/v01/page.tsx apps/frontend/src/app/dev/v01/page.tsx

# O copiar carpeta completa
cp -r versions/v001/apps/frontend/ apps/
```

### **Sincronizar con GitHub:**
```bash
git add -A
git commit -m "v001: [descripción de cambios]"
git push origin development-v0.0.1
```

---

## 🎯 **VENTAJAS DE ESTE FLUJO**

1. ✅ **Una sola fuente de verdad:** Todo el desarrollo en v001
2. ✅ **No duplicaciones:** Apps/frontend solo recibe cuando está listo
3. ✅ **Control de versiones claro:** Cada versión es independiente
4. ✅ **Testing controlado:** Deploy consciente y documentado
5. ✅ **Fácil rollback:** Siempre hay v000 y v001 respaldadas

---

## 🚨 **REGLAS IMPORTANTES**

### **NUNCA:**
- ❌ Editar apps/frontend/ directamente
- ❌ Hacer cambios en múltiples lugares
- ❌ Confundir versión de desarrollo con producción

### **SIEMPRE:**
- ✅ Trabajar en `/versions/v001/`
- ✅ Documentar en `CAMBIOS.md`
- ✅ Deploy consciente a apps/ cuando esté listo
- ✅ Commit con mensajes claros

---

## 📝 **ESTADO ACTUAL CORREGIDO**

**Fuente de verdad:** `/versions/v001/apps/frontend/src/app/dev/v01/page.tsx`
- ✅ Hero section profesional implementada
- ✅ Imagen de fondo + overlay azul
- ✅ Textos originales en español
- ✅ Cache-busting aplicado

**Versión activa:** `/apps/frontend/` 
- ✅ Sincronizada con v001
- ✅ Funcionando en servidor
- ✅ Lista para testing

---

**🎯 OBJETIVO:** Desarrollo ordenado, sin confusiones, con control total de versiones.