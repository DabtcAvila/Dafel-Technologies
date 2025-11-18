import { Variants, Transition } from 'framer-motion';

export interface AnimationConfig {
  variants: Variants;
  initial: string;
  animate: string;
  exit?: string;
  transition?: Transition;
}

export interface ScrollAnimationProps {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
}

export interface StaggerAnimationProps {
  staggerChildren?: number;
  delayChildren?: number;
}

export interface HoverAnimationProps {
  scale?: number;
  y?: number;
  rotation?: number;
  duration?: number;
}

export interface PageTransitionProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  ease?: string;
}