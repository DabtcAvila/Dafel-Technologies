/**
 * Dafel Banda Accessible React Component
 * WCAG 2.1 AA compliant component with full accessibility features
 */

import React, { 
  useMemo, 
  forwardRef, 
  useCallback, 
  useState, 
  useEffect,
  useRef,
  useId
} from 'react';
import clsx from 'clsx';
import { 
  DafelBandaProps, 
  LAYER_DEFINITIONS, 
  shouldReduceMotion 
} from '../../shared/types';
import { SVGDefinitions } from './components/SVGDefinitions';
import { BandLayer } from './components/BandLayer';

// Accessibility announcement hook
const useAnnouncement = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announce = useCallback((text: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = text;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [priority]);

  useEffect(() => {
    if (message) announce(message);
  }, [message, announce]);
};

// Focus management hook
const useFocusManagement = (
  containerRef: React.RefObject<SVGSVGElement>,
  interactive: boolean
) => {
  const [focusedLayerIndex, setFocusedLayerIndex] = useState<number>(-1);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!interactive || !containerRef.current) return;

    const layerCount = LAYER_DEFINITIONS.length;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        setFocusedLayerIndex(prev => 
          prev < layerCount - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        setFocusedLayerIndex(prev => 
          prev > 0 ? prev - 1 : layerCount - 1
        );
        break;
      
      case 'Home':
        event.preventDefault();
        setFocusedLayerIndex(0);
        break;
      
      case 'End':
        event.preventDefault();
        setFocusedLayerIndex(layerCount - 1);
        break;
      
      case 'Escape':
        event.preventDefault();
        setFocusedLayerIndex(-1);
        containerRef.current?.blur();
        break;
    }
  }, [interactive, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !interactive) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, interactive, containerRef]);

  return { focusedLayerIndex, setFocusedLayerIndex };
};

// Color contrast utilities
const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast calculation - use a proper library in production
  const getLuminance = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export interface DafelBandaAccessibleProps extends DafelBandaProps {
  /** Detailed description for screen readers */
  description?: string;
  
  /** Live region updates */
  liveRegion?: 'polite' | 'assertive' | 'off';
  
  /** High contrast mode override */
  forceHighContrast?: boolean;
  
  /** Alternative text for layers */
  layerAltTexts?: string[];
  
  /** Keyboard navigation instructions */
  keyboardInstructions?: string;
}

