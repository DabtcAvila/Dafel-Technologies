# 🤖 CONFIGURACIÓN COMANDO /DAFELWORK

## 🎯 Propósito
El comando `/dafelwork` es **obligatorio** para cualquier IA que trabaje en este proyecto. Debe ser el **primer comando** ejecutado en cada sesión.

## 🚀 Configuración del Alias Global

### Para macOS/Linux (Bash/Zsh)
```bash
# Agregar al archivo ~/.bashrc o ~/.zshrc
echo 'alias /dafelwork="cd \"$HOME/MASTER proyectos/Dafel-Technologies\" && ./scripts/dafelwork.sh"' >> ~/.zshrc
source ~/.zshrc
```

### Para Windows (PowerShell)
```powershell
# Crear función en $PROFILE
function /dafelwork {
    Set-Location "$HOME/MASTER proyectos/Dafel-Technologies"
    bash ./scripts/dafelwork.sh
}
```

### Configuración Manual en VSCode
1. Abrir VSCode settings (Cmd/Ctrl + ,)
2. Buscar "terminal profile"
3. Agregar script de inicialización:
```json
{
    "terminal.integrated.shellArgs.osx": [
        "-c", 
        "alias /dafelwork='cd \"$HOME/MASTER proyectos/Dafel-Technologies\" && ./scripts/dafelwork.sh'; exec zsh"
    ]
}
```

## 🤖 Instrucciones para IA

### ⚠️ COMANDO OBLIGATORIO
**SIEMPRE ejecutar como primer comando en CADA sesión:**
```bash
/dafelwork
```

### ❌ NUNCA trabajar sin ejecutar /dafelwork
- Sin este comando, la IA puede romper el proyecto
- Sin este comando, no tiene la información necesaria
- Sin este comando, puede trabajar en ramas protegidas

### ✅ Qué hace /dafelwork:
1. ✅ Verifica que estés en el directorio correcto
2. ✅ Te cambia automáticamente a la rama segura (development-v1.0)
3. ✅ Verifica la estructura del proyecto
4. ✅ Te muestra información crítica del proyecto
5. ✅ Te da comandos útiles y de emergencia
6. ✅ Configura el entorno de trabajo seguro

## 📋 Ejemplo de Uso en Sesión IA

```bash
# Primer comando siempre
/dafelwork

# Output esperado:
# 🤖 INICIALIZANDO SESIÓN IA - PROYECTO DAFEL TECHNOLOGIES
# ==================================================
# ⚠️  ADVERTENCIA CRÍTICA DE SEGURIDAD ⚠️
# ✅ Ya estás en la rama correcta: development-v1.0
# ✅ Estructura del proyecto correcta
# 🤖 IA CONFIGURADA CORRECTAMENTE

# Después puedes trabajar normalmente
cd apps/frontend
npm run dev
```

## 🛡️ Sistema de Protección

### Protecciones Automáticas:
- ✅ **Cambio automático** a rama segura
- ✅ **Verificación** de estructura del proyecto  
- ✅ **Información crítica** para la IA
- ✅ **Comandos de emergencia** disponibles
- ✅ **Prevención de errores** comunes

### Ramas Protegidas:
- ❌ `main` - INTOCABLE
- ❌ `production` - INTOCABLE  
- ✅ `development-v1.0` - SEGURA para trabajar

## 📖 Flujo Completo para Nueva IA

```bash
# 1. Ejecutar comando obligatorio
/dafelwork

# 2. Leer documentación clave (si es necesario)
cat docs/WORKFLOW.md
cat docs/ARCHIVOS_CLAVE.md

# 3. Ir a aplicación principal
cd apps/frontend

# 4. Verificar dependencias
npm install

# 5. Ejecutar en desarrollo
npm run dev

# 6. Trabajar de forma normal y segura
# [hacer modificaciones]

# 7. Verificar antes de commits
npm run test
npm run lint
npm run type-check

# 8. Commit seguro
git add .
git commit -m "descripción del cambio"
```

## 🆘 Comandos de Emergencia

Si algo sale mal:
```bash
# Verificar estado del sistema
./scripts/health-check.sh

# Volver a rama segura
git checkout development-v1.0

# Guardar trabajo sin commit
git stash

# Reinicializar sesión
/dafelwork
```

## 🎯 Configuración Recomendada para Proyecto

### En el proyecto, crear un archivo .vscode/settings.json:
```json
{
    "terminal.integrated.shellArgs.osx": [
        "-c", 
        "echo '🤖 Ejecuta: /dafelwork para inicializar sesión IA'; exec zsh"
    ],
    "workbench.startupEditor": "readme",
    "files.exclude": {
        "**/node_modules": true,
        "**/.git": false
    }
}
```

### Mensaje en README.md para IA:
```markdown
## 🤖 PARA INTELIGENCIA ARTIFICIAL
**PRIMER COMANDO OBLIGATORIO:** `/dafelwork`
Lee docs/WORKFLOW.md para instrucciones completas.
```

## ✅ Verificación de Configuración

Para verificar que /dafelwork está configurado correctamente:

1. **Abrir nueva terminal**
2. **Ejecutar:** `/dafelwork`
3. **Verificar output:** Debe mostrar inicialización completa
4. **Verificar rama:** Debe estar en `development-v1.0`
5. **Verificar ubicación:** Debe estar en directorio del proyecto

---

**⚡ REGLA DE ORO: Ninguna IA debe trabajar en este proyecto sin ejecutar `/dafelwork` primero.**