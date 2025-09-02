# Dafel Studio - Documentación Técnica Completa

## 1. VISIÓN GENERAL

### Propósito del Dafel Studio
Dafel Studio es la interfaz de diseño visual para la plataforma Dafel Technologies, concebida como un entorno de trabajo minimalista donde los usuarios pueden construir flujos de trabajo de procesamiento de datos e inteligencia artificial mediante una interfaz drag-and-drop. El Studio representa el núcleo operativo de la plataforma, permitiendo a los usuarios crear pipelines de datos complejos de manera visual e intuitiva.

### Estado actual de desarrollo
- **Fase:** Prototipo visual (MVP)
- **Estado:** Interfaz base implementada con mockup estático
- **Funcionalidad:** Navegación básica y visualización de componentes

### Fechas importantes
- **Fecha de creación:** 2 de Septiembre de 2025
- **Última actualización:** 2 de Septiembre de 2025
- **Versión:** 0.1.0

---

## 2. ESTRUCTURA DE ARCHIVOS

### Archivos principales relacionados con /studio

```
frontend/
├── src/
│   ├── app/
│   │   ├── studio/
│   │   │   └── page.tsx           # Componente principal de la página Studio
│   │   └── page.tsx                # Landing page con botones de navegación a Studio
│   ├── components/
│   │   └── DafelSection.tsx        # Sección con botón de navegación a Studio
│   ├── contexts/
│   │   └── LanguageContext.tsx     # Context provider para internacionalización
│   └── locales/
│       ├── en.json                 # Traducciones en inglés
│       └── es.json                 # Traducciones en español
```

### Imports y dependencias

#### Dependencias del componente StudioPage:
```typescript
// React y hooks
import { useState } from 'react';

// Animaciones
import { motion } from 'framer-motion';

// Contexto y utilidades
import { useLanguage } from '@/contexts/LanguageContext';

// Iconos de Heroicons
import { 
  CubeIcon,
  CircleStackIcon,
  CpuChipIcon,
  BeakerIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
```

---

## 3. COMPONENTES

### StudioPage Component
**Ubicación:** `frontend/src/app/studio/page.tsx`

#### Props
- No recibe props (página standalone)

#### Estado interno
```typescript
const [activeIcon, setActiveIcon] = useState(0);  // ID del icono activo en el sidebar
```

#### Funcionalidad actual
- Renderiza la interfaz completa del Studio
- Maneja la selección de iconos en el sidebar
- Muestra un canvas con nodos de workflow estáticos
- Implementa animaciones de entrada con Framer Motion

#### Elementos visuales que renderiza

1. **Sidebar (60px ancho)**
   - 6 iconos verticales
   - Fondo negro (`bg-gray-900`)
   - Iconos con estados hover y active
   - Espaciado uniforme entre iconos

2. **Área principal**
   - Header con título "Dafel Studio"
   - Canvas con 4 nodos de workflow
   - Líneas conectoras con flechas
   - Texto de instrucciones

3. **Nodos del workflow**
   - Data → Process → AI → Output
   - Posicionados estáticamente
   - Animaciones de entrada escalonadas

### Datos estructurados

```typescript
// Iconos del sidebar
const sidebarIcons = [
  { Icon: CubeIcon, id: 0 },
  { Icon: CircleStackIcon, id: 1 },
  { Icon: CpuChipIcon, id: 2 },
  { Icon: BeakerIcon, id: 3 },
  { Icon: ChartBarIcon, id: 4 },
  { Icon: Cog6ToothIcon, id: 5 }
];

// Nodos del workflow
const workflowNodes = [
  { id: 'data', label: messages.studio.data, x: 100, y: 250 },
  { id: 'process', label: messages.studio.process, x: 300, y: 250 },
  { id: 'ai', label: messages.studio.ai, x: 500, y: 250 },
  { id: 'output', label: messages.studio.output, x: 700, y: 250 }
];
```

---

## 4. LAYOUT Y DISEÑO

