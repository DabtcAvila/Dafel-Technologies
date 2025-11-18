/**
 * Dafel Banda Optimized React Component
 * High-performance component with virtualization and lazy loading
 */

import React, { 
  useMemo, 
  forwardRef, 
  useCallback, 
  useState, 
  useEffect,
  useRef,
  Suspense,
  lazy
} from 'react';
import clsx from 'clsx';
import { 
  DafelBandaProps, 
  LAYER_DEFINITIONS, 
  shouldReduceMotion,
  getResponsiveSize 
} from '../../shared/types';

// Lazy load heavy components
const SVGDefinitions = lazy(() => import('./components/SVGDefinitions'));
const BandLayer = lazy(() => import('./components/BandLayer'));

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (renderTime > 16) { // More than one frame
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  });
};

// Debounced resize hook
const useDebounceResize = (callback: () => void, delay: number = 250) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(callback, delay);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutRef.current);
    };
  }, [callback, delay]);
};

export interface DafelBandaOptimizedProps extends DafelBandaProps {
  /** Enable virtual scrolling for layers */
  virtualScrolling?: boolean;
  
  /** Preload component assets */
  preload?: boolean;
  
  /** Enable performance monitoring */
  monitoring?: boolean;
  
  /** Custom intersection observer options */
  intersectionOptions?: IntersectionObserverInit;
}

