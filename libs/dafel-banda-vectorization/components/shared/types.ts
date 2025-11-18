/**
 * Shared TypeScript types and interfaces for Dafel Banda components
 * Used across all framework implementations
 */

export type AnimationType = 
  | 'fadeIn' 
  | 'wave' 
  | 'pulse' 
  | 'scroll' 
  | 'morphing' 
  | 'interactive' 
  | 'none';

export type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface DafelBandaConfig {
  /** Animation type to apply */
  animation: AnimationType;
  
  /** Component dimensions */
  width?: number;
  height?: number;
  
  /** Enable interactive features (hover, click) */
  interactive?: boolean;
  
  /** Custom CSS class */
  className?: string;
  
  /** Accessibility label */
  ariaLabel?: string;
  
  /** Reduce motion for accessibility */
  reducedMotion?: boolean;
  
  /** Lazy loading configuration */
  lazy?: boolean;
  
  /** Performance optimization level */
  performance?: 'low' | 'medium' | 'high';
}

export interface BandLayer {
  id: number;
  name: string;
  opacity: number;
  gradient: string;
  path: string;
  hasGrid: boolean;
  gridPattern?: string;
  hasFilter?: boolean;
  filter?: string;
}

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  repeat?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate';
}

export interface InteractiveConfig {
  hover?: boolean;
  click?: boolean;
  focus?: boolean;
  touch?: boolean;
}

export interface PerformanceConfig {
  /** Enable GPU acceleration */
  gpu?: boolean;
  
  /** Use will-change CSS property */
  willChange?: boolean;
  
  /** Debounce interaction events */
  debounce?: number;
  
  /** Use requestAnimationFrame for smooth animations */
  raf?: boolean;
}

export interface AccessibilityConfig {
  /** Respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  
  /** ARIA attributes */
  ariaLabel?: string;
  role?: string;
  
  /** Keyboard navigation */
  focusable?: boolean;
  tabIndex?: number;
  
  /** Screen reader announcements */
  announcements?: boolean;
}

export interface ThemeConfig {
  /** Custom color palette */
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  
  /** Custom gradients */
  gradients?: Record<string, string>;
  
  /** Dark mode support */
  darkMode?: boolean;
  
  /** High contrast mode */
  highContrast?: boolean;
}

export interface ResponsiveConfig {
  breakpoints?: Partial<Record<ResponsiveBreakpoint, {
    width?: number;
    height?: number;
    animation?: AnimationType;
    performance?: 'low' | 'medium' | 'high';
  }>>;
}

export interface DafelBandaProps extends DafelBandaConfig {
  /** Animation configuration */
  animationConfig?: AnimationConfig;
  
  /** Interactive features */
  interactiveConfig?: InteractiveConfig;
  
  /** Performance optimizations */
  performanceConfig?: PerformanceConfig;
  
  /** Accessibility options */
  accessibilityConfig?: AccessibilityConfig;
  
  /** Theme customization */
  themeConfig?: ThemeConfig;
  
  /** Responsive behavior */
  responsiveConfig?: ResponsiveConfig;
  
