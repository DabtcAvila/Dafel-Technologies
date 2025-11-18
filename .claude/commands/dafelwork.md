# /dafelwork

## 🤖 COMANDO OBLIGATORIO PARA CUALQUIER IA

⚠️ **EJECUTAR ESTO PRIMERO SIEMPRE ANTES DE TRABAJAR**

Este comando configura el entorno completo y proporciona toda la información necesaria para trabajar de forma segura en el proyecto Dafel Technologies.

## Qué hace este comando:

1. ✅ **Verifica la ubicación** - Confirma que estás en el proyecto correcto
2. ✅ **Cambia a rama segura** - Te mueve automáticamente a `development-v1.0`
3. ✅ **Verifica la estructura** - Confirma que el proyecto está íntegro
4. ✅ **Proporciona información crítica** - Te da todos los detalles necesarios
5. ✅ **Comandos de emergencia** - Te da herramientas si algo sale mal

## Ejecuta esto:

```bash
./scripts/dafelwork.sh
```

## ⚠️ REGLAS CRÍTICAS DESPUÉS DE EJECUTAR:

- ❌ **NUNCA** tocar ramas `main` o `production`
- ✅ **SIEMPRE** trabajar en rama `development-v1.0`
- ✅ **SOLO** modificar archivos en `apps/frontend/src/`
- 📖 **LEER** `docs/WORKFLOW.md` si tienes dudas

## 🎯 Archivos principales a modificar:

- `apps/frontend/src/app/page.tsx` - Página principal
- `apps/frontend/src/app/hub/page.tsx` - Sistema de gestión
- `apps/frontend/src/components/` - Componentes UI

## 🚀 Para empezar a desarrollar:

```bash
cd apps/frontend
npm run dev
```

**🔥 SIN ESTE COMANDO PRIMERO, NO HAGAS NADA MÁS**