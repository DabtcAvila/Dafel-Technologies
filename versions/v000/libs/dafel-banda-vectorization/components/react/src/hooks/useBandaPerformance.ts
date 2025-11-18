/**
 * useBandaPerformance Hook
 * Monitors and optimizes performance for Dafel Banda components
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PerformanceConfig } from '../../../shared/types';

export interface PerformanceMetrics {
  renderTime: number;
  frameRate: number;
  memoryUsage: number;
  isVisible: boolean;
  interactionLatency: number;
  loadTime: number;
}

export interface PerformanceState {
  metrics: PerformanceMetrics;
  level: 'low' | 'medium' | 'high';
  recommendations: string[];
  isOptimized: boolean;
}

export interface UseBandaPerformanceOptions {
  config?: PerformanceConfig;
  monitoringEnabled?: boolean;
  autoOptimize?: boolean;
  onPerformanceIssue?: (issue: string) => void;
  thresholds?: {
    maxRenderTime?: number;
    minFrameRate?: number;
    maxMemoryUsage?: number;
  };
}

const DEFAULT_THRESHOLDS = {
  maxRenderTime: 16, // 60fps = 16.67ms per frame
  minFrameRate: 55, // Close to 60fps
  maxMemoryUsage: 50, // 50MB
};

export const useBandaPerformance = ({
  config = {},
  monitoringEnabled = true,
  autoOptimize = true,
  onPerformanceIssue,
  thresholds = DEFAULT_THRESHOLDS,
}: UseBandaPerformanceOptions = {}): PerformanceState => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    frameRate: 60,
    memoryUsage: 0,
    isVisible: false,
    interactionLatency: 0,
    loadTime: 0,
  });

  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const renderStartTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const componentRef = useRef<Element | null>(null);

  // Frame rate monitoring
  const monitorFrameRate = useCallback(() => {
    if (!monitoringEnabled) return;

    const now = performance.now();
    frameCount.current++;

    if (lastFrameTime.current) {
      const delta = now - lastFrameTime.current;
      const fps = 1000 / delta;
      
      setMetrics(prev => ({
        ...prev,
        frameRate: Math.round(fps * 10) / 10,
      }));

      if (fps < thresholds.minFrameRate) {
        onPerformanceIssue?.(`Low frame rate detected: ${fps.toFixed(1)}fps`);
      }
    }

    lastFrameTime.current = now;
    requestAnimationFrame(monitorFrameRate);
  }, [monitoringEnabled, thresholds.minFrameRate, onPerformanceIssue]);

  // Memory usage monitoring
  const monitorMemoryUsage = useCallback(() => {
    if (!monitoringEnabled || !(performance as any).memory) return;

    const memory = (performance as any).memory;
    const usedMB = memory.usedJSHeapSize / 1024 / 1024;
    
    setMetrics(prev => ({
      ...prev,
      memoryUsage: Math.round(usedMB * 100) / 100,
    }));

    if (usedMB > thresholds.maxMemoryUsage) {
      onPerformanceIssue?.(`High memory usage detected: ${usedMB.toFixed(1)}MB`);
    }
  }, [monitoringEnabled, thresholds.maxMemoryUsage, onPerformanceIssue]);

  // Render time monitoring
  const startRenderMeasurement = useCallback(() => {
    if (!monitoringEnabled) return;
    renderStartTime.current = performance.now();
  }, [monitoringEnabled]);

  const endRenderMeasurement = useCallback(() => {
    if (!monitoringEnabled || !renderStartTime.current) return;
    
    const renderTime = performance.now() - renderStartTime.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(renderTime * 100) / 100,
    }));

    if (renderTime > thresholds.maxRenderTime) {
      onPerformanceIssue?.(`Slow render detected: ${renderTime.toFixed(1)}ms`);
    }

    renderStartTime.current = 0;
  }, [monitoringEnabled, thresholds.maxRenderTime, onPerformanceIssue]);

  // Visibility monitoring
  const setupVisibilityObserver = useCallback((element: Element) => {
    if (!monitoringEnabled || !element) return;

    intersectionObserver.current = new IntersectionObserver(
      ([entry]) => {
        setMetrics(prev => ({
          ...prev,
          isVisible: entry.isIntersecting,
        }));
      },
      { threshold: 0.1 }
    );

    intersectionObserver.current.observe(element);
    componentRef.current = element;
  }, [monitoringEnabled]);

  // Performance recommendations
  const generateRecommendations = useCallback(() => {
    const newRecommendations: string[] = [];

    if (metrics.renderTime > thresholds.maxRenderTime) {
      newRecommendations.push('Consider reducing animation complexity or using lower performance mode');
    }

    if (metrics.frameRate < thresholds.minFrameRate) {
      newRecommendations.push('Enable GPU acceleration with will-change CSS property');
    }

    if (metrics.memoryUsage > thresholds.maxMemoryUsage) {
      newRecommendations.push('Consider lazy loading or reducing concurrent animations');
    }

    if (!metrics.isVisible) {
      newRecommendations.push('Component is not visible - animations can be paused');
    }

    setRecommendations(newRecommendations);
  }, [metrics, thresholds]);

  // Auto optimization
  const autoOptimizePerformance = useCallback(() => {
    if (!autoOptimize) return;

    let newLevel: 'low' | 'medium' | 'high' = 'medium';

    // Determine performance level based on metrics
    const hasPerformanceIssues = 
      metrics.renderTime > thresholds.maxRenderTime ||
      metrics.frameRate < thresholds.minFrameRate ||
      metrics.memoryUsage > thresholds.maxMemoryUsage;

    if (hasPerformanceIssues) {
      newLevel = 'low';
    } else if (
      metrics.renderTime < thresholds.maxRenderTime / 2 &&
      metrics.frameRate > thresholds.minFrameRate + 5 &&
      metrics.memoryUsage < thresholds.maxMemoryUsage / 2
    ) {
      newLevel = 'high';
    }

    setLevel(newLevel);
  }, [autoOptimize, metrics, thresholds]);

  // Performance observer setup
  useEffect(() => {
    if (!monitoringEnabled || typeof PerformanceObserver === 'undefined') return;

    performanceObserver.current = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === 'measure' && entry.name.includes('dafel-banda')) {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration,
          }));
        }
      }
    });

    performanceObserver.current.observe({ entryTypes: ['measure'] });

    return () => {
      performanceObserver.current?.disconnect();
    };
  }, [monitoringEnabled]);

  // Start monitoring
  useEffect(() => {
    if (!monitoringEnabled) return;

    monitorFrameRate();
    
    const memoryInterval = setInterval(monitorMemoryUsage, 1000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, [monitoringEnabled, monitorFrameRate, monitorMemoryUsage]);

  // Update recommendations and optimization
  useEffect(() => {
    generateRecommendations();
    autoOptimizePerformance();
  }, [metrics, generateRecommendations, autoOptimizePerformance]);

  // Cleanup
  useEffect(() => {
    return () => {
      intersectionObserver.current?.disconnect();
      performanceObserver.current?.disconnect();
    };
  }, []);

  // API for manual performance measurement
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (!monitoringEnabled) {
      fn();
      return;
    }

    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }, [monitoringEnabled]);

  // API for interaction latency measurement
  const measureInteraction = useCallback((interaction: () => void) => {
    const start = performance.now();
    interaction();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      interactionLatency: end - start,
    }));
  }, []);

  const isOptimized = useMemo(() => {
    return metrics.renderTime <= thresholds.maxRenderTime &&
           metrics.frameRate >= thresholds.minFrameRate &&
           metrics.memoryUsage <= thresholds.maxMemoryUsage;
  }, [metrics, thresholds]);

  return {
    metrics,
    level,
    recommendations,
    isOptimized,
    // Exposed functions for component integration
    startRenderMeasurement,
    endRenderMeasurement,
    setupVisibilityObserver,
    measurePerformance,
    measureInteraction,
  } as PerformanceState & {
    startRenderMeasurement: () => void;
    endRenderMeasurement: () => void;
    setupVisibilityObserver: (element: Element) => void;
    measurePerformance: (name: string, fn: () => void) => void;
    measureInteraction: (interaction: () => void) => void;
  };
};

// Hook for performance-aware animation
export const usePerformanceAwareAnimation = (
  baseAnimation: string,
  performanceLevel: 'low' | 'medium' | 'high'
) => {
  return useMemo(() => {
    switch (performanceLevel) {
      case 'low':
        return 'none'; // Disable animations for performance
      case 'medium':
        return baseAnimation === 'morphing' ? 'pulse' : baseAnimation; // Simplify complex animations
      case 'high':
        return baseAnimation; // Use full animation
      default:
        return baseAnimation;
    }
  }, [baseAnimation, performanceLevel]);
};

// Hook for adaptive quality
export const useAdaptiveQuality = (
  performanceLevel: 'low' | 'medium' | 'high'
) => {
  return useMemo(() => ({
    shapeRendering: performanceLevel === 'low' ? 'optimizeSpeed' : 'geometricPrecision',
    colorRendering: performanceLevel === 'low' ? 'optimizeSpeed' : 'optimizeQuality',
    enableFilters: performanceLevel !== 'low',
    enableShadows: performanceLevel === 'high',
    enableGridPatterns: performanceLevel !== 'low',
  }), [performanceLevel]);
};

export default useBandaPerformance;