  /** Event handlers */
  onHover?: (event: Event) => void;
  onClick?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface GradientDefinition {
  id: string;
  type: 'linear' | 'radial';
  stops: Array<{
    offset: string;
    color: string;
  }>;
  coordinates?: {
    x1?: string;
    y1?: string;
    x2?: string;
    y2?: string;
    cx?: string;
    cy?: string;
    r?: string;
  };
}

export interface PatternDefinition {
  id: string;
  width: number;
  height: number;
  path: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export interface FilterDefinition {
  id: string;
  effects: Array<{
    type: 'blur' | 'offset' | 'alpha' | 'merge';
    properties: Record<string, string | number>;
  }>;
}

export const LAYER_DEFINITIONS: BandLayer[] = [
  {
    id: 1,
    name: 'blue-light-back',
    opacity: 0.45,
    gradient: 'grad-blue-light-radial',
    path: 'M60 280Q200 240 340 220T600 240T860 300T1120 380Q1160 400 1200 420V600Q1160 580 1120 560T860 480T600 420T340 400Q200 420 60 460Z',
    hasGrid: false
  },
  {
    id: 2,
    name: 'blue-light-top',
    opacity: 0.55,
    gradient: 'grad-blue-light-linear',
    path: 'M80 240Q220 210 360 200T620 220T880 280Q950 305 1020 330V450Q950 425 880 400T620 340T360 320Q220 330 80 360Z',
    hasGrid: false
  },
  {
    id: 3,
    name: 'green-lime',
    opacity: 0.38,
    gradient: 'grad-green-lime',
    path: 'M140 260Q280 240 420 230T680 260T940 330Q980 355 1020 380V520Q980 495 940 470T680 400T420 370Q280 380 140 400Z',
    hasGrid: false
  },
  {
    id: 4,
    name: 'teal-grid',
    opacity: 0.65,
    gradient: 'grad-teal',
    path: 'M180 320Q320 300 460 290T720 320T980 390Q1050 425 1120 460V560Q1050 525 980 490T720 420T460 390Q320 400 180 420Z',
    hasGrid: true,
    gridPattern: 'pattern-grid-teal'
  },
  {
    id: 5,
    name: 'blue-medium-grid',
    opacity: 0.70,
    gradient: 'grad-blue-medium',
    path: 'M220 380Q360 360 500 350T760 380T1020 450Q1090 485 1160 520V605Q1090 570 1020 535T760 465T500 435Q360 445 220 465Z',
    hasGrid: true,
    gridPattern: 'pattern-grid-blue-medium'
  },
  {
    id: 6,
    name: 'blue-dark-grid',
    opacity: 0.75,
    gradient: 'grad-blue-dark',
    path: 'M260 440Q400 420 540 410T800 440T1060 510Q1130 545 1200 580V655Q1130 620 1060 585T800 515T540 485Q400 495 260 515Z',
    hasGrid: true,
    gridPattern: 'pattern-grid-blue-dark',
    hasFilter: true,
    filter: 'filter-shadow-subtle'
  },
  {
    id: 7,
    name: 'blue-deepest-front',
    opacity: 0.82,
    gradient: 'grad-blue-deepest',
    path: 'M300 500Q440 480 580 470T840 500T1100 570Q1170 605 1240 640V705Q1170 670 1100 635T840 565T580 535Q440 545 300 565Z',
    hasGrid: false,
    hasFilter: true,
    filter: 'filter-shadow-subtle'
  }
];

export const GRADIENT_DEFINITIONS: GradientDefinition[] = [
  {
    id: 'grad-blue-light-radial',
    type: 'radial',
    coordinates: { cx: '30%', cy: '40%' },
    stops: [
      { offset: '0%', color: '#D0E8F5' },
      { offset: '50%', color: '#A8D1E6' },
      { offset: '100%', color: '#7DBBDB' }
    ]
  },
  {
    id: 'grad-blue-light-linear',
    type: 'linear',
    coordinates: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    stops: [
      { offset: '0%', color: '#C0DFF0' },
      { offset: '100%', color: '#6FB3D9' }
    ]
  },
  {
    id: 'grad-green-lime',
    type: 'radial',
    coordinates: { cx: '35%', cy: '45%' },
    stops: [
      { offset: '0%', color: '#D5EDB8' },
      { offset: '50%', color: '#AAD989' },
      { offset: '100%', color: '#7BC77F' }
    ]
  },
  {
    id: 'grad-teal',
    type: 'linear',
    coordinates: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    stops: [
      { offset: '0%', color: '#5FD4C4' },
      { offset: '50%', color: '#3AAFA3' },
      { offset: '100%', color: '#1B8F9A' }
    ]
  },
  {
    id: 'grad-blue-medium',
    type: 'linear',
    coordinates: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    stops: [
      { offset: '0%', color: '#5AAED0' },
      { offset: '50%', color: '#3493B8' },
      { offset: '100%', color: '#1E7FA4' }
    ]
  },
  {
    id: 'grad-blue-dark',
    type: 'linear',
    coordinates: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    stops: [
      { offset: '0%', color: '#2B88AA' },
      { offset: '50%', color: '#1A6983' },
      { offset: '100%', color: '#0E5F7E' }
    ]
  },
  {
    id: 'grad-blue-deepest',
    type: 'linear',
    coordinates: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    stops: [
      { offset: '0%', color: '#1B7696' },
      { offset: '50%', color: '#115A75' },
      { offset: '100%', color: '#094A62' }
    ]
  }
];

export const PATTERN_DEFINITIONS: PatternDefinition[] = [
  {
    id: 'pattern-grid-teal',
    width: 18,
    height: 18,
    path: 'M0 0v18M0 0h18',
    stroke: '#fff',
    strokeWidth: 1.5,
    opacity: 0.25
  },
  {
    id: 'pattern-grid-blue-medium',
    width: 16,
    height: 16,
    path: 'M0 0v16M0 0h16',
    stroke: '#fff',
    strokeWidth: 1.8,
    opacity: 0.3
  },
  {
    id: 'pattern-grid-blue-dark',
    width: 14,
    height: 14,
    path: 'M0 0v14M0 0h14',
    stroke: '#fff',
    strokeWidth: 2,
    opacity: 0.32
  }
];

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    id: 'filter-shadow-subtle',
    effects: [
      {
        type: 'blur',
        properties: { in: 'SourceAlpha', stdDeviation: '2' }
      },
      {
        type: 'offset',
        properties: { dy: '2' }
      },
      {
        type: 'alpha',
        properties: { type: 'linear', slope: '0.15' }
      },
      {
        type: 'merge',
        properties: {}
      }
    ]
  }
];

// Default configuration
export const DEFAULT_CONFIG: Required<DafelBandaConfig> = {
  animation: 'fadeIn',
  width: 1280,
  height: 720,
  interactive: false,
  className: '',
  ariaLabel: 'Dafel Banda decorative element',
  reducedMotion: false,
  lazy: true,
  performance: 'medium'
};

// Utility functions
export const getLayerDelay = (index: number): number => index * 0.15;

export const getResponsiveSize = (
  config: ResponsiveConfig,
  breakpoint: ResponsiveBreakpoint,
  defaultWidth: number,
  defaultHeight: number
): { width: number; height: number } => {
  const responsive = config.breakpoints?.[breakpoint];
  return {
    width: responsive?.width ?? defaultWidth,
    height: responsive?.height ?? defaultHeight
  };
};

export const shouldReduceMotion = (
  config: DafelBandaProps
): boolean => {
  if (config.reducedMotion) return true;
  if (config.accessibilityConfig?.respectReducedMotion && 
      typeof window !== 'undefined' && 
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  return false;
};