export const DafelBandaOptimized = forwardRef<SVGSVGElement, DafelBandaOptimizedProps>((
  {
    animation = 'fadeIn',
    width = 1280,
    height = 720,
    interactive = false,
    className = '',
    ariaLabel = 'Dafel Banda optimized decorative element',
    reducedMotion = false,
    lazy = true,
    performance = 'high',
    virtualScrolling = false,
    preload = false,
    monitoring = false,
    intersectionOptions = { threshold: 0.1, rootMargin: '50px' },
    responsiveConfig,
    accessibilityConfig,
    themeConfig,
    performanceConfig,
    onHover,
    onClick,
    onFocus,
    onLoad,
    onError,
    ...props
  },
  ref
) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [isLoaded, setIsLoaded] = useState(!lazy);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  
  // Performance monitoring
  if (monitoring) {
    usePerformanceMonitor('DafelBandaOptimized');
  }

  // Intersection observer for lazy loading
  const isVisible = useIntersectionObserver(containerRef, intersectionOptions);
  
  useEffect(() => {
    if (isVisible && lazy) {
      setIsLoaded(true);
    }
  }, [isVisible, lazy]);

  // Responsive size calculation
  const responsiveSize = useMemo(() => {
    if (!responsiveConfig) return { width, height };
    return getResponsiveSize(responsiveConfig, currentBreakpoint as any, width, height);
  }, [responsiveConfig, currentBreakpoint, width, height]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    const newBreakpoint = window.innerWidth >= 1536 ? '2xl' :
                         window.innerWidth >= 1280 ? 'xl' :
                         window.innerWidth >= 1024 ? 'lg' :
                         window.innerWidth >= 768 ? 'md' :
                         window.innerWidth >= 640 ? 'sm' : 'xs';
    setCurrentBreakpoint(newBreakpoint);
  }, []);

  useDebounceResize(handleResize);

  // Check if motion should be reduced
  const motionReduced = shouldReduceMotion({ reducedMotion, accessibilityConfig });
  const finalAnimation = motionReduced ? 'none' : animation;

  // Layer virtualization
  const visibleLayers = useMemo(() => {
    if (!virtualScrolling) return LAYER_DEFINITIONS;
    
    // Simple virtualization - only render visible layers
    // In production, implement proper virtual scrolling
    return LAYER_DEFINITIONS.filter((_, index) => index < 5); // Show first 5 layers
  }, [virtualScrolling]);

  // Generate unique IDs
  const instanceId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Preload assets
  useEffect(() => {
    if (preload) {
      // Preload component chunks
      import('./components/SVGDefinitions');
      import('./components/BandLayer');
    }
  }, [preload]);

  // Performance-based rendering optimizations
  const renderingProps = useMemo(() => {
    const base = {
      shapeRendering: 'auto' as const,
      colorRendering: 'auto' as const,
      textRendering: 'auto' as const,
    };

    switch (performance) {
      case 'low':
        return {
          ...base,
          shapeRendering: 'optimizeSpeed' as const,
          colorRendering: 'optimizeSpeed' as const,
        };
      case 'high':
        return {
          ...base,
          shapeRendering: 'geometricPrecision' as const,
          colorRendering: 'optimizeQuality' as const,
        };
      default:
        return base;
    }
  }, [performance]);

  // Event handlers with debouncing
  const debouncedEvents = useMemo(() => {
    const debounceTime = performanceConfig?.debounce || 100;
    let timeouts: Record<string, NodeJS.Timeout> = {};

    const createDebouncedHandler = (handler?: (event: Event) => void, key: string) => {
      if (!handler) return undefined;
      
      return (event: Event) => {
        clearTimeout(timeouts[key]);
        timeouts[key] = setTimeout(() => handler(event), debounceTime);
      };
    };

    return {
      onHover: createDebouncedHandler(onHover, 'hover'),
      onClick: createDebouncedHandler(onClick, 'click'),
      onFocus: createDebouncedHandler(onFocus, 'focus'),
    };
  }, [onHover, onClick, onFocus, performanceConfig?.debounce]);

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <rect 
      width={responsiveSize.width} 
      height={responsiveSize.height} 
      fill="#f0f0f0"
      opacity={0.3}
    />
  );

  // Error boundary for individual layers
  const SafeBandLayer = ({ layer, index }: { layer: any, index: number }) => {
    try {
      return (
        <Suspense fallback={<LoadingPlaceholder />}>
          <BandLayer
            layer={layer}
            index={index}
            instanceId={instanceId}
            animation={finalAnimation}
            interactive={interactive}
            performance={performance}
            onError={onError || (() => {})}
          />
        </Suspense>
      );
    } catch (error) {
      console.error('Layer render error:', error);
      onError?.(error as Error);
      return <LoadingPlaceholder />;
    }
  };

  return (
    <svg
      ref={(element) => {
        containerRef.current = element;
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
      }}
      width={responsiveSize.width}
      height={responsiveSize.height}
      viewBox={`0 0 ${responsiveSize.width} ${responsiveSize.height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        'dafel-banda',
        'dafel-banda--optimized',
        {
          'dafel-banda--interactive': interactive,
          'dafel-banda--reduced-motion': motionReduced,
          'dafel-banda--virtual': virtualScrolling,
          'dafel-banda--loading': !isLoaded,
          [`dafel-banda--${performance}`]: performance !== 'medium',
          [`dafel-banda--${finalAnimation}`]: finalAnimation !== 'none',
        },
        className
      )}
      style={{
        overflow: 'hidden',
        contain: 'layout style paint',
        ...(performanceConfig?.gpu && {
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
        }),
        ...renderingProps,
      }}
      aria-label={ariaLabel}
      role={accessibilityConfig?.role || 'img'}
      tabIndex={interactive && accessibilityConfig?.focusable ? accessibilityConfig.tabIndex || 0 : undefined}
      onMouseEnter={interactive ? debouncedEvents.onHover : undefined}
      onClick={interactive ? debouncedEvents.onClick : undefined}
      onFocus={interactive ? debouncedEvents.onFocus : undefined}
      onLoad={() => {
        setIsLoaded(true);
        onLoad?.();
      }}
      {...props}
    >
      {/* SVG Definitions */}
      {isLoaded && (
        <Suspense fallback={null}>
          <SVGDefinitions 
            instanceId={instanceId}
            themeConfig={themeConfig}
          />
        </Suspense>
      )}

      {/* Background */}
      <rect 
        width={responsiveSize.width} 
        height={responsiveSize.height} 
        fill={themeConfig?.colors?.background || '#F8FBFD'} 
      />

      {/* Optimized Layers */}
      {isLoaded ? (
        visibleLayers.map((layer, index) => (
          <SafeBandLayer
            key={layer.id}
            layer={layer}
            index={index}
          />
        ))
      ) : (
        <LoadingPlaceholder />
      )}

      {/* Performance metrics overlay (development only) */}
      {monitoring && process.env.NODE_ENV === 'development' && (
        <text x="10" y="20" fontSize="12" fill="#666">
          Layers: {visibleLayers.length} | Performance: {performance}
        </text>
      )}
    </svg>
  );
});

DafelBandaOptimized.displayName = 'DafelBandaOptimized';

export default DafelBandaOptimized;