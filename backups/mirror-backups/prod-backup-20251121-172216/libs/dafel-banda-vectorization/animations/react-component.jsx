/**
 * DAFEL BANDA BAJA - Componente React con Framer Motion
 *
 * Requiere:
 * - React 18+
 * - Framer Motion 10+ (npm install framer-motion)
 *
 * Características:
 * - Animaciones fluidas con Framer Motion
 * - Variantes de animación configurables
 * - Interacciones hover/tap
 * - Scroll-based animations
 * - Performance optimizado con useMemo
 * - TypeScript compatible
 */

import React, { useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/* ============================================
   TIPOS / INTERFACES
   ============================================ */

/**
 * @typedef {Object} DafelBandaProps
 * @property {'fadeIn'|'wave'|'pulse'|'scroll'|'interactive'|'none'} animation - Tipo de animación
 * @property {number} width - Ancho del SVG
 * @property {number} height - Alto del SVG
 * @property {string} className - Clase CSS adicional
 * @property {boolean} interactive - Activar hover/tap effects
 * @property {Object} customVariants - Variantes personalizadas de Framer Motion
 */

/* ============================================
   VARIANTES DE ANIMACIÓN
   ============================================ */

const animationVariants = {
  // Fade In Escalonado
  fadeIn: {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: (custom) => ({
      opacity: custom.opacity || 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        delay: custom.delay || 0,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  },

  // Wave Horizontal
  wave: {
    animate: (custom) => ({
      x: [-8, 8, -8],
      y: [-3, 3, -3],
      transition: {
        duration: custom.duration || 4,
        delay: custom.delay || 0,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })
  },

  // Pulsación
  pulse: {
    animate: (custom) => ({
      scale: [1, 1.02, 1],
      opacity: [
        custom.baseOpacity,
        custom.baseOpacity + 0.15,
        custom.baseOpacity
      ],
      transition: {
        duration: 3,
        delay: custom.delay || 0,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })
  },

  // Hover Interactive
  hover: {
    rest: { scale: 1, y: 0 },
    hover: (custom) => ({
      scale: 1.05,
      y: -5,
      opacity: Math.min((custom.baseOpacity || 0.7) + 0.2, 1),
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }),
    tap: { scale: 0.98 }
  }
};

/* ============================================
   COMPONENTE PRINCIPAL
   ============================================ */

export const DafelBanda = ({
  animation = 'fadeIn',
  width = 1280,
  height = 720,
  className = '',
  interactive = false,
  customVariants = null
}) => {
  // Configuración de capas
  const layers = useMemo(() => [
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
      gridPattern: 'pattern-grid-blue-dark'
    },
    {
      id: 7,
      name: 'blue-deepest-front',
      opacity: 0.82,
      gradient: 'grad-blue-deepest',
      path: 'M300 500Q440 480 580 470T840 500T1100 570Q1170 605 1240 640V705Q1170 670 1100 635T840 565T580 535Q440 545 300 565Z',
      hasGrid: false
    }
  ], []);

  // Calcular delay escalonado
  const getDelay = (index) => index * 0.15;

  // Variantes a usar
  const variants = customVariants || animationVariants[animation] || {};

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`dafel-banda-react ${className}`}
      style={{ overflow: 'hidden' }}
    >
      <defs>
        <Gradients />
        <GridPatterns />
        <Filters />
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill="#F8FBFD" />

      {/* Layers */}
      {layers.map((layer, index) => (
        <BandLayer
          key={layer.id}
          layer={layer}
          animation={animation}
          variants={variants}
          interactive={interactive}
          delay={getDelay(index)}
        />
      ))}
    </svg>
  );
};

/* ============================================
   COMPONENTE: CAPA DE BANDA
   ============================================ */

const BandLayer = ({ layer, animation, variants, interactive, delay }) => {
  const customProps = {
    opacity: layer.opacity,
    delay: delay,
    duration: 4 - delay,
    baseOpacity: layer.opacity
  };

  const MotionGroup = interactive ? motion.g : motion.g;

  const animationProps = useMemo(() => {
    switch (animation) {
      case 'fadeIn':
        return {
          initial: 'hidden',
          animate: 'visible',
          variants: variants,
          custom: customProps
        };
      case 'wave':
      case 'pulse':
        return {
          animate: 'animate',
          variants: variants,
          custom: customProps
        };
      case 'interactive':
        return interactive ? {
          initial: 'rest',
          whileHover: 'hover',
          whileTap: 'tap',
          variants: animationVariants.hover,
          custom: customProps
        } : {};
      default:
        return {};
    }
  }, [animation, variants, customProps, interactive]);

  return (
    <MotionGroup
      id={`layer-${layer.id}-${layer.name}`}
      className={`band-layer ${layer.hasGrid ? 'has-grid' : ''}`}
      opacity={layer.opacity}
      {...animationProps}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Base path */}
      <path
        d={layer.path}
        fill={`url(#${layer.gradient})`}
        className="band-path"
      />

      {/* Grid overlay si existe */}
      {layer.hasGrid && (
        <path
          d={layer.path}
          fill={`url(#${layer.gridPattern})`}
          className="band-grid-overlay"
        />
      )}
    </MotionGroup>
  );
};

/* ============================================
   COMPONENTE: SCROLL-BASED VERSION
   ============================================ */

export const DafelBandaScroll = ({ className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const layers = [/* mismo array de layers */];

  return (
    <motion.svg
      ref={ref}
      width={1280}
      height={720}
      viewBox="0 0 1280 720"
      xmlns="http://www.w3.org/2000/svg"
      className={`dafel-banda-scroll ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <defs>
        <Gradients />
        <GridPatterns />
      </defs>

      <rect width={1280} height={720} fill="#F8FBFD" />

      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [0, (index + 1) * 15]
        );

        return (
          <motion.g
            key={layer.id}
            opacity={layer.opacity}
            style={{ y }}
          >
            <path d={layer.path} fill={`url(#${layer.gradient})`} />
            {layer.hasGrid && (
              <path d={layer.path} fill={`url(#${layer.gridPattern})`} />
            )}
          </motion.g>
        );
      })}
    </motion.svg>
  );
};

/* ============================================
   COMPONENTES: GRADIENTES Y PATRONES
   ============================================ */

const Gradients = () => (
  <>
    <radialGradient id="grad-blue-light-radial" cx="30%" cy="40%">
      <stop offset="0%" stopColor="#D0E8F5" />
      <stop offset="50%" stopColor="#A8D1E6" />
      <stop offset="100%" stopColor="#7DBBDB" />
    </radialGradient>
    <linearGradient id="grad-blue-light-linear" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C0DFF0" />
      <stop offset="100%" stopColor="#6FB3D9" />
    </linearGradient>
    <radialGradient id="grad-green-lime" cx="35%" cy="45%">
      <stop offset="0%" stopColor="#D5EDB8" />
      <stop offset="50%" stopColor="#AAD989" />
      <stop offset="100%" stopColor="#7BC77F" />
    </radialGradient>
    <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5FD4C4" />
      <stop offset="50%" stopColor="#3AAFA3" />
      <stop offset="100%" stopColor="#1B8F9A" />
    </linearGradient>
    <linearGradient id="grad-blue-medium" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5AAED0" />
      <stop offset="50%" stopColor="#3493B8" />
      <stop offset="100%" stopColor="#1E7FA4" />
    </linearGradient>
    <linearGradient id="grad-blue-dark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2B88AA" />
      <stop offset="50%" stopColor="#1A6983" />
      <stop offset="100%" stopColor="#0E5F7E" />
    </linearGradient>
    <linearGradient id="grad-blue-deepest" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#1B7696" />
      <stop offset="50%" stopColor="#115A75" />
      <stop offset="100%" stopColor="#094A62" />
    </linearGradient>
  </>
);

const GridPatterns = () => (
  <>
    <pattern id="pattern-grid-teal" width="18" height="18" patternUnits="userSpaceOnUse">
      <path d="M0 0v18M0 0h18" stroke="#fff" strokeWidth="1.5" opacity=".25" />
    </pattern>
    <pattern id="pattern-grid-blue-medium" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M0 0v16M0 0h16" stroke="#fff" strokeWidth="1.8" opacity=".3" />
    </pattern>
    <pattern id="pattern-grid-blue-dark" width="14" height="14" patternUnits="userSpaceOnUse">
      <path d="M0 0v14M0 0h14" stroke="#fff" strokeWidth="2" opacity=".32" />
    </pattern>
  </>
);

const Filters = () => (
  <filter id="filter-shadow-subtle">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
    <feOffset dy="2" />
    <feComponentTransfer>
      <feFuncA type="linear" slope=".15" />
    </feComponentTransfer>
    <feMerge>
      <feMergeNode />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

/* ============================================
   EXPORTS
   ============================================ */

export default DafelBanda;

/* ============================================
   EJEMPLO DE USO
   ============================================ */

/*
import { DafelBanda, DafelBandaScroll } from './DafelBanda';

// Ejemplo 1: Fade In básico
<DafelBanda animation="fadeIn" />

// Ejemplo 2: Wave infinito
<DafelBanda animation="wave" />

// Ejemplo 3: Interactivo con hover
<DafelBanda animation="interactive" interactive={true} />

// Ejemplo 4: Scroll-based parallax
<DafelBandaScroll />

// Ejemplo 5: Personalizado
<DafelBanda
  animation="pulse"
  width={1920}
  height={1080}
  className="my-custom-class"
/>
*/
