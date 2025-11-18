# Dafel Banda Cross-Platform Component Library

A comprehensive, production-ready component library for the Dafel banda SVG across multiple frameworks and platforms.

## 🌟 Features

- **Multi-Framework Support**: React, Vue 3, Angular, Svelte, Web Components, Flutter
- **Rich Animations**: 5+ animation types per framework
- **Interactive Elements**: Hover, click, and gesture support
- **Performance Optimized**: Lazy loading, virtualization, and efficient rendering
- **Accessibility Compliant**: WCAG 2.1 AA standards
- **TypeScript First**: Full type safety across all components
- **Server-Side Rendering**: SSR support for Next.js, Nuxt.js, and SvelteKit

## 📁 Structure

```
components/
├── react/               # React components with TypeScript
├── vue/                 # Vue 3 Composition API components  
├── angular/             # Angular standalone components
├── svelte/              # Svelte/SvelteKit components
├── web-components/      # Vanilla Web Components
├── flutter/             # Flutter CustomPainter widgets
├── examples/            # Integration examples
├── docs/                # Comprehensive documentation
└── shared/              # Shared utilities and types
```

## 🚀 Quick Start

### React
```bash
npm install @dafel/banda-react
```

```tsx
import { DafelBanda } from '@dafel/banda-react';

<DafelBanda animation="wave" interactive />
```

### Vue 3
```bash
npm install @dafel/banda-vue
```

```vue
<template>
  <DafelBanda animation="pulse" :interactive="true" />
</template>
```

### Angular
```bash
npm install @dafel/banda-angular
```

```typescript
import { DafelBandaComponent } from '@dafel/banda-angular';

@Component({
  imports: [DafelBandaComponent],
  template: '<dafel-banda animation="fadeIn" />'
})
```

## 📚 Documentation

Each framework includes:
- Installation guide
- API documentation
- Usage examples
- Customization options
- Performance tips
- Troubleshooting guide

## 🎨 Animation Types

1. **fadeIn** - Smooth entrance animation
2. **wave** - Continuous wave motion
3. **pulse** - Rhythmic scaling effect
4. **scroll** - Scroll-based parallax
5. **morphing** - Shape transformation
6. **interactive** - Hover and click responses

## 🔧 Customization

All components support:
- Custom dimensions
- Color theme overrides
- Animation timing control
- Accessibility preferences
- Performance tuning

## 📦 Framework Compatibility

| Framework | Version | SSR | TypeScript | Animations |
|-----------|---------|-----|------------|------------|
| React | 18+ | ✅ | ✅ | Framer Motion |
| Vue 3 | 3.3+ | ✅ | ✅ | Vue Transition |
| Angular | 16+ | ✅ | ✅ | Angular Animations |
| Svelte | 4+ | ✅ | ✅ | Svelte Motion |
| Web Components | Modern | ✅ | ✅ | Web Animations API |
| Flutter | 3.10+ | N/A | N/A | AnimationController |

## 🏗️ Built With

- Modern ES2022+ features
- Tree-shakable exports
- Optimized bundle sizes
- Zero unnecessary dependencies
- Comprehensive test coverage

## 📄 License

MIT License - see LICENSE file for details