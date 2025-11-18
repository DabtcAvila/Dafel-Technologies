<!--
  SVG Definitions Component for Vue
  Generates all gradients, patterns, and filters
-->

<template>
  <defs>
    <!-- Gradients -->
    <component
      v-for="gradient in gradientDefinitions"
      :key="gradient.id"
      :is="gradient.type === 'radial' ? 'radialGradient' : 'linearGradient'"
      :id="`${gradient.id}-${instanceId}`"
      v-bind="gradient.coordinates"
    >
      <stop
        v-for="(stop, index) in gradient.stops"
        :key="index"
        :offset="stop.offset"
        :stop-color="getThemeColor(stop.color)"
      />
    </component>

    <!-- Patterns -->
    <pattern
      v-for="pattern in patternDefinitions"
      :key="pattern.id"
      :id="`${pattern.id}-${instanceId}`"
      :width="pattern.width"
      :height="pattern.height"
      patternUnits="userSpaceOnUse"
    >
      <path
        :d="pattern.path"
        :stroke="pattern.stroke"
        :stroke-width="pattern.strokeWidth"
        :opacity="pattern.opacity"
        fill="none"
      />
    </pattern>

    <!-- Filters -->
    <filter
      v-for="filter in filterDefinitions"
      :key="filter.id"
      :id="`${filter.id}-${instanceId}`"
    >
      <template v-for="(effect, index) in filter.effects" :key="index">
        <feGaussianBlur
          v-if="effect.type === 'blur'"
          :in="effect.properties.in as string"
          :stdDeviation="effect.properties.stdDeviation as string"
        />
        <feOffset
          v-else-if="effect.type === 'offset'"
          :dy="effect.properties.dy as string"
        />
        <feComponentTransfer v-else-if="effect.type === 'alpha'">
          <feFuncA
            :type="effect.properties.type as string"
            :slope="effect.properties.slope as string"
          />
        </feComponentTransfer>
        <feMerge v-else-if="effect.type === 'merge'">
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </template>
    </filter>

    <!-- Custom theme gradients -->
    <linearGradient
      v-for="(value, key) in themeConfig?.gradients || {}"
      :key="`custom-${key}`"
      :id="`custom-${key}-${instanceId}`"
    >
      <stop offset="0%" :stop-color="value" />
      <stop offset="100%" :stop-color="value" />
    </linearGradient>

    <!-- High contrast filter -->
    <filter v-if="themeConfig?.highContrast" :id="`high-contrast-${instanceId}`">
      <feComponentTransfer>
        <feFuncA type="discrete" tableValues="0 .5 1" />
      </feComponentTransfer>
    </filter>
  </defs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  GRADIENT_DEFINITIONS, 
  PATTERN_DEFINITIONS, 
  FILTER_DEFINITIONS,
  ThemeConfig 
} from '../../../shared/types'

interface Props {
  instanceId: string
  themeConfig?: ThemeConfig
}

const props = defineProps<Props>()

// Computed properties
const gradientDefinitions = computed(() => GRADIENT_DEFINITIONS)
const patternDefinitions = computed(() => PATTERN_DEFINITIONS)
const filterDefinitions = computed(() => FILTER_DEFINITIONS)

// Theme color mapping
const getThemeColor = (originalColor: string): string => {
  if (!props.themeConfig?.colors) return originalColor
  
  // Simple color mapping - in production, use a proper color manipulation library
  const colorMap: Record<string, string> = {
    '#D0E8F5': props.themeConfig.colors.primary || originalColor,
    '#5FD4C4': props.themeConfig.colors.secondary || originalColor,
    '#D5EDB8': props.themeConfig.colors.accent || originalColor,
  }
  
  return colorMap[originalColor] || originalColor
}
</script>