# WINDSURF ENGINE DOCUMENTATION

## Overview

The WindsurfEngine is a comprehensive JavaScript animation system designed for Next.js 14 applications. It provides dynamic color cycling, performance optimization, scroll-triggered effects, and advanced user interaction handling with full TypeScript support.

## Features

### 🌈 Dynamic Color Cycling
- Real-time color interpolation
- CSS Houdini support with fallbacks
- 8-gradient rainbow system
- Custom color schemes

### ⚡ Performance Optimization
- GPU acceleration detection
- RequestAnimationFrame management
- Memory leak prevention
- Battery-aware animations
- CPU usage monitoring

### 📜 Scroll Effects
- Intersection Observer integration
- Scroll velocity calculations
- Direction-based color changes
- Parallax-style effects

### 👆 User Interactions
- Mouse/touch tracking
- Hover enhancement effects
- Click ripple animations
- Device motion integration

### ♿ Accessibility
- `prefers-reduced-motion` detection
- Battery level awareness
- Graceful degradation
- High contrast mode support

## Installation

1. **Copy the core files:**
   - `/src/lib/windsurf-engine.ts` - Main engine
   - `/src/styles/windsurf-engine.css` - CSS styles
   - `/src/components/WindsurfAnimations.tsx` - React components

2. **Add to your CSS imports:**
   ```css
   /* In your globals.css or main CSS file */
   @import './windsurf-engine.css';
   ```

3. **Install dependencies (if not already present):**
   ```bash
   npm install framer-motion react-intersection-observer
   ```

## Quick Start

### Basic Rainbow Background

```tsx
import { RainbowBackground, RainbowText } from '@/components/WindsurfAnimations';

function MyComponent() {
  return (
    <RainbowBackground intensity="medium" speed="normal">
      <RainbowText as="h1">
        Welcome to Windsurf!
      </RainbowText>
    </RainbowBackground>
  );
}
```

### Interactive Elements

```tsx
import { InteractiveElement } from '@/components/WindsurfAnimations';

function InteractiveCard() {
  return (
    <InteractiveElement
      className="p-6 bg-gray-800 rounded-xl"
      onHover={(isHovered) => console.log('Hover:', isHovered)}
      onClick={() => console.log('Clicked!')}
    >
      <p>Hover and click me!</p>
    </InteractiveElement>
  );
}
```

### Scroll Animations

```tsx
import { ScrollAnimated } from '@/components/WindsurfAnimations';

function ScrollContent() {
  return (
    <ScrollAnimated 
      animationType="fadeIn" 
      delay={0.2}
      threshold={0.1}
    >
      <div>This content animates when scrolled into view</div>
    </ScrollAnimated>
  );
}
```

## Component API

### RainbowBackground

Creates an animated rainbow background effect.

**Props:**
- `intensity?: 'low' | 'medium' | 'high'` - Color intensity
- `speed?: 'slow' | 'normal' | 'fast'` - Animation speed
- `direction?: 'horizontal' | 'vertical' | 'diagonal'` - Gradient direction
- `disabled?: boolean` - Disable animations

**Example:**
```tsx
<RainbowBackground 
  intensity="high" 
  speed="fast" 
  direction="diagonal"
>
  Content here
</RainbowBackground>
```

### RainbowText

Applies rainbow color animation to text elements.

**Props:**
- `as?: keyof JSX.IntrinsicElements` - HTML element to render (default: 'span')
- `gradient?: 'rainbow' | 'sunset' | 'ocean' | 'forest'` - Color scheme
- `disabled?: boolean` - Disable animations

**Example:**
```tsx
<RainbowText as="h1" gradient="sunset">
  Animated Text
</RainbowText>
```

### InteractiveElement

Adds mouse/touch interactions with visual feedback.

**Props:**
- `onHover?: (isHovered: boolean) => void` - Hover callback
- `onClick?: (event: React.MouseEvent) => void` - Click callback
- `rippleColor?: string` - Custom ripple effect color
- `disabled?: boolean` - Disable interactions

**Example:**
```tsx
<InteractiveElement
  onHover={(hovered) => setIsHovered(hovered)}
  onClick={handleClick}
  rippleColor="rgba(255, 0, 0, 0.4)"
>
  Interactive content
</InteractiveElement>
```

