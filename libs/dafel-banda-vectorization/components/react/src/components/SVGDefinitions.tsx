/**
 * SVG Definitions Component
 * Generates all gradients, patterns, and filters for the Dafel Banda
 */

import React from 'react';
import { 
  GRADIENT_DEFINITIONS, 
  PATTERN_DEFINITIONS, 
  FILTER_DEFINITIONS,
  ThemeConfig 
} from '../../../shared/types';

interface SVGDefinitionsProps {
  instanceId: string;
  themeConfig?: ThemeConfig;
}

export const SVGDefinitions: React.FC<SVGDefinitionsProps> = ({ 
  instanceId, 
  themeConfig 
}) => {
  // Apply theme modifications to colors
  const getThemeColor = (originalColor: string): string => {
    if (!themeConfig?.colors) return originalColor;
    
    // Simple color mapping - in production, use a proper color manipulation library
    const colorMap: Record<string, string> = {
      '#D0E8F5': themeConfig.colors.primary || originalColor,
      '#5FD4C4': themeConfig.colors.secondary || originalColor,
      '#D5EDB8': themeConfig.colors.accent || originalColor,
    };
    
    return colorMap[originalColor] || originalColor;
  };

  return (
    <defs>
      {/* Gradients */}
      {GRADIENT_DEFINITIONS.map((gradient) => {
        const GradientComponent = gradient.type === 'radial' ? 'radialGradient' : 'linearGradient';
        
        return (
          <GradientComponent
            key={gradient.id}
            id={`${gradient.id}-${instanceId}`}
            {...gradient.coordinates}
          >
            {gradient.stops.map((stop, index) => (
              <stop
                key={index}
                offset={stop.offset}
                stopColor={getThemeColor(stop.color)}
              />
            ))}
          </GradientComponent>
        );
      })}

      {/* Patterns */}
      {PATTERN_DEFINITIONS.map((pattern) => (
        <pattern
          key={pattern.id}
          id={`${pattern.id}-${instanceId}`}
          width={pattern.width}
          height={pattern.height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={pattern.path}
            stroke={pattern.stroke}
            strokeWidth={pattern.strokeWidth}
            opacity={pattern.opacity}
            fill="none"
          />
        </pattern>
      ))}

      {/* Filters */}
      {FILTER_DEFINITIONS.map((filter) => (
        <filter key={filter.id} id={`${filter.id}-${instanceId}`}>
          {filter.effects.map((effect, index) => {
            switch (effect.type) {
              case 'blur':
                return (
                  <feGaussianBlur
                    key={index}
                    in={effect.properties.in as string}
                    stdDeviation={effect.properties.stdDeviation as string}
                  />
                );
              case 'offset':
                return (
                  <feOffset
                    key={index}
                    dy={effect.properties.dy as string}
                  />
                );
              case 'alpha':
                return (
                  <feComponentTransfer key={index}>
                    <feFuncA
                      type={effect.properties.type as string}
                      slope={effect.properties.slope as string}
                    />
                  </feComponentTransfer>
                );
              case 'merge':
                return (
                  <feMerge key={index}>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                );
              default:
                return null;
            }
          })}
        </filter>
      ))}

      {/* Custom theme gradients */}
      {themeConfig?.gradients && Object.entries(themeConfig.gradients).map(([key, value]) => (
        <linearGradient key={`custom-${key}`} id={`custom-${key}-${instanceId}`}>
          <stop offset="0%" stopColor={value} />
          <stop offset="100%" stopColor={value} />
        </linearGradient>
      ))}

      {/* Additional effects for high contrast */}
      {themeConfig?.highContrast && (
        <filter id={`high-contrast-${instanceId}`}>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 .5 1" />
          </feComponentTransfer>
        </filter>
      )}
    </defs>
  );
};

export default SVGDefinitions;