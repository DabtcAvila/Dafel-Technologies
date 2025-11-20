<!--
  SVG Definitions Component for Svelte
  Generates all gradients, patterns, and filters
-->

<script lang="ts">
  import { 
    GRADIENT_DEFINITIONS, 
    PATTERN_DEFINITIONS, 
    FILTER_DEFINITIONS,
    type ThemeConfig 
  } from '../../../shared/types';

  export let instanceId: string;
  export let themeConfig: ThemeConfig | undefined = undefined;

  // Theme color mapping
  function getThemeColor(originalColor: string): string {
    if (!themeConfig?.colors) return originalColor;
    
    // Simple color mapping - in production, use a proper color manipulation library
    const colorMap: Record<string, string> = {
      '#D0E8F5': themeConfig.colors.primary || originalColor,
      '#5FD4C4': themeConfig.colors.secondary || originalColor,
      '#D5EDB8': themeConfig.colors.accent || originalColor,
    };
    
    return colorMap[originalColor] || originalColor;
  }
</script>

<defs>
  <!-- Gradients -->
  {#each GRADIENT_DEFINITIONS as gradient}
    {#if gradient.type === 'radial'}
      <radialGradient
        id="{gradient.id}-{instanceId}"
        cx={gradient.coordinates?.cx}
        cy={gradient.coordinates?.cy}
      >
        {#each gradient.stops as stop}
          <stop
            offset={stop.offset}
            stop-color={getThemeColor(stop.color)}
          />
        {/each}
      </radialGradient>
    {:else}
      <linearGradient
        id="{gradient.id}-{instanceId}"
        x1={gradient.coordinates?.x1}
        y1={gradient.coordinates?.y1}
        x2={gradient.coordinates?.x2}
        y2={gradient.coordinates?.y2}
      >
        {#each gradient.stops as stop}
          <stop
            offset={stop.offset}
            stop-color={getThemeColor(stop.color)}
          />
        {/each}
      </linearGradient>
    {/if}
  {/each}

  <!-- Patterns -->
  {#each PATTERN_DEFINITIONS as pattern}
    <pattern
      id="{pattern.id}-{instanceId}"
      width={pattern.width}
      height={pattern.height}
      patternUnits="userSpaceOnUse"
    >
      <path
        d={pattern.path}
        stroke={pattern.stroke}
        stroke-width={pattern.strokeWidth}
        opacity={pattern.opacity}
        fill="none"
      />
    </pattern>
  {/each}

  <!-- Filters -->
  {#each FILTER_DEFINITIONS as filter}
    <filter id="{filter.id}-{instanceId}">
      {#each filter.effects as effect}
        {#if effect.type === 'blur'}
          <feGaussianBlur
            in={effect.properties.in}
            stdDeviation={effect.properties.stdDeviation}
          />
        {:else if effect.type === 'offset'}
          <feOffset dy={effect.properties.dy} />
        {:else if effect.type === 'alpha'}
          <feComponentTransfer>
            <feFuncA
              type={effect.properties.type}
              slope={effect.properties.slope}
            />
          </feComponentTransfer>
        {:else if effect.type === 'merge'}
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        {/if}
      {/each}
    </filter>
  {/each}

  <!-- Custom theme gradients -->
  {#if themeConfig?.gradients}
    {#each Object.entries(themeConfig.gradients) as [key, value]}
      <linearGradient id="custom-{key}-{instanceId}">
        <stop offset="0%" stop-color={value} />
        <stop offset="100%" stop-color={value} />
      </linearGradient>
    {/each}
  {/if}

  <!-- High contrast filter -->
  {#if themeConfig?.highContrast}
    <filter id="high-contrast-{instanceId}">
      <feComponentTransfer>
        <feFuncA type="discrete" tableValues="0 .5 1" />
      </feComponentTransfer>
    </filter>
  {/if}
</defs>