### Estructura del layout

```
┌─────────────────────────────────────────────┐
│                  h-screen                     │
│ ┌────┬────────────────────────────────────┐ │
│ │    │           Header                    │ │
│ │ S  ├────────────────────────────────────┤ │
│ │ i  │                                     │ │
│ │ d  │           Canvas Area               │ │
│ │ e  │                                     │ │
│ │ b  │    [Data]→[Process]→[AI]→[Output]  │ │
│ │ a  │                                     │ │
│ │ r  │                                     │ │
│ └────┴────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Colores utilizados

| Elemento | Color | Código Hex | Clase Tailwind |
|----------|-------|------------|----------------|
| Sidebar background | Negro | #111827 | bg-gray-900 |
| Sidebar icon active bg | Gris oscuro | #1f2937 | bg-gray-800 |
| Sidebar icon default | Gris | #9ca3af | text-gray-400 |
| Sidebar icon hover/active | Blanco | #ffffff | text-white |
| Canvas background | Blanco | #ffffff | bg-white |
| Canvas container | Gris claro | #f9fafb | bg-gray-50 |
| Bordes | Gris | #e5e7eb | border-gray-200 |
| Nodos border | Negro | #111827 | border-gray-900 |
| Texto principal | Negro | #111827 | text-gray-900 |
| Texto secundario | Gris | #6b7280 | text-gray-500 |
| Líneas conectoras | Gris | #9ca3af | stroke="#9ca3af" |

### Tipografías

| Elemento | Fuente | Clase |
|----------|--------|-------|
| Título principal | Monospace | font-mono |
| Texto de nodos | Monospace | font-mono |
| Texto de instrucciones | Sans-serif | font-sans |
| Peso del título | Light | font-light |
| Peso de nodos | Medium | font-medium |

### Tamaños y espaciados

| Elemento | Tamaño/Espaciado | Clase |
|----------|------------------|-------|
| Sidebar ancho | 60px | w-[60px] |
| Padding sidebar | 24px vertical | py-6 |
| Espacio entre iconos | 24px | space-y-6 |
| Iconos tamaño | 24x24px | h-6 w-6 |
| Padding iconos | 8px | p-2 |
| Header padding | 32px horizontal, 24px vertical | px-8 py-6 |
| Canvas padding | 32px | p-8 |
| Nodos padding | 24px horizontal, 16px vertical | px-6 py-4 |
| Título tamaño | 30px | text-3xl |
| Texto nodos | 14px | text-sm |

### Iconos utilizados

Todos los iconos provienen de **@heroicons/react/24/outline**:

1. **CubeIcon** - Icono de cubo 3D
2. **CircleStackIcon** - Icono de capas circulares
3. **CpuChipIcon** - Icono de chip/procesador
4. **BeakerIcon** - Icono de vaso de laboratorio
5. **ChartBarIcon** - Icono de gráfico de barras
6. **Cog6ToothIcon** - Icono de engranaje/configuración

---

## 5. FUNCIONALIDADES

### Qué funciona actualmente

✅ **Implementado y funcional:**
- Navegación desde landing page a /studio
- Renderizado de la interfaz completa
- Cambio de icono activo en sidebar (visual)
- Animaciones de entrada para nodos
- Internacionalización de textos
- Efectos hover en elementos interactivos
- Layout responsive base

### Qué está solo visual (mockup)

🎨 **Elementos mockup (no funcionales):**
- Drag & drop de nodos
- Creación de nuevas conexiones
- Edición de propiedades de nodos
- Guardado de workflows
- Ejecución de pipelines
- Interacción real con los iconos del sidebar (solo cambian visualmente)
- Funcionalidad de los nodos del canvas

### Interacciones disponibles

| Interacción | Elemento | Efecto |
|-------------|----------|--------|
| Click | Iconos sidebar | Cambia icono activo (visual) |
| Hover | Iconos sidebar | Cambia color a blanco |
| Hover | Nodos workflow | Muestra sombra |
| Click | Botones de navegación | Navega a /studio |

### Navegación entre secciones

**Puntos de entrada a Studio:**
1. Botón "Get Started" en navbar (página principal)
2. Botón "Get Started" en hero section (página principal)
3. Botón "Comenzar demo" en DafelSection
4. Botón "Comenzar con la Ontología" en framework section

---

## 6. INTERNACIONALIZACIÓN

### Textos traducidos relacionados con Studio

#### Archivo: `src/locales/en.json`
```json
"studio": {
  "title": "Dafel Studio",
  "dragPrompt": "Drag components to build your workflow",
  "data": "Data",
  "process": "Process",
  "ai": "AI",
  "output": "Output"
}
```

#### Archivo: `src/locales/es.json`
```json
"studio": {
  "title": "Dafel Studio",
  "dragPrompt": "Arrastra componentes para construir tu flujo",
  "data": "Datos",
  "process": "Proceso",
  "ai": "IA",
  "output": "Salida"
}
```

### Keys en los archivos de idiomas

| Key | Inglés | Español | Uso |
|-----|--------|---------|-----|
| `studio.title` | Dafel Studio | Dafel Studio | Título del header |
| `studio.dragPrompt` | Drag components... | Arrastra componentes... | Instrucción inferior |
| `studio.data` | Data | Datos | Nodo 1 |
| `studio.process` | Process | Proceso | Nodo 2 |
| `studio.ai` | AI | IA | Nodo 3 |
| `studio.output` | Output | Salida | Nodo 4 |

---

## 7. ESTADO Y GESTIÓN

### Cómo se maneja el estado

#### Estado local del componente
```typescript
const [activeIcon, setActiveIcon] = useState(0);
```
- **Tipo:** número (ID del icono)
- **Valor inicial:** 0 (primer icono)
- **Actualización:** onClick en cada botón del sidebar

#### Context Providers

**LanguageContext**
- Proporciona acceso a los mensajes traducidos
- Usado para: `messages.studio.*`
- No se gestiona cambio de idioma dentro del Studio (heredado del contexto global)

### Variables de estado importantes

| Variable | Tipo | Propósito | Valor inicial |
|----------|------|-----------|---------------|
| `activeIcon` | number | ID del icono activo en sidebar | 0 |
| `messages` | object | Textos internacionalizados | Desde LanguageContext |

### Flujo de datos

```
LanguageContext
    ↓
