/**
 * Dafel Banda React Component Library
 * Export all components and utilities
 */

// Main components
export { default as DafelBanda } from './DafelBanda';
export { default as DafelBandaAnimated } from './DafelBandaAnimated';
export { default as DafelBandaOptimized } from './DafelBandaOptimized';
export { default as DafelBandaAccessible } from './DafelBandaAccessible';

// Component pieces
export { default as SVGDefinitions } from './components/SVGDefinitions';
export { default as BandLayer } from './components/BandLayer';

// Hooks
export { useResponsiveBanda } from './hooks/useResponsiveBanda';
export { useAnimationControl } from './hooks/useAnimationControl';
export { useBandaPerformance } from './hooks/useBandaPerformance';

// Utilities
export { createBandaTheme } from './utils/createBandaTheme';
export { validateBandaProps } from './utils/validateBandaProps';
export { getBandaMetrics } from './utils/getBandaMetrics';

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
} from '../../shared/types';

// Constants
export {
  LAYER_DEFINITIONS,
  GRADIENT_DEFINITIONS,
  PATTERN_DEFINITIONS,
  FILTER_DEFINITIONS,
  DEFAULT_CONFIG
} from '../../shared/types';

// Version
export const VERSION = '1.0.0';

// Default export - choose based on use case
export { default } from './DafelBandaAnimated';