### ScrollAnimated

Triggers animations based on scroll position.

**Props:**
- `triggerOnce?: boolean` - Only animate once (default: true)
- `threshold?: number` - Intersection threshold (default: 0.1)
- `rootMargin?: string` - Root margin for intersection
- `delay?: number` - Animation delay in seconds
- `duration?: number` - Animation duration in seconds
- `animationType?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn'`

**Example:**
```tsx
<ScrollAnimated
  animationType="slideUp"
  delay={0.2}
  duration={0.8}
  triggerOnce={false}
>
  Scroll-triggered content
</ScrollAnimated>
```

### RainbowBorder

Adds an animated rainbow border to elements.

**Props:**
- `disabled?: boolean` - Disable animations

**Example:**
```tsx
<RainbowBorder className="p-4 bg-gray-800 rounded-lg">
  Content with rainbow border
</RainbowBorder>
```

### ParallaxScroll

Creates parallax scrolling effects.

**Props:**
- `speed?: number` - Parallax speed multiplier (default: 0.5)
- `direction?: 'up' | 'down' | 'left' | 'right'` - Movement direction
- `disabled?: boolean` - Disable effect

**Example:**
```tsx
<ParallaxScroll speed={0.3} direction="up">
  Parallax content
</ParallaxScroll>
```

### PerformanceContainer

Monitors performance and provides fallbacks.

**Props:**
- `monitoring?: boolean` - Enable performance monitoring
- `fallback?: React.ReactNode` - Fallback content for low performance

**Example:**
```tsx
<PerformanceContainer
  monitoring={true}
  fallback={<div>Performance mode active</div>}
>
  Main content
</PerformanceContainer>
```

## Hooks

### useWindsurfEngine

Main hook to access the WindsurfEngine instance.

```tsx
import { useWindsurfEngine } from '@/lib/windsurf-engine';

function MyComponent() {
  const { engine, isReady } = useWindsurfEngine({
    debug: true,
    performanceConfig: {
      maxFPS: 60,
      gpuAcceleration: true
    }
  });

  return isReady ? <div>Engine ready!</div> : <div>Loading...</div>;
}
```

### useRainbowElement

Automatically adds rainbow effects to an element.

```tsx
import { useRainbowElement } from '@/lib/windsurf-engine';

function MyComponent() {
  const ref = useRainbowElement();
  
  return <div ref={ref}>This will have rainbow effects</div>;
}
```

### useScrollAnimation

Adds scroll-based animation control.

```tsx
import { useScrollAnimation } from '@/lib/windsurf-engine';

function MyComponent() {
  const ref = useScrollAnimation((entry) => {
    if (entry.isIntersecting) {
      console.log('Element is visible!');
    }
  });
  
  return <div ref={ref}>Scroll-tracked element</div>;
}
```

### useRainbowColors

Manages color schemes dynamically.

```tsx
import { useRainbowColors } from '@/components/WindsurfAnimations';

function ColorController() {
  const { colors, updateColors } = useRainbowColors();

  const setOceanTheme = () => {
    updateColors([
      { hue: 200, saturation: 100, lightness: 40 },
      { hue: 210, saturation: 95, lightness: 45 },
      // ... more colors
    ]);
  };

  return (
    <button onClick={setOceanTheme}>
      Apply Ocean Theme ({colors.length} colors)
    </button>
  );
}
```

### useAnimationControl

Controls animations programmatically.

```tsx
import { useAnimationControl } from '@/components/WindsurfAnimations';

function AnimationController() {
  const { 
    createAnimation, 
    playAnimation, 
    pauseAnimation, 
    stopAnimation,
    isReady 
  } = useAnimationControl();

  const animateElement = (element: Element) => {
    const id = createAnimation(element, [
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ], { duration: 1000 });
    
    playAnimation(id);
  };

  return isReady ? <div>Animation controls ready</div> : <div>Loading...</div>;
}
```

## Configuration

### Engine Options