StudioPage
    ├── messages.studio.* → Textos UI
    └── activeIcon → Estado visual sidebar
```

---

## 8. RUTAS Y NAVEGACIÓN

### Ruta principal
- **URL:** `/studio`
- **Tipo:** Client-side route (Next.js App Router)
- **Archivo:** `src/app/studio/page.tsx`

### Cómo se llega al Studio

#### Desde la página principal (`src/app/page.tsx`)

1. **Navbar - Botón "Get Started"**
   ```typescript
   onClick={() => router.push('/studio')}
   ```
   Línea: 61

2. **Hero Section - Botón "Get Started"**
   ```typescript
   onClick={() => router.push('/studio')}
   ```
   Línea: 119

3. **Framework Section - Botón "Comenzar con la Ontología"**
   ```typescript
   onClick={() => router.push('/studio')}
   ```
   Línea: 174

#### Desde DafelSection (`src/components/DafelSection.tsx`)

4. **Botón "Comenzar demo"**
   ```typescript
   onClick={() => router.push('/studio')}
   ```
   Línea: 169

### Subrutas
- No existen subrutas implementadas actualmente
- Potenciales subrutas futuras:
  - `/studio/projects` - Gestión de proyectos
  - `/studio/templates` - Plantillas predefinidas
  - `/studio/settings` - Configuración

---

## 9. PENDIENTES Y MEJORAS

### TODOs en el código
No hay comentarios TODO explícitos en el código actual.

### Funcionalidades planeadas pero no implementadas

#### Alta prioridad
1. **Drag & Drop real**
   - Permitir mover nodos en el canvas
   - Reordenar conexiones
   - Añadir/eliminar nodos

2. **Panel de propiedades**
   - Configuración de cada nodo
   - Parámetros de procesamiento
   - Validación de datos

3. **Persistencia**
   - Guardar workflows
   - Cargar workflows existentes
   - Exportar/importar configuraciones

#### Media prioridad
4. **Funcionalidad del sidebar**
   - Cada icono abre un panel diferente
   - Biblioteca de componentes
   - Historial de acciones

5. **Ejecución de workflows**
   - Preview de datos
   - Ejecución paso a paso
   - Logs y debugging

6. **Colaboración**
   - Compartir workflows
   - Comentarios en nodos
   - Versionado

#### Baja prioridad
7. **Temas y personalización**
   - Modo oscuro/claro
   - Personalización de colores
   - Layouts alternativos

8. **Atajos de teclado**
   - Navegación rápida
   - Acciones comunes
   - Comandos personalizados

### Bugs conocidos
- Las animaciones iniciales pueden no cargar correctamente en el primer render (opacity: 0)
- El texto "Dafel Studio" está hardcodeado en lugar de usar `messages.studio.title`
- No hay manejo de errores para rutas inexistentes
- El canvas no es responsive para pantallas pequeñas

---

## 10. CÓDIGO CLAVE

### Patrón de animación con Framer Motion
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ 
    delay: index * 0.1,  // Animación escalonada
    duration: 0.3,
    ease: "easeOut"
  }}
>
```