export const DafelBandaAccessible = forwardRef<SVGSVGElement, DafelBandaAccessibleProps>((
  {
    animation = 'fadeIn',
    width = 1280,
    height = 720,
    interactive = false,
    className = '',
    ariaLabel = 'Dafel Banda decorative wave pattern',
    description = 'A series of flowing wave-like bands in blue and teal colors, representing data flow or design elements',
    reducedMotion = false,
    lazy = true,
    performance = 'medium',
    liveRegion = 'polite',
    forceHighContrast = false,
    layerAltTexts = [],
    keyboardInstructions = 'Use arrow keys to navigate layers, Home/End to jump to first/last, Escape to exit',
    accessibilityConfig,
    themeConfig,
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
  const [announcement, setAnnouncement] = useState<string>('');
  const [isInteracting, setIsInteracting] = useState(false);
  const uniqueId = useId();
  const descriptionId = `${uniqueId}-description`;
  const instructionsId = `${uniqueId}-instructions`;

  // Accessibility announcements
  useAnnouncement(announcement, liveRegion === 'off' ? 'polite' : liveRegion);

  // Focus management
  const { focusedLayerIndex, setFocusedLayerIndex } = useFocusManagement(
    containerRef, 
    interactive
  );

  // Check if motion should be reduced
  const motionReduced = shouldReduceMotion({ reducedMotion, accessibilityConfig });
  const finalAnimation = motionReduced ? 'none' : animation;

  // High contrast detection
  const [highContrastMode, setHighContrastMode] = useState(forceHighContrast);

  useEffect(() => {
    if (forceHighContrast) {
      setHighContrastMode(true);
      return;
    }

    // Detect high contrast mode
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrastMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setHighContrastMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [forceHighContrast]);

  // Layer data with accessibility enhancements
  const accessibleLayers = useMemo(() => 
    LAYER_DEFINITIONS.map((layer, index) => ({
      ...layer,
      altText: layerAltTexts[index] || `Layer ${index + 1}: ${layer.name.replace(/-/g, ' ')}`,
      isFocused: focusedLayerIndex === index,
      tabIndex: interactive ? (focusedLayerIndex === index ? 0 : -1) : undefined
    })), 
    [layerAltTexts, focusedLayerIndex, interactive]
  );

  // Generate unique IDs
  const instanceId = useMemo(() => `${uniqueId}-${Math.random().toString(36).substr(2, 9)}`, [uniqueId]);

  // Enhanced theme configuration for accessibility
  const accessibleTheme = useMemo(() => ({
    ...themeConfig,
    highContrast: highContrastMode || themeConfig?.highContrast,
    colors: {
      ...themeConfig?.colors,
      ...(highContrastMode && {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#ffffff'
      })
    }
  }), [themeConfig, highContrastMode]);

  // Event handlers with accessibility enhancements
  const handleLayerFocus = useCallback((layerIndex: number, layer: any) => {
    setFocusedLayerIndex(layerIndex);
    setIsInteracting(true);
    
    if (liveRegion !== 'off') {
      setAnnouncement(`Focused on ${layer.altText}`);
    }
    
    onFocus?.(new CustomEvent('focus', { detail: { layerIndex, layer } }) as any);
  }, [setFocusedLayerIndex, liveRegion, onFocus]);

  const handleLayerClick = useCallback((layerIndex: number, layer: any, event: React.MouseEvent) => {
    if (!interactive) return;
    
    setFocusedLayerIndex(layerIndex);
    
    if (liveRegion !== 'off') {
      setAnnouncement(`Activated ${layer.altText}`);
    }
    
    onClick?.(event.nativeEvent);
  }, [interactive, setFocusedLayerIndex, liveRegion, onClick]);

  const handleLayerHover = useCallback((layerIndex: number, layer: any, event: React.MouseEvent) => {
    if (!interactive) return;
    
    if (liveRegion === 'assertive') {
      setAnnouncement(`Hovering over ${layer.altText}`);
    }
    
    onHover?.(event.nativeEvent);
  }, [interactive, liveRegion, onHover]);

  const handleContainerFocus = useCallback(() => {
    setIsInteracting(true);
    if (interactive && liveRegion !== 'off') {
      setAnnouncement('Dafel Banda component focused. Use arrow keys to explore layers.');
    }
  }, [interactive, liveRegion]);

  const handleContainerBlur = useCallback(() => {
    setIsInteracting(false);
    setFocusedLayerIndex(-1);
  }, [setFocusedLayerIndex]);

  return (
    <>
      {/* Hidden description for screen readers */}
      <div id={descriptionId} className="sr-only">
        {description}
      </div>
      
      {/* Hidden keyboard instructions */}
      {interactive && (
        <div id={instructionsId} className="sr-only">
          {keyboardInstructions}
        </div>
      )}

      <svg
        ref={(element) => {
          containerRef.current = element;
          if (typeof ref === 'function') ref(element);
          else if (ref) ref.current = element;
        }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(
          'dafel-banda',
          'dafel-banda--accessible',
          {
            'dafel-banda--interactive': interactive,
            'dafel-banda--reduced-motion': motionReduced,
            'dafel-banda--high-contrast': highContrastMode,
            'dafel-banda--interacting': isInteracting,
            [`dafel-banda--${performance}`]: performance !== 'medium',
            [`dafel-banda--${finalAnimation}`]: finalAnimation !== 'none',
          },
          className
        )}
        style={{
          overflow: 'hidden',
          outline: isInteracting ? '2px solid #005fcc' : 'none',
          outlineOffset: '2px',
        }}
        role={interactive ? 'application' : 'img'}
        aria-label={ariaLabel}
        aria-describedby={`${descriptionId}${interactive ? ` ${instructionsId}` : ''}`}
        aria-live={liveRegion}
        tabIndex={interactive ? 0 : undefined}
        onFocus={handleContainerFocus}
        onBlur={handleContainerBlur}
        onLoad={() => {
          if (liveRegion !== 'off') {
            setAnnouncement('Dafel Banda component loaded');
          }
          onLoad?.();
        }}
        {...props}
      >
        {/* SVG Definitions */}
        <SVGDefinitions 
          instanceId={instanceId}
          themeConfig={accessibleTheme}
        />

        {/* Background */}
        <rect 
          width={width} 
          height={height} 
          fill={accessibleTheme?.colors?.background || '#F8FBFD'} 
        />

        {/* Title for screen readers */}
        <title>{ariaLabel}</title>
        <desc>{description}</desc>

        {/* Accessible Layers */}
        {accessibleLayers.map((layer, index) => (
          <g
            key={layer.id}
            role={interactive ? 'button' : undefined}
            aria-label={layer.altText}
            aria-describedby={interactive ? `layer-${layer.id}-desc-${instanceId}` : undefined}
            tabIndex={layer.tabIndex}
            className={clsx('band-layer-accessible', {
              'band-layer--focused': layer.isFocused,
              'band-layer--interactive': interactive,
            })}
            onFocus={() => interactive && handleLayerFocus(index, layer)}
            onClick={interactive ? (e) => handleLayerClick(index, layer, e) : undefined}
            onMouseEnter={interactive ? (e) => handleLayerHover(index, layer, e) : undefined}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              outline: layer.isFocused ? '2px solid #005fcc' : 'none',
              outlineOffset: '1px',
            }}
          >
            {/* Hidden description for each layer */}
            {interactive && (
              <desc id={`layer-${layer.id}-desc-${instanceId}`}>
                {layer.altText}. Press Enter or Space to interact.
              </desc>
            )}
            
            <BandLayer
              layer={layer}
              index={index}
              instanceId={instanceId}
              animation={finalAnimation}
              interactive={interactive}
              performance={performance}
              onError={onError || (() => {})}
            />
          </g>
        ))}

        {/* Focus indicator */}
        {isInteracting && focusedLayerIndex >= 0 && (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="none"
            stroke="#005fcc"
            strokeWidth="3"
            strokeDasharray="5,5"
            opacity="0.7"
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Screen reader only styles */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .dafel-banda--high-contrast {
          filter: contrast(2) brightness(1.2);
        }
        
        .dafel-banda--reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .dafel-banda * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
});

DafelBandaAccessible.displayName = 'DafelBandaAccessible';

export default DafelBandaAccessible;