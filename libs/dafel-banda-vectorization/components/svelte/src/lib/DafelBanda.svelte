<!--
  Dafel Banda Svelte Component - Basic Implementation
  Production-ready SVG component with full TypeScript support
-->

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { nanoid } from 'nanoid';
  import { 
    LAYER_DEFINITIONS, 
    shouldReduceMotion,
    type DafelBandaProps,
    type ThemeConfig,
    type AccessibilityConfig,
    type PerformanceConfig
  } from '../../shared/types';
  import SVGDefinitions from './components/SVGDefinitions.svelte';
  import BandLayer from './components/BandLayer.svelte';

  // Props
  export let animation: 'none' | 'fadeIn' = 'fadeIn';
  export let width: number = 1280;
  export let height: number = 720;
  export let interactive: boolean = false;
  export let className: string = '';
  export let ariaLabel: string = 'Dafel Banda decorative element';
  export let reducedMotion: boolean = false;
  export let lazy: boolean = true;
  export let performance: 'low' | 'medium' | 'high' = 'medium';
  export let accessibilityConfig: AccessibilityConfig | undefined = undefined;
  export let themeConfig: ThemeConfig | undefined = undefined;
  export let performanceConfig: PerformanceConfig | undefined = undefined;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    hover: Event;
    click: Event;
    focus: Event;
    load: void;
    error: Error;
  }>();

  // Component state
  let svgElement: SVGSVGElement;
  let instanceId = nanoid();
  let isLoaded = false;
  let hasError = false;

  // Reactive values
  $: motionReduced = shouldReduceMotion({ reducedMotion, accessibilityConfig });
  $: finalAnimation = motionReduced ? 'none' : animation;
  $: viewBox = `0 0 ${width} ${height}`;
  $: layerData = LAYER_DEFINITIONS;

  $: componentClasses = [
    'dafel-banda',
    'dafel-banda--basic',
    className,
    {
      'dafel-banda--interactive': interactive,
      'dafel-banda--reduced-motion': motionReduced,
      [`dafel-banda--${performance}`]: performance !== 'medium',
    }
  ].filter(Boolean).join(' ');

  $: componentStyles = {
    overflow: 'hidden',
    ...applyThemeStyles(),
    ...(performance === 'high' && {
      willChange: 'transform, opacity',
      transform: 'translateZ(0)', // Force GPU acceleration
    }),
  };

  // Methods
  function applyThemeStyles() {
    if (!themeConfig) return {};
    
    return {
      filter: themeConfig.darkMode ? 'invert(1) hue-rotate(180deg)' : undefined,
      opacity: themeConfig.highContrast ? 0.9 : undefined,
    };
  }

  function getTabIndex(): number | undefined {
    return interactive && accessibilityConfig?.focusable 
      ? accessibilityConfig.tabIndex || 0 
      : undefined;
  }

  function handleInteraction(event: Event) {
    if (!interactive) return;
    
    switch (event.type) {
      case 'mouseenter':
      case 'mouseover':
        dispatch('hover', event);
        break;
      case 'click':
        dispatch('click', event);
        break;
      case 'focus':
        dispatch('focus', event);
        break;
    }
  }

  function handleLoad() {
    isLoaded = true;
    dispatch('load');
  }

  function handleError() {
    const error = new Error('SVG load error');
    hasError = true;
    handleLayerError(error);
  }

  function handleLayerError(error: Error) {
    console.error('DafelBanda component error:', error);
    dispatch('error', error);
  }

  // Lifecycle
  onMount(() => {
    isLoaded = true;
    
    // Setup intersection observer for lazy loading
    if (lazy && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            isLoaded = true;
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
      
      observer.observe(svgElement);
      
      return () => observer.disconnect();
    }
  });

  // Expose public API
  export function getSvgElement(): SVGSVGElement {
    return svgElement;
  }

  export function getInstanceId(): string {
    return instanceId;
  }

  export function getLoadState(): { isLoaded: boolean; hasError: boolean } {
    return { isLoaded, hasError };
  }
</script>

<svg
  bind:this={svgElement}
  {width}
  {height}
  viewBox={viewBox}
  xmlns="http://www.w3.org/2000/svg"
  class={componentClasses}
  style={Object.entries(componentStyles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')}
  aria-label={ariaLabel}
  role={accessibilityConfig?.role || 'img'}
  tabindex={getTabIndex()}
  on:mouseenter={handleInteraction}
  on:click={handleInteraction}
  on:focus={handleInteraction}
  on:load={handleLoad}
  on:error={handleError}
>
  <!-- SVG Definitions -->
  <SVGDefinitions {instanceId} {themeConfig} />

  <!-- Background -->
  <rect 
    {width} 
    {height} 
    fill={themeConfig?.colors?.background || '#F8FBFD'} 
  />

  <!-- Band Layers -->
  {#each layerData as layer, index (layer.id)}
    <BandLayer
      {layer}
      {index}
      {instanceId}
      animation={finalAnimation}
      {interactive}
      {performance}
      on:error={(e) => handleLayerError(e.detail)}
    />
  {/each}
</svg>

<style>
  :global(.dafel-banda) {
    display: block;
    max-width: 100%;
    height: auto;
  }

  :global(.dafel-banda--interactive) {
    cursor: pointer;
  }

  :global(.dafel-banda--interactive:hover) {
    transform: scale(1.01);
    transition: transform 0.2s ease;
  }

  :global(.dafel-banda--reduced-motion),
  :global(.dafel-banda--reduced-motion *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  :global(.dafel-banda--high) {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  :global(.dafel-banda--low) {
    image-rendering: optimizeSpeed;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.dafel-banda),
    :global(.dafel-banda *) {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (max-width: 768px) {
    :global(.dafel-banda) {
      max-height: 300px;
    }
  }
</style>