### Patrón de estado condicional para estilos
```typescript
className={`p-2 rounded-lg transition-all duration-200 ${
  activeIcon === id 
    ? 'text-white bg-gray-800'     // Estado activo
    : 'text-gray-400 hover:text-white hover:bg-gray-800'  // Estado default
}`}
```

### SVG con marcadores para flechas
```svg
<defs>
  <marker
    id="arrowhead"
    markerWidth="10"
    markerHeight="10"
    refX="9"
    refY="3"
    orient="auto"
  >
    <polygon
      points="0 0, 10 3, 0 6"
      fill="#9ca3af"
    />
  </marker>
</defs>
```

### Posicionamiento absoluto de nodos
```typescript
style={{ 
  left: node.x, 
  top: node.y, 
  transform: 'translate(-50%, -50%)'  // Centrado perfecto
}}
```

### Decisiones técnicas tomadas

1. **Uso de Tailwind CSS**
   - Consistencia con el resto del proyecto
   - Desarrollo rápido de prototipos
   - Fácil mantenimiento de estilos

2. **Framer Motion para animaciones**
   - Animaciones declarativas
   - Performance optimizada
   - Compatible con React 18

3. **Estado local vs global**
   - Estado del sidebar local (no necesita persistencia)
   - Internacionalización global (compartida entre páginas)

4. **Layout fijo vs responsive**
   - Diseño desktop-first para herramienta profesional
   - Canvas con dimensiones fijas para precisión
   - Sidebar fijo para acceso constante

5. **Iconos de Heroicons**
   - Consistencia visual
   - Optimizados para web
   - Fácil actualización

---

## NOTAS ADICIONALES

### Consideraciones de performance
- Las animaciones usan `transform` y `opacity` para aprovechar GPU
- Los nodos se renderizan una sola vez (no hay re-renders innecesarios)
- El SVG es estático y no se recalcula

### Accesibilidad pendiente
- Falta agregar `aria-labels` a los iconos
- No hay navegación por teclado implementada
- Falta feedback de screen readers
- No hay indicadores de focus visibles

### Próximos pasos recomendados
1. Implementar funcionalidad real de drag & drop
2. Añadir panel de propiedades lateral
3. Conectar con backend para persistencia
4. Implementar validación de workflows
5. Añadir tests unitarios y de integración

---

*Documento generado el 2 de Septiembre de 2025*
*Versión del proyecto: 0.1.0*
*Autor: Dafel Technologies Development Team*