/**
 * useAnimationControl Hook
 * Controls and manages animations for Dafel Banda components
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimationType, AnimationConfig } from '../../../shared/types';

export interface AnimationControlState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  currentAnimation: AnimationType;
  iterationCount: number;
}

export interface AnimationControlActions {
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
  setAnimation: (animation: AnimationType) => void;
  setProgress: (progress: number) => void;
}

export interface UseAnimationControlOptions {
  animation?: AnimationType;
  config?: AnimationConfig;
  autoPlay?: boolean;
  respectReducedMotion?: boolean;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onAnimationIteration?: (count: number) => void;
}

export const useAnimationControl = ({
  animation = 'fadeIn',
  config = {},
  autoPlay = true,
  respectReducedMotion = true,
  onAnimationStart,
  onAnimationEnd,
  onAnimationIteration,
}: UseAnimationControlOptions = {}): [AnimationControlState, AnimationControlActions] => {
  const [state, setState] = useState<AnimationControlState>({
    isPlaying: autoPlay,
    isPaused: false,
    progress: 0,
    currentAnimation: animation,
    iterationCount: 0,
  });

  const animationRef = useRef<Animation | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  const shouldReduceMotion = useMemo(() => {
    if (!respectReducedMotion) return false;
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [respectReducedMotion]);

  // Animation configuration with defaults
  const animationConfig = useMemo(() => ({
    duration: config.duration || 1000,
    delay: config.delay || 0,
    easing: config.easing || 'ease-in-out',
    repeat: config.repeat ?? false,
    direction: config.direction || 'normal',
  }), [config]);

  // Progress tracking
  const updateProgress = useCallback(() => {
    if (!animationRef.current) return;

    const animation = animationRef.current;
    const progress = animation.currentTime ? 
      Math.min(animation.currentTime / animationConfig.duration, 1) : 0;

    setState(prev => ({ ...prev, progress }));

    if (progress >= 1) {
      setState(prev => ({ 
        ...prev, 
        iterationCount: prev.iterationCount + 1 
      }));
      onAnimationIteration?.(state.iterationCount + 1);

      if (!animationConfig.repeat || animationConfig.repeat === 1) {
        setState(prev => ({ ...prev, isPlaying: false }));
        onAnimationEnd?.();
      }
    }
  }, [animationConfig, onAnimationIteration, onAnimationEnd, state.iterationCount]);

  // Start progress tracking
  useEffect(() => {
    if (state.isPlaying && !state.isPaused) {
      progressInterval.current = setInterval(updateProgress, 16); // ~60fps
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [state.isPlaying, state.isPaused, updateProgress]);

  // Animation control actions
  const actions = useMemo<AnimationControlActions>(() => ({
    play: () => {
      if (shouldReduceMotion) return;
      
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isPaused: false 
      }));
      onAnimationStart?.();
    },

    pause: () => {
      setState(prev => ({ 
        ...prev, 
        isPaused: true 
      }));
    },

    stop: () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false, 
        progress: 0,
        iterationCount: 0
      }));
    },

    restart: () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isPaused: false, 
        progress: 0,
        iterationCount: 0
      }));
      onAnimationStart?.();
    },

    setAnimation: (newAnimation: AnimationType) => {
      setState(prev => ({ 
        ...prev, 
        currentAnimation: newAnimation,
        progress: 0,
        iterationCount: 0
      }));
    },

    setProgress: (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      setState(prev => ({ 
        ...prev, 
        progress: clampedProgress 
      }));
    },
  }), [shouldReduceMotion, onAnimationStart]);

  // Handle reduced motion
  useEffect(() => {
    if (shouldReduceMotion && state.isPlaying) {
      actions.stop();
    }
  }, [shouldReduceMotion, state.isPlaying, actions]);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && !shouldReduceMotion) {
      actions.play();
    }
  }, [autoPlay, shouldReduceMotion, actions]);

  return [state, actions];
};

// Helper hook for sequence animations
export interface SequenceStep {
  animation: AnimationType;
  duration: number;
  delay?: number;
}

export const useAnimationSequence = (
  steps: SequenceStep[],
  options: Omit<UseAnimationControlOptions, 'animation'> = {}
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sequenceState, sequenceActions] = useAnimationControl({
    ...options,
    animation: steps[currentStepIndex]?.animation || 'none',
    config: {
      duration: steps[currentStepIndex]?.duration || 1000,
      delay: steps[currentStepIndex]?.delay || 0,
    },
    onAnimationEnd: () => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStepIndex(nextIndex);
      } else {
        options.onAnimationEnd?.();
      }
    },
  });

  const sequenceProgress = useMemo(() => {
    const totalSteps = steps.length;
    return totalSteps > 0 ? (currentStepIndex + sequenceState.progress) / totalSteps : 0;
  }, [currentStepIndex, sequenceState.progress, steps.length]);

  const resetSequence = useCallback(() => {
    setCurrentStepIndex(0);
    sequenceActions.restart();
  }, [sequenceActions]);

  return {
    ...sequenceState,
    currentStep: currentStepIndex,
    totalSteps: steps.length,
    sequenceProgress,
    actions: {
      ...sequenceActions,
      resetSequence,
    },
  };
};

// Hook for parallax animations based on scroll
export const useScrollAnimation = (
  element: React.RefObject<Element>,
  options: {
    offset?: [string, string];
    transform?: (progress: number) => Record<string, any>;
  } = {}
) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transforms, setTransforms] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!element.current) return;

    const handleScroll = () => {
      const el = element.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));

      setScrollProgress(progress);

      if (options.transform) {
        setTransforms(options.transform(progress));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [element, options]);

  return { scrollProgress, transforms };
};

export default useAnimationControl;