```tsx
const engineOptions = {
  colorConfig: {
    hue: 0,
    saturation: 96,
    lightness: 55
  },
  animationConfig: {
    duration: 3000,
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    delay: 0,
    repeat: 'infinite',
    direction: 'normal'
  },
  performanceConfig: {
    maxFPS: 60,
    gpuAcceleration: true,
    reducedMotion: false,
    batteryAware: true,
    memoryThreshold: 100 * 1024 * 1024
  },
  scrollConfig: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    velocityTracking: true,
    directionTracking: true
  },
  interactionConfig: {
    mouseTracking: true,
    touchSupport: true,
    rippleEffect: true,
    hoverEnhancement: true
  },
  debug: false
};

const { engine } = useWindsurfEngine(engineOptions);
```

## CSS Classes

The engine provides several CSS classes for customization:

### Core Classes
- `.windsurf-rainbow` - Basic rainbow background
- `.windsurf-rainbow-text` - Rainbow text effect
- `.windsurf-rainbow-border` - Rainbow border effect
- `.windsurf-interactive` - Interactive element base
- `.windsurf-scroll-effect` - Scroll animation base

### Utility Classes
- `.windsurf-pause-animations` - Pause all animations
- `.windsurf-disable-interactions` - Disable interactions
- `.windsurf-gpu-optimized` - GPU acceleration hints
- `.windsurf-smooth-edges` - Font smoothing

### State Classes
- `.in-view` - Element is in viewport
- `.windsurf-ripple-active` - Active ripple effect

## Custom CSS Properties

The engine uses CSS custom properties for dynamic control:

```css
:root {
  --windsurf-color-1: hsl(0deg, 96%, 55%);
  --windsurf-color-2: hsl(25deg, 100%, 50%);
  /* ... up to --windsurf-color-8 */
  
  --windsurf-duration: 3s;
  --windsurf-easing: cubic-bezier(0.4, 0, 0.6, 1);
  
  --mouse-proximity: 0;
  --hover-intensity: 0;
  --scroll-velocity: 0;
  --scroll-direction: 1;
  
  --ripple-x: 50%;
  --ripple-y: 50%;
}
```

## Performance Considerations

### Automatic Optimizations
- GPU acceleration detection
- Battery-aware animation reduction
- FPS monitoring and adjustment
- Memory usage tracking

### Manual Optimizations
```tsx
// Disable animations on low-end devices
const { engine } = useWindsurfEngine({
  performanceConfig: {
    maxFPS: 30,
    batteryAware: true
  }
});

// Use performance container for automatic fallbacks
<PerformanceContainer fallback={<StaticContent />}>
  <AnimatedContent />
</PerformanceContainer>
```

## Accessibility

### Automatic Features
- Respects `prefers-reduced-motion`
- High contrast mode support
- Screen reader compatibility
- Keyboard navigation support

### Manual Configuration
```tsx
// Disable animations for accessibility
<RainbowBackground disabled={prefersReducedMotion}>
  Content
</RainbowBackground>

// Add ARIA labels
<InteractiveElement aria-label="Interactive rainbow button">
  Click me
</InteractiveElement>
```

## Browser Support

### Required Features
- `requestAnimationFrame`
- `IntersectionObserver`
- CSS transforms
- CSS custom properties

### Optional Features (with fallbacks)
- CSS Houdini (Paint API)
- Battery Status API
- Performance Observer API
- Web Animations API

## Troubleshooting

### Common Issues

1. **Animations not working:**
   - Check if `prefers-reduced-motion` is enabled
   - Verify the engine is initialized (`isReady` from hook)
   - Check browser console for errors

2. **Poor performance:**
   - Enable performance monitoring
   - Check FPS and memory usage
   - Consider disabling GPU acceleration on problematic devices

3. **Colors not changing:**
   - Verify CSS custom properties are supported
   - Check if Houdini is available (fallbacks should work)
   - Ensure elements have the correct CSS classes

### Debug Mode

Enable debug mode to see detailed logging:

```tsx
const { engine } = useWindsurfEngine({ debug: true });
```

## Examples

Check the demo page at `/windsurf-demo` for comprehensive examples of all features.

## License

Part of the Dafel Technologies frontend system.

## Support

For support and questions, refer to the project documentation or contact the development team.