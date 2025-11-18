/**
 * Dafel Banda Vue 3 Component Library
 * Export all components and composables
 */

// Main components
export { default as DafelBanda } from './DafelBanda.vue'
export { default as DafelBandaAnimated } from './DafelBandaAnimated.vue'
export { default as DafelBandaOptimized } from './DafelBandaOptimized.vue'
export { default as DafelBandaAccessible } from './DafelBandaAccessible.vue'

// Component pieces
export { default as SVGDefinitions } from './components/SVGDefinitions.vue'
export { default as BandLayer } from './components/BandLayer.vue'

// Composables
export { useResponsiveBanda } from './composables/useResponsiveBanda'
export { useAnimationControl } from './composables/useAnimationControl'
export { useBandaPerformance } from './composables/useBandaPerformance'
export { useBandaAccessibility } from './composables/useBandaAccessibility'

// Utilities
export { createBandaTheme } from './utils/createBandaTheme'
export { validateBandaProps } from './utils/validateBandaProps'
export { getBandaMetrics } from './utils/getBandaMetrics'

// Plugin for global registration
export { default as DafelBandaPlugin } from './plugin'

// Types (re-exported from shared)
export type {
  DafelBandaProps,
  AnimationType,
  BandLayer,
  AnimationConfig,
  InteractiveConfig,
  PerformanceConfig,
  AccessibilityConfig,
  ThemeConfig,
  ResponsiveConfig,
  GradientDefinition,
  PatternDefinition,
  FilterDefinition
} from '../../shared/types'

// Constants
export {
  LAYER_DEFINITIONS,
  GRADIENT_DEFINITIONS,
  PATTERN_DEFINITIONS,
  FILTER_DEFINITIONS,
  DEFAULT_CONFIG
} from '../../shared/types'

// Version
export const VERSION = '1.0.0'

// Default export - animated version
export { default } from './DafelBandaAnimated.vue'