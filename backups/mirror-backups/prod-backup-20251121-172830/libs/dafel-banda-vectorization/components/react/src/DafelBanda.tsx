/**
 * Dafel Banda React Component - Basic Implementation
 * Production-ready SVG component with TypeScript support
 */

import React, { useMemo, forwardRef } from 'react';
import clsx from 'clsx';
import { DafelBandaProps, LAYER_DEFINITIONS, shouldReduceMotion } from '../../shared/types';
import { SVGDefinitions } from './components/SVGDefinitions';
import { BandLayer } from './components/BandLayer';

export interface DafelBandaBasicProps extends Omit<DafelBandaProps, 'animation'> {
  /** Animation type - basic component supports limited animations */
  animation?: 'none' | 'fadeIn';
}

export const DafelBanda = forwardRef<SVGSVGElement, DafelBandaBasicProps>((
  {
    animation = 'fadeIn',
    width = 1280,
    height = 720,
    interactive = false,
    className = '',
    ariaLabel = 'Dafel Banda decorative element',
    reducedMotion = false,
    lazy = true,
    performance = 'medium',
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
  // Check if motion should be reduced
  const motionReduced = shouldReduceMotion({ reducedMotion, accessibilityConfig });
  const finalAnimation = motionReduced ? 'none' : animation;

  // Performance optimizations
  const layerData = useMemo(() => LAYER_DEFINITIONS, []);
  
  // Calculate responsive viewBox
  const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);

  // Generate unique IDs to avoid conflicts
  const instanceId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Apply theme customizations
  const customStyles = useMemo(() => {
    if (!themeConfig) return {};
    
    return {
      filter: themeConfig.darkMode ? 'invert(1) hue-rotate(180deg)' : undefined,
      opacity: themeConfig.highContrast ? 0.9 : undefined,
    };
  }, [themeConfig]);

  // Event handlers
  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = (error: Error) => {
    console.error('DafelBanda component error:', error);
    onError?.(error);
  };

  const handleInteraction = (event: React.MouseEvent | React.FocusEvent) => {
    if (!interactive) return;
    
    switch (event.type) {
      case 'mouseenter':
      case 'mouseover':
        onHover?.(event.nativeEvent);
        break;
      case 'click':
        onClick?.(event.nativeEvent);
        break;
      case 'focus':
        onFocus?.(event.nativeEvent);
        break;
    }
  };

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        'dafel-banda',
        'dafel-banda--basic',
        {
          'dafel-banda--interactive': interactive,
          'dafel-banda--reduced-motion': motionReduced,
          [`dafel-banda--${performance}`]: performance !== 'medium',
        },
        className
      )}
      style={{
        overflow: 'hidden',
        ...customStyles,
        ...(performance === 'high' && {
          willChange: 'transform, opacity',
          transform: 'translateZ(0)', // Force GPU acceleration
        }),
      }}
      aria-label={ariaLabel}
      role={accessibilityConfig?.role || 'img'}
      tabIndex={interactive && accessibilityConfig?.focusable ? accessibilityConfig.tabIndex || 0 : undefined}
      onMouseEnter={interactive ? handleInteraction : undefined}
      onClick={interactive ? handleInteraction : undefined}
      onFocus={interactive ? handleInteraction : undefined}
      onLoad={handleLoad}
      onError={() => handleError(new Error('SVG load error'))}
      {...props}
    >
      {/* SVG Definitions */}
      <SVGDefinitions 
        instanceId={instanceId}
        themeConfig={themeConfig}
      />

      {/* Background */}
      <rect 
        width={width} 
        height={height} 
        fill={themeConfig?.colors?.background || '#F8FBFD'} 
      />

      {/* Band Layers */}
      {layerData.map((layer, index) => (
        <BandLayer
          key={layer.id}
          layer={layer}
          index={index}
          instanceId={instanceId}
          animation={finalAnimation}
          interactive={interactive}
          performance={performance}
          onError={handleError}
        />
      ))}
    </svg>
  );
});

DafelBanda.displayName = 'DafelBanda';

export default DafelBanda;