<!--
  Dafel Banda Animated Svelte Component
  Full-featured component with Svelte motion and animations
-->

<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut, elasticOut, sineInOut } from 'svelte/easing';
  import { fade, fly, scale, blur } from 'svelte/transition';
  import { nanoid } from 'nanoid';
  import { 
    LAYER_DEFINITIONS, 
    shouldReduceMotion,
    getLayerDelay,
    type DafelBandaProps,
    type AnimationType,
    type AnimationConfig,
    type ThemeConfig,
    type AccessibilityConfig,
    type PerformanceConfig
  } from '../../shared/types';
  import SVGDefinitions from './components/SVGDefinitions.svelte';

  // Props
  export let animation: AnimationType = 'fadeIn';
  export let width: number = 1280;
  export let height: number = 720;
  export let interactive: boolean = false;
  export let className: string = '';
  export let ariaLabel: string = 'Dafel Banda animated decorative element';
  export let reducedMotion: boolean = false;
  export let lazy: boolean = true;
  export let performance: 'low' | 'medium' | 'high' = 'medium';
  export let animationConfig: AnimationConfig | undefined = undefined;
  export let accessibilityConfig: AccessibilityConfig | undefined = undefined;
  export let themeConfig: ThemeConfig | undefined = undefined;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    hover: Event;
    click: Event;
    focus: Event;
    load: void;
    error: Error;
    animationStart: void;
    animationEnd: void;
  }>();

  // Component state
  let svgElement: SVGSVGElement;
  let instanceId = nanoid();
  let isVisible = false;
  let isPlaying = false;
  let intersectionObserver: IntersectionObserver;

  // Animation stores
  const containerOpacity = tweened(0, { duration: 1200, easing: cubicOut });
  const containerScale = tweened(0.95, { duration: 1200, easing: cubicOut });
  const containerY = tweened(50, { duration: 1200, easing: cubicOut });

  // Layer animation stores
  const layerAnimations = LAYER_DEFINITIONS.map((layer, index) => ({
    opacity: tweened(0, { 
      duration: 1000, 
      delay: getLayerDelay(index),
      easing: cubicOut 
    }),
    x: tweened(0, { 
      duration: animationConfig?.duration || 4000,
      easing: sineInOut 
    }),
    y: tweened(0, { 
      duration: animationConfig?.duration || 4000,
      easing: sineInOut 
    }),
    scale: tweened(1, { 
      duration: 3000,
      easing: sineInOut 
    })
  }));

  // Reactive values
  $: motionReduced = shouldReduceMotion({ reducedMotion, accessibilityConfig });
  $: finalAnimation = motionReduced ? 'none' : animation;
  $: viewBox = `0 0 ${width} ${height}`;
  $: layerData = LAYER_DEFINITIONS;

  $: componentClasses = [
    'dafel-banda',
    'dafel-banda--animated',
    className,
    {
      'dafel-banda--interactive': interactive,
      'dafel-banda--reduced-motion': motionReduced,
      'dafel-banda--visible': isVisible,
      [`dafel-banda--${performance}`]: performance !== 'medium',
      [`dafel-banda--${finalAnimation}`]: finalAnimation !== 'none',
    }
  ].filter(Boolean).join(' ');

  $: componentStyles = {
    overflow: 'hidden',
    ...(performance === 'high' && {
      willChange: 'transform, opacity',
      transform: 'translateZ(0)',
    }),
  };

  // Watch for visibility changes
  $: if (isVisible && !motionReduced) {
    startAnimations();
  }

  // Methods
  function startAnimations() {
    if (isPlaying || finalAnimation === 'none') return;
    
    isPlaying = true;
    dispatch('animationStart');

    // Container animation
    containerOpacity.set(1);
    containerScale.set(1);
    containerY.set(0);

    // Layer animations based on type
    switch (finalAnimation) {
      case 'fadeIn':
        startFadeInAnimation();
        break;
      case 'wave':
        startWaveAnimation();
        break;
      case 'pulse':
        startPulseAnimation();
        break;
      case 'morphing':
        startMorphingAnimation();
        break;
    }
  }

  function startFadeInAnimation() {
    layerData.forEach((layer, index) => {
      setTimeout(() => {
        layerAnimations[index].opacity.set(layer.opacity);
      }, getLayerDelay(index));
    });

    // Animation complete after longest delay + duration
    const totalDuration = getLayerDelay(layerData.length - 1) + 1000;
    setTimeout(() => {
      dispatch('animationEnd');
    }, totalDuration);
  }

  function startWaveAnimation() {
    layerData.forEach((layer, index) => {
      layerAnimations[index].opacity.set(layer.opacity);
      
      // Create wave motion
      const waveAnimation = () => {
        const anim = layerAnimations[index];
        anim.x.set(-8).then(() => 
          anim.x.set(8).then(() => 
            anim.x.set(-8).then(() => {
              if (isPlaying && finalAnimation === 'wave') {
                waveAnimation();
              }
            })
          )
        );
        
        anim.y.set(-3).then(() => 
          anim.y.set(3).then(() => 
            anim.y.set(-3)
          )
        );
      };

      setTimeout(waveAnimation, getLayerDelay(index));
    });
  }

  function startPulseAnimation() {
    layerData.forEach((layer, index) => {
      layerAnimations[index].opacity.set(layer.opacity);
      
      // Create pulse motion
      const pulseAnimation = () => {
        const anim = layerAnimations[index];
        const baseOpacity = layer.opacity;
        const maxOpacity = Math.min(baseOpacity + 0.15, 1);
        
        anim.opacity.set(maxOpacity).then(() => 
          anim.opacity.set(baseOpacity).then(() => {
            if (isPlaying && finalAnimation === 'pulse') {
              setTimeout(pulseAnimation, 100);
            }
          })
        );
        
        anim.scale.set(1.02).then(() => 
          anim.scale.set(1)
        );
      };

      setTimeout(pulseAnimation, getLayerDelay(index));
    });
  }

  function startMorphingAnimation() {
    // Simplified morphing - in production, use proper SVG morphing
    layerData.forEach((layer, index) => {
      layerAnimations[index].opacity.set(layer.opacity);
      
      const morphAnimation = () => {
        const anim = layerAnimations[index];
        anim.scale.set(1.01).then(() => 
          anim.scale.set(0.99).then(() => 
            anim.scale.set(1).then(() => {
              if (isPlaying && finalAnimation === 'morphing') {
                setTimeout(morphAnimation, 200);
              }
            })
          )
        );
      };

      setTimeout(morphAnimation, getLayerDelay(index));
    });
  }

  function stopAnimations() {
    isPlaying = false;
    
    // Reset all animations
    containerOpacity.set(0);
    containerScale.set(0.95);
    containerY.set(50);
    
    layerAnimations.forEach(anim => {
      anim.opacity.set(0);
      anim.x.set(0);
      anim.y.set(0);
      anim.scale.set(1);
    });
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

  function handleLayerInteraction(event: Event, layerId: number) {
    if (!interactive) return;
    handleInteraction(event);
  }

  function handleLoad() {
    dispatch('load');
  }

  function handleLayerError(error: Error) {
    console.error('Layer error:', error);
    dispatch('error', error);
  }

  // Lifecycle
  onMount(() => {
    if (!lazy) {
      isVisible = true;
      return;
    }

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.3, rootMargin: '-100px' }
    );

    intersectionObserver.observe(svgElement);
  });

  onDestroy(() => {
    intersectionObserver?.disconnect();
    stopAnimations();
  });

  // Public API
  export function play() {
    isVisible = true;
    startAnimations();
  }

  export function pause() {
    isPlaying = false;
  }

  export function reset() {
    stopAnimations();
    isVisible = false;
  }

  export function getSvgElement(): SVGSVGElement {
    return svgElement;
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
  opacity={$containerOpacity}
  transform="scale({$containerScale}) translateY({$containerY}px)"
>
  <!-- SVG Definitions -->
  <SVGDefinitions {instanceId} {themeConfig} />

  <!-- Background -->
  <rect 
    {width} 
    {height} 
    fill={themeConfig?.colors?.background || '#F8FBFD'} 
  />

  <!-- Animated Layers -->
  {#each layerData as layer, index (layer.id)}
    <g
      id="layer-{layer.id}-{layer.name}-{instanceId}"
      class="band-layer"
      class:band-layer--has-grid={layer.hasGrid}
      class:band-layer--interactive={interactive}
      opacity={$layerAnimations[index].opacity}
      transform="translate({$layerAnimations[index].x}, {$layerAnimations[index].y}) scale({$layerAnimations[index].scale})"
      style:cursor={interactive ? 'pointer' : 'default'}
      style:filter={layer.hasFilter && performance === 'high' ? `url(#${layer.filter}-${instanceId})` : undefined}
      on:mouseenter={(e) => interactive && handleLayerInteraction(e, layer.id)}
      on:click={(e) => interactive && handleLayerInteraction(e, layer.id)}
      on:focus={(e) => interactive && handleLayerInteraction(e, layer.id)}
    >
      <!-- Base path -->
      <path
        d={layer.path}
        fill="url(#{layer.gradient}-{instanceId})"
        class="band-path"
      />

      <!-- Grid overlay -->
      {#if layer.hasGrid}
        <path
          d={layer.path}
          fill="url(#{layer.gridPattern}-{instanceId})"
          class="band-grid-overlay"
        />
      {/if}
    </g>
  {/each}
</svg>

<style>
  :global(.dafel-banda) {
    display: block;
    max-width: 100%;
    height: auto;
  }

  :global(.dafel-banda--animated) {
    transition: all 0.3s ease;
  }

  :global(.dafel-banda--interactive) {
    cursor: pointer;
  }

  :global(.band-layer) {
    transition: all 0.3s ease;
  }

  :global(.band-layer--interactive:hover) {
    opacity: 1 !important;
  }

  :global(.band-path) {
    vector-effect: non-scaling-stroke;
  }

  :global(.band-grid-overlay) {
    pointer-events: none;
  }

  :global(.dafel-banda--reduced-motion),
  :global(.dafel-banda--reduced-motion *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
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