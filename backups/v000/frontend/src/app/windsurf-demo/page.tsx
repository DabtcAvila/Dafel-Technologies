/**
 * WINDSURF ENGINE DEMO PAGE
 * Comprehensive showcase of the WindsurfEngine animation system
 * Demonstrates all features including performance monitoring and accessibility
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  RainbowBackground,
  RainbowText,
  InteractiveElement,
  ScrollAnimated,
  RainbowBorder,
  ParallaxScroll,
  PerformanceContainer,
  useRainbowColors,
  useAnimationControl
} from '@/components/WindsurfAnimations';
import type { ColorConfig } from '@/lib/windsurf-engine';

export default function WindsurfDemoPage() {
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const { colors, updateColors } = useRainbowColors();
  const { isReady } = useAnimationControl();

  const handleColorSchemeChange = useCallback((scheme: string) => {
    const colorSchemes: Record<string, ColorConfig[]> = {
      rainbow: [
        { hue: 0, saturation: 96, lightness: 55 },
        { hue: 25, saturation: 100, lightness: 50 },
        { hue: 60, saturation: 100, lightness: 50 },
        { hue: 130, saturation: 100, lightness: 40 },
        { hue: 180, saturation: 100, lightness: 40 },
        { hue: 230, saturation: 100, lightness: 45 },
        { hue: 260, saturation: 100, lightness: 55 },
        { hue: 300, saturation: 100, lightness: 50 }
      ],
      sunset: [
        { hue: 15, saturation: 100, lightness: 55 },
        { hue: 30, saturation: 100, lightness: 50 },
        { hue: 45, saturation: 100, lightness: 50 },
        { hue: 15, saturation: 80, lightness: 40 },
        { hue: 330, saturation: 90, lightness: 45 },
        { hue: 315, saturation: 85, lightness: 50 },
        { hue: 300, saturation: 80, lightness: 55 },
        { hue: 285, saturation: 75, lightness: 50 }
      ],
      ocean: [
        { hue: 200, saturation: 100, lightness: 40 },
        { hue: 210, saturation: 95, lightness: 45 },
        { hue: 220, saturation: 90, lightness: 50 },
        { hue: 190, saturation: 85, lightness: 45 },
        { hue: 180, saturation: 100, lightness: 40 },
        { hue: 170, saturation: 90, lightness: 45 },
        { hue: 160, saturation: 85, lightness: 50 },
        { hue: 195, saturation: 80, lightness: 55 }
      ]
    };

    if (colorSchemes[scheme]) {
      updateColors(colorSchemes[scheme]);
    }
  }, [updateColors]);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(!animationsEnabled);
    if (animationsEnabled) {
      document.documentElement.classList.add('windsurf-pause-animations');
    } else {
      document.documentElement.classList.remove('windsurf-pause-animations');
    }
  }, [animationsEnabled]);

  return (
    <PerformanceContainer 
      monitoring={showPerformanceMonitor}
      fallback={
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Performance Mode</h1>
            <p className="text-gray-300">Animations disabled for better performance</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Header Section */}
        <header className="relative">
          <RainbowBackground 
            intensity="high" 
            speed="normal"
            className="py-20 px-4"
            disabled={!animationsEnabled}
          >
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <ScrollAnimated animationType="fadeIn" delay={0.2}>
                <RainbowText 
                  as="h1" 
                  className="text-6xl md:text-8xl font-bold mb-6"
                  disabled={!animationsEnabled}
                >
                  WINDSURF ENGINE
                </RainbowText>
              </ScrollAnimated>
              
              <ScrollAnimated animationType="slideUp" delay={0.4}>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                  Next-generation JavaScript animation system with dynamic color cycling, 
                  performance optimization, and advanced interaction handling
                </p>
              </ScrollAnimated>

              <ScrollAnimated animationType="scaleIn" delay={0.6}>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <InteractiveElement 
                    className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
                    onClick={() => handleColorSchemeChange('rainbow')}
                    disabled={!animationsEnabled}
                  >
                    Rainbow Mode
                  </InteractiveElement>
                  <InteractiveElement 
                    className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
                    onClick={() => handleColorSchemeChange('sunset')}
                    disabled={!animationsEnabled}
                  >
                    Sunset Mode
                  </InteractiveElement>
                  <InteractiveElement 
                    className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
                    onClick={() => handleColorSchemeChange('ocean')}
                    disabled={!animationsEnabled}
                  >
                    Ocean Mode
                  </InteractiveElement>
                </div>
              </ScrollAnimated>
            </div>
          </RainbowBackground>
        </header>

        {/* Controls Section */}
        <section className="py-12 px-4 bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimated animationType="slideLeft">
              <h2 className="text-4xl font-bold mb-8 text-center">
                <RainbowText disabled={!animationsEnabled}>Engine Controls</RainbowText>
              </h2>
            </ScrollAnimated>

            <div className="grid md:grid-cols-3 gap-6">
              <ScrollAnimated animationType="fadeIn" delay={0.2}>
                <RainbowBorder className="p-6 bg-gray-700 rounded-lg" disabled={!animationsEnabled}>
                  <h3 className="text-xl font-semibold mb-4">Performance Monitor</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showPerformanceMonitor}
                      onChange={(e) => setShowPerformanceMonitor(e.target.checked)}
                      className="form-checkbox"
                    />
                    <span>Enable Performance Monitoring</span>
                  </label>
                </RainbowBorder>
              </ScrollAnimated>

              <ScrollAnimated animationType="fadeIn" delay={0.4}>
                <RainbowBorder className="p-6 bg-gray-700 rounded-lg" disabled={!animationsEnabled}>
                  <h3 className="text-xl font-semibold mb-4">Animation Control</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={animationsEnabled}
                      onChange={toggleAnimations}
                      className="form-checkbox"
                    />
                    <span>Enable Animations</span>
                  </label>
                </RainbowBorder>
              </ScrollAnimated>

              <ScrollAnimated animationType="fadeIn" delay={0.6}>
                <RainbowBorder className="p-6 bg-gray-700 rounded-lg" disabled={!animationsEnabled}>
                  <h3 className="text-xl font-semibold mb-4">Engine Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Engine Status:</span>
                      <span className={isReady ? 'text-green-400' : 'text-red-400'}>
                        {isReady ? 'Ready' : 'Loading'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color Count:</span>
                      <span className="text-blue-400">{colors.length}</span>
                    </div>
                  </div>
                </RainbowBorder>
              </ScrollAnimated>
            </div>
          </div>
        </section>

        {/* Interactive Elements Showcase */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimated animationType="slideRight">
              <h2 className="text-4xl font-bold mb-12 text-center">
                <RainbowText disabled={!animationsEnabled}>Interactive Elements</RainbowText>
              </h2>
            </ScrollAnimated>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <ScrollAnimated 
                  key={item} 
                  animationType="scaleIn" 
                  delay={item * 0.1}
                  disabled={!animationsEnabled}
                >
                  <InteractiveElement
                    className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-2xl font-bold relative overflow-hidden"
                    onHover={(isHovered) => {
                      // Custom hover logic can be added here
                    }}
                    onClick={() => {
                      console.log(`Element ${item} clicked`);
                    }}
                    disabled={!animationsEnabled}
                  >
                    <RainbowText as="span" disabled={!animationsEnabled}>
                      {item}
                    </RainbowText>
                  </InteractiveElement>
                </ScrollAnimated>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <ParallaxScroll speed={0.3} direction="up" disabled={!animationsEnabled}>
            <div className="absolute inset-0 opacity-10">
              <RainbowBackground intensity="low" disabled={!animationsEnabled} />
            </div>
          </ParallaxScroll>

          <div className="relative z-10 max-w-6xl mx-auto">
            <ScrollAnimated animationType="fadeIn">
              <h2 className="text-4xl font-bold mb-12 text-center">
                <RainbowText disabled={!animationsEnabled}>Parallax Scrolling</RainbowText>
              </h2>
            </ScrollAnimated>

            <div className="grid md:grid-cols-3 gap-8">
              <ParallaxScroll speed={0.2} direction="up" disabled={!animationsEnabled}>
                <ScrollAnimated animationType="slideUp" delay={0.2}>
                  <div className="bg-gray-800 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">
                      <RainbowText disabled={!animationsEnabled}>Slow Motion</RainbowText>
                    </h3>
                    <p className="text-gray-300">
                      This element moves slowly as you scroll, creating a depth effect.
                    </p>
                  </div>
                </ScrollAnimated>
              </ParallaxScroll>

              <ParallaxScroll speed={0.5} direction="down" disabled={!animationsEnabled}>
                <ScrollAnimated animationType="slideUp" delay={0.4}>
                  <div className="bg-gray-800 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">
                      <RainbowText disabled={!animationsEnabled}>Normal Speed</RainbowText>
                    </h3>
                    <p className="text-gray-300">
                      This element moves at normal speed, providing a balanced parallax effect.
                    </p>
                  </div>
                </ScrollAnimated>
              </ParallaxScroll>

              <ParallaxScroll speed={0.8} direction="up" disabled={!animationsEnabled}>
                <ScrollAnimated animationType="slideUp" delay={0.6}>
                  <div className="bg-gray-800 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">
                      <RainbowText disabled={!animationsEnabled}>Fast Motion</RainbowText>
                    </h3>
                    <p className="text-gray-300">
                      This element moves quickly, creating dynamic movement as you scroll.
                    </p>
                  </div>
                </ScrollAnimated>
              </ParallaxScroll>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimated animationType="fadeIn">
              <h2 className="text-4xl font-bold mb-12 text-center">
                <RainbowText disabled={!animationsEnabled}>Engine Features</RainbowText>
              </h2>
            </ScrollAnimated>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Dynamic Color Cycling",
                  description: "Real-time color interpolation with CSS Houdini support and fallbacks",
                  icon: "🌈"
                },
                {
                  title: "Performance Optimization",
                  description: "GPU acceleration, RAF management, and battery awareness",
                  icon: "⚡"
                },
                {
                  title: "Scroll Effects",
                  description: "Intersection Observer with velocity and direction tracking",
                  icon: "📜"
                },
                {
                  title: "User Interactions",
                  description: "Mouse tracking, touch support, and ripple effects",
                  icon: "👆"
                },
                {
                  title: "Accessibility First",
                  description: "Reduced motion support and graceful degradation",
                  icon: "♿"
                },
                {
                  title: "TypeScript Ready",
                  description: "Full type safety and IntelliSense support",
                  icon: "🔷"
                }
              ].map((feature, index) => (
                <ScrollAnimated 
                  key={index} 
                  animationType="slideUp" 
                  delay={index * 0.1}
                  disabled={!animationsEnabled}
                >
                  <RainbowBorder 
                    className="h-full p-6 bg-gray-700 rounded-xl"
                    disabled={!animationsEnabled}
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3">
                      <RainbowText disabled={!animationsEnabled}>
                        {feature.title}
                      </RainbowText>
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </RainbowBorder>
                </ScrollAnimated>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4">
          <RainbowBackground 
            intensity="medium" 
            speed="slow"
            className="py-8"
            disabled={!animationsEnabled}
          >
            <div className="max-w-6xl mx-auto text-center">
              <ScrollAnimated animationType="fadeIn">
                <RainbowText 
                  as="h3" 
                  className="text-2xl font-bold mb-4"
                  disabled={!animationsEnabled}
                >
                  WINDSURF ENGINE
                </RainbowText>
                <p className="text-gray-200">
                  Next-generation animation system for modern web applications
                </p>
              </ScrollAnimated>
            </div>
          </RainbowBackground>
        </footer>
      </div>
    </PerformanceContainer>
  );
}