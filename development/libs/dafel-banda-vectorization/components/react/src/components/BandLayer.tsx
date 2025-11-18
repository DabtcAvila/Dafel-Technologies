/**
 * Band Layer Component
 * Individual layer renderer with performance optimizations
 */

import React, { memo } from 'react';
import clsx from 'clsx';
import { BandLayer as BandLayerType } from '../../../shared/types';

interface BandLayerProps {
  layer: BandLayerType;
  index: number;
  instanceId: string;
  animation: string;
  interactive: boolean;
  performance: 'low' | 'medium' | 'high';
  onError: (error: Error) => void;
}

export const BandLayer: React.FC<BandLayerProps> = memo(({
  layer,
  index,
  instanceId,
  animation,
  interactive,
  performance,
  onError
}) => {
  // Performance optimizations based on level
  const shouldUseFilter = performance === 'high' && layer.hasFilter;
  const shouldOptimizeRendering = performance === 'low';

  const layerStyle = {
    ...(shouldOptimizeRendering && {
      shapeRendering: 'optimizeSpeed' as const,
      colorRendering: 'optimizeSpeed' as const,
    }),
    ...(performance === 'high' && {
      willChange: 'transform, opacity',
    }),
  };

  const handleLayerError = () => {
    onError(new Error(`Failed to render layer ${layer.id}`));
  };

  return (
    <g
      id={`layer-${layer.id}-${layer.name}-${instanceId}`}
      className={clsx('band-layer', {
        'band-layer--has-grid': layer.hasGrid,
        'band-layer--has-filter': shouldUseFilter,
        'band-layer--interactive': interactive,
        'band-layer--optimized': shouldOptimizeRendering,
      })}
      opacity={layer.opacity}
      style={layerStyle}
      filter={shouldUseFilter ? `url(#${layer.filter}-${instanceId})` : undefined}
      onError={handleLayerError}
    >
      {/* Base path */}
      <path
        d={layer.path}
        fill={`url(#${layer.gradient}-${instanceId})`}
        className="band-path"
        vectorEffect={shouldOptimizeRendering ? 'non-scaling-stroke' : undefined}
      />

      {/* Grid overlay */}
      {layer.hasGrid && (
        <path
          d={layer.path}
          fill={`url(#${layer.gridPattern}-${instanceId})`}
          className="band-grid-overlay"
          vectorEffect={shouldOptimizeRendering ? 'non-scaling-stroke' : undefined}
        />
      )}
    </g>
  );
});

BandLayer.displayName = 'BandLayer';

export default BandLayer;