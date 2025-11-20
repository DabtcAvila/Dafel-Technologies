/**
 * useResponsiveBanda Hook
 * Manages responsive behavior for Dafel Banda components
 */

import { useState, useEffect, useMemo } from 'react';
import { ResponsiveConfig, ResponsiveBreakpoint, getResponsiveSize } from '../../../shared/types';

export interface ResponsiveBandaState {
  breakpoint: ResponsiveBreakpoint;
  dimensions: { width: number; height: number };
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  devicePixelRatio: number;
}

export interface UseResponsiveBandaOptions {
  defaultWidth?: number;
  defaultHeight?: number;
  responsiveConfig?: ResponsiveConfig;
  debounceMs?: number;
}

const BREAKPOINT_VALUES: Record<ResponsiveBreakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsiveBanda = ({
  defaultWidth = 1280,
  defaultHeight = 720,
  responsiveConfig,
  debounceMs = 250
}: UseResponsiveBandaOptions = {}): ResponsiveBandaState => {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  }));

  // Debounced resize handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);

  // Calculate current breakpoint
  const breakpoint = useMemo((): ResponsiveBreakpoint => {
    const width = windowSize.width;
    
    if (width >= BREAKPOINT_VALUES['2xl']) return '2xl';
    if (width >= BREAKPOINT_VALUES.xl) return 'xl';
    if (width >= BREAKPOINT_VALUES.lg) return 'lg';
    if (width >= BREAKPOINT_VALUES.md) return 'md';
    if (width >= BREAKPOINT_VALUES.sm) return 'sm';
    return 'xs';
  }, [windowSize.width]);

  // Calculate responsive dimensions
  const dimensions = useMemo(() => {
    if (!responsiveConfig) {
      return { width: defaultWidth, height: defaultHeight };
    }
    
    return getResponsiveSize(responsiveConfig, breakpoint, defaultWidth, defaultHeight);
  }, [responsiveConfig, breakpoint, defaultWidth, defaultHeight]);

  // Device type flags
  const deviceInfo = useMemo(() => ({
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  }), [breakpoint]);

  return {
    breakpoint,
    dimensions,
    ...deviceInfo,
  };
};

// Helper hook for media queries
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Predefined breakpoint hooks
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1536px)');

export default useResponsiveBanda;