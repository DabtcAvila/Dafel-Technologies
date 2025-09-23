/**
 * DAFEL TECHNOLOGIES - PREMIUM ANIMATION SYSTEM
 * Enterprise-grade animation presets and utilities
 */

import { Variants, Transition } from 'framer-motion';

// === EASING FUNCTIONS ===
export const easings = {
  // Standard easings
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  
  // Premium custom easings
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.68, -0.6, 0.32, 1.6],
  
  // Micro-interactions
  gentle: [0.25, 0.46, 0.45, 0.94],
  smooth: [0.4, 0, 0.2, 1],
  crisp: [0.2, 0, 0, 1],
} as const;

// === DURATION PRESETS ===
export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  slower: 0.5,
  slowest: 0.75,
} as const;

// === SPRING CONFIGURATIONS ===
export const springs = {
  // Gentle spring for cards and buttons
  gentle: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },
  
  // Stiff spring for quick snappy animations
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 25,
  },
  
  // Soft spring for smooth transitions
  soft: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
} as const;

// === ENTRANCE ANIMATIONS ===
export const entranceAnimations: Record<string, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: [0.3, 1.1, 0.9, 1],
      transition: { duration: 0.6 }
    },
    exit: { opacity: 0, scale: 0.8 },
  },
  
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
  },
  
  zoomIn: {
    initial: { opacity: 0, scale: 0.95, blur: 4 },
    animate: { opacity: 1, scale: 1, blur: 0 },
    exit: { opacity: 0, scale: 0.95, blur: 4 },
  },
  
  expandIn: {
    initial: { opacity: 0, height: 0, scale: 0.8 },
    animate: { opacity: 1, height: 'auto', scale: 1 },
    exit: { opacity: 0, height: 0, scale: 0.8 },
  },
};

// === HOVER ANIMATIONS ===
export const hoverAnimations = {
  lift: {
    whileHover: { y: -4, scale: 1.02 },
    transition: springs.gentle,
  },
  
  liftStrong: {
    whileHover: { y: -8, scale: 1.05 },
    transition: springs.bouncy,
  },
  
  scale: {
    whileHover: { scale: 1.05 },
    transition: springs.gentle,
  },
  
  rotate: {
    whileHover: { rotate: 5 },
    transition: springs.gentle,
  },
  
  glow: {
    whileHover: { 
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
      scale: 1.02,
    },
    transition: springs.gentle,
  },
  
  shimmer: {
    whileHover: {
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    },
    transition: { duration: 0.6 },
  },
  
  tilt: {
    whileHover: { 
      rotateX: 10,
      rotateY: 10,
      scale: 1.02,
    },
    transition: springs.gentle,
  },
};

// === TAP ANIMATIONS ===
export const tapAnimations = {
  scale: {
    whileTap: { scale: 0.98 },
    transition: springs.snappy,
  },
  
  press: {
    whileTap: { scale: 0.95, y: 2 },
    transition: springs.snappy,
  },
  
  bounce: {
    whileTap: { scale: [1, 0.9, 1.1, 1] },
    transition: { duration: 0.3 },
  },
};

// === STAGGER ANIMATIONS ===
export const staggerAnimations = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  
  fastContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  },
  
  slowContainer: {
    animate: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  },
};

// === PAGE TRANSITIONS ===
export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.normal },
  },
  
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: springs.gentle,
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: springs.gentle,
  },
  
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: { duration: durations.slow },
  },
};

// === LOADING ANIMATIONS ===
export const loadingAnimations = {
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
  
  dots: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
  
  pulse: {
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  
  wave: {
    animate: { 
      y: [0, -10, 0],
    },
    transition: { 
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// === UTILITY FUNCTIONS ===
export function createStaggeredAnimation(
  children: number,
  staggerDelay: number = 0.1,
  childAnimation: Variants = entranceAnimations.fadeIn
) {
  return {
    container: {
      animate: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    },
    child: childAnimation,
  };
}

export function combineAnimations(...animations: any[]) {
  return animations.reduce((combined, animation) => ({
    ...combined,
    ...animation,
  }), {});
}

export function createResponsiveAnimation(
  mobile: Variants,
  desktop: Variants,
  breakpoint: number = 768
) {
  return typeof window !== 'undefined' && window.innerWidth < breakpoint ? mobile : desktop;
}

// === PRESET COMBINATIONS ===
export const presetCombinations = {
  // Premium card animation
  premiumCard: combineAnimations(
    entranceAnimations.slideUp,
    hoverAnimations.lift,
    tapAnimations.scale
  ),
  
  // Interactive button
  interactiveButton: combineAnimations(
    entranceAnimations.fadeIn,
    hoverAnimations.glow,
    tapAnimations.press
  ),
  
  // Hero section
  heroSection: combineAnimations(
    entranceAnimations.slideUp,
    staggerAnimations.container
  ),
  
  // Modal animation
  modal: combineAnimations(
    entranceAnimations.scaleIn,
    { transition: springs.gentle }
  ),
  
  // Floating action button
  fab: combineAnimations(
    entranceAnimations.bounceIn,
    hoverAnimations.liftStrong,
    tapAnimations.bounce
  ),
};