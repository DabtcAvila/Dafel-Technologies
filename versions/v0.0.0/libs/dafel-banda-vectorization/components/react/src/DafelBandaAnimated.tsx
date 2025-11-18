/**
 * Dafel Banda Animated React Component
 * Full-featured component with Framer Motion animations
 */

import React, { useMemo, forwardRef, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { DafelBandaProps, LAYER_DEFINITIONS, shouldReduceMotion, getLayerDelay } from '../../shared/types';
import { SVGDefinitions } from './components/SVGDefinitions';

export const DafelBandaAnimated = forwardRef<SVGSVGElement, DafelBandaProps>((
  {
    animation = 'fadeIn',
    width = 1280,
    height = 720,
    interactive = false,
    className = '',
    ariaLabel = 'Dafel Banda animated decorative element',
    reducedMotion = false,
    lazy = true,
    performance = 'medium',
    animationConfig,
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
  const isInView = useInView(containerRef, { 
    once: true, 
    amount: 0.3,
    margin: '-100px'
  });

  // Check if motion should be reduced
  const motionReduced = shouldReduceMotion({ reducedMotion, accessibilityConfig });
  const finalAnimation = motionReduced ? 'none' : animation;

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Performance optimizations
  const layerData = useMemo(() => LAYER_DEFINITIONS, []);
  const instanceId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: animationConfig?.duration || 1.2,
        ease: animationConfig?.easing || [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      }
    }
  }), [animationConfig]);

  const layerVariants = useMemo(() => ({
    fadeIn: {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: (custom: any) => ({
        opacity: custom.baseOpacity,
        y: 0,
        scale: 1,
        transition: {
          duration: 1.0,
          delay: custom.delay,
          ease: [0.4, 0, 0.2, 1]
        }
      })
    },
    wave: {
      animate: (custom: any) => ({
        x: [-8, 8, -8],
        y: [-3, 3, -3],
        transition: {
          duration: animationConfig?.duration || 4,
          delay: custom.delay,
          repeat: animationConfig?.repeat === false ? 0 : Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse' as const
        }
      })
    },
    pulse: {
      animate: (custom: any) => ({
        scale: [1, 1.02, 1],
        opacity: [
          custom.baseOpacity,
          Math.min(custom.baseOpacity + 0.15, 1),
          custom.baseOpacity
        ],
        transition: {
          duration: 3,
          delay: custom.delay,
          repeat: animationConfig?.repeat === false ? 0 : Infinity,
          ease: 'easeInOut'
        }
      })
    },
    morphing: {
      animate: (custom: any) => ({
        d: [
          custom.originalPath,
          custom.morphedPath || custom.originalPath,
          custom.originalPath
        ],
        transition: {
          duration: 5,
          delay: custom.delay,
          repeat: animationConfig?.repeat === false ? 0 : Infinity,
          ease: 'easeInOut'
        }
      })
    },
    interactive: {
      rest: { scale: 1, y: 0 },
      hover: (custom: any) => ({
        scale: 1.02,
        y: -2,
        opacity: Math.min(custom.baseOpacity + 0.1, 1),
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }
      }),
      tap: { scale: 0.98 }
    }
  }), [animationConfig]);

  // Generate morph paths for morphing animation
  const getMorphedPath = (originalPath: string, factor: number = 0.1): string => {
    // Simple path morphing - in production, use a proper SVG morphing library
    return originalPath.replace(/(\d+)/g, (match) => {
      const num = parseInt(match);
      const variation = Math.sin(num * 0.01) * factor * num;
      return Math.round(num + variation).toString();
    });
  };

  // Event handlers
  const handleLayerInteraction = (event: any, layerId: number) => {
    if (!interactive) return;
    
    switch (event.type) {
      case 'mouseenter':
        onHover?.(event);
        break;
      case 'click':
        onClick?.(event);
        break;
      case 'focus':
        onFocus?.(event);
        break;
    }
  };

  const getAnimationProps = (layer: any, index: number) => {
    const customProps = {
      baseOpacity: layer.opacity,
      delay: getLayerDelay(index),
      originalPath: layer.path,
      morphedPath: getMorphedPath(layer.path)
    };

    switch (finalAnimation) {
      case 'fadeIn':
        return {
          initial: 'hidden',
          animate: isInView ? 'visible' : 'hidden',
          variants: layerVariants.fadeIn,
          custom: customProps
        };
      
      case 'wave':
      case 'pulse':
        return {
          animate: 'animate',
          variants: layerVariants[finalAnimation],
          custom: customProps
        };
      
      case 'morphing':
        return {
          animate: 'animate',
          variants: layerVariants.morphing,
          custom: customProps
        };
      
      case 'interactive':
        return interactive ? {
          initial: 'rest',
          whileHover: 'hover',
          whileTap: 'tap',
          variants: layerVariants.interactive,
          custom: customProps
        } : {};
      
      case 'scroll':
        return {
          style: {
            y: useTransform(scrollYProgress, [0, 1], [0, (index + 1) * 15])
          }
        };
      
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      <motion.svg
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
          'dafel-banda--animated',
          {
            'dafel-banda--interactive': interactive,
            'dafel-banda--reduced-motion': motionReduced,
            [`dafel-banda--${performance}`]: performance !== 'medium',
            [`dafel-banda--${finalAnimation}`]: finalAnimation !== 'none',
          },
          className
        )}
        style={{
          overflow: 'hidden',
          ...(performance === 'high' && {
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }),
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        aria-label={ariaLabel}
        role={accessibilityConfig?.role || 'img'}
        onLoad={() => onLoad?.()}
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

        {/* Animated Layers */}
        {layerData.map((layer, index) => (
          <motion.g
            key={layer.id}
            id={`layer-${layer.id}-${layer.name}-${instanceId}`}
            className={clsx('band-layer', {
              'band-layer--has-grid': layer.hasGrid,
              'band-layer--interactive': interactive
            })}
            opacity={layer.opacity}
            {...getAnimationProps(layer, index)}
            onMouseEnter={interactive ? (e) => handleLayerInteraction(e, layer.id) : undefined}
            onClick={interactive ? (e) => handleLayerInteraction(e, layer.id) : undefined}
            onFocus={interactive ? (e) => handleLayerInteraction(e, layer.id) : undefined}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              ...(layer.hasFilter && performance === 'high' && {
                filter: `url(#${layer.filter}-${instanceId})`
              })
            }}
          >
            {/* Base path */}
            <motion.path
              d={layer.path}
              fill={`url(#${layer.gradient}-${instanceId})`}
              className="band-path"
            />

            {/* Grid overlay */}
            {layer.hasGrid && (
              <motion.path
                d={layer.path}
                fill={`url(#${layer.gridPattern}-${instanceId})`}
                className="band-grid-overlay"
              />
            )}
          </motion.g>
        ))}
      </motion.svg>
    </AnimatePresence>
  );
});

DafelBandaAnimated.displayName = 'DafelBandaAnimated';

export default DafelBandaAnimated;