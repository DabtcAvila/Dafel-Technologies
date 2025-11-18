/**
 * Dafel Banda Angular Component Library
 * Public API exports
 */

// Components
export * from './lib/dafel-banda.component';
export * from './lib/dafel-banda-animated.component';
export * from './lib/dafel-banda-optimized.component';
export * from './lib/dafel-banda-accessible.component';

// Services
export * from './lib/services/banda-animation.service';
export * from './lib/services/banda-performance.service';
export * from './lib/services/banda-accessibility.service';

// Directives
export * from './lib/directives/banda-responsive.directive';
export * from './lib/directives/banda-intersection.directive';

// Pipes
export * from './lib/pipes/banda-theme.pipe';
export * from './lib/pipes/banda-filter.pipe';

// Module (for non-standalone usage)
export * from './lib/dafel-banda.module';

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

// Tokens
export * from './lib/tokens/banda.tokens';

// Version
export const VERSION = '1.0.0';