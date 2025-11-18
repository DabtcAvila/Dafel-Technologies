'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SV10Page() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    // Set initial window size
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      {/* Holographic Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, 
              rgba(147, 51, 234, 0.4) 0%, 
              rgba(59, 130, 246, 0.3) 25%, 
              rgba(16, 185, 129, 0.3) 50%, 
              rgba(245, 101, 101, 0.2) 75%, 
              transparent 100%
            )
          `
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              opacity: Math.random()
            }}
            animate={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="cyan" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Center Container */}
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, type: "spring" }}
        >
          {/* Holographic Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                from 0deg,
                #ff0080, #ff8c00, #40ff00, #00ff80, 
                #0080ff, #8000ff, #ff0080
              )`,
              filter: 'blur(20px)',
              transform: 'scale(1.5)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Logo Container with Holographic Effects */}
          <motion.div
            className="relative z-10 p-8"
            animate={{
              filter: [
                'hue-rotate(0deg) saturate(1.5) brightness(1.2)',
                'hue-rotate(60deg) saturate(2) brightness(1.5)',
                'hue-rotate(120deg) saturate(1.8) brightness(1.3)',
                'hue-rotate(180deg) saturate(2.2) brightness(1.6)',
                'hue-rotate(240deg) saturate(1.6) brightness(1.1)',
                'hue-rotate(300deg) saturate(1.9) brightness(1.4)',
                'hue-rotate(360deg) saturate(1.5) brightness(1.2)'
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <svg 
              width="400" 
              height="240" 
              viewBox="0 0 264.58 158.75" 
              className="drop-shadow-2xl"
            >
              <defs>
                {/* Holographic Gradient */}
                <linearGradient id="holographic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.8">
                    <animate attributeName="stop-color" 
                      values="#ff00ff;#00ffff;#ffff00;#ff00ff" 
                      dur="3s" 
                      repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#00ffff" stopOpacity="0.9">
                    <animate attributeName="stop-color" 
                      values="#00ffff;#ffff00;#ff00ff;#00ffff" 
                      dur="3s" 
                      repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#ffff00" stopOpacity="0.8">
                    <animate attributeName="stop-color" 
                      values="#ffff00;#ff00ff;#00ffff;#ffff00" 
                      dur="3s" 
                      repeatCount="indefinite" />
                  </stop>
                </linearGradient>

                {/* Iridescent Filter */}
                <filter id="iridescent">
                  <feColorMatrix type="hueRotate" values="0">
                    <animate attributeName="values" 
                      values="0;360;0" 
                      dur="4s" 
                      repeatCount="indefinite" />
                  </feColorMatrix>
                  <feGaussianBlur stdDeviation="0.5"/>
                </filter>

                {/* Holographic Shine */}
                <filter id="shine">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Gray Curves with Holographic Effect */}
              <g filter="url(#shine)">
                <path d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
                      fill="url(#holographic)" 
                      opacity="0.7"
                      transform="translate(-13.827 16.81)" />
                <path d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
                      fill="url(#holographic)" 
                      opacity="0.7"
                      transform="translate(-13.827 16.81)" />
                <ellipse cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" 
                         fill="url(#holographic)" 
                         opacity="0.7"
                         transform="translate(-13.827 16.81)" />
              </g>

              {/* Blue Curves with Iridescent Effect */}
              <g filter="url(#iridescent)" transform="translate(-56.555 18.389)">
                <path d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
                      fill="#00ffff" 
                      opacity="0.8"
                      transform="translate(27.41 -13.531)" />
                <path d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
                      fill="#00ffff" 
                      opacity="0.8"
                      transform="translate(27.41 -13.531)" />
                <ellipse cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" 
                         fill="#00ffff" 
                         opacity="0.8"
                         transform="translate(27.41 -13.531)" />
              </g>

              {/* DAFEL Text with Holographic Effect */}
              <path d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z" 
                    fill="url(#holographic)" 
                    filter="url(#shine)" />

              {/* Consulting Text */}
              <text x="21.5" y="125.5" 
                    fill="url(#holographic)" 
                    fontSize="20.663" 
                    fontFamily="Bangla MN"
                    filter="url(#iridescent)">
                Consulting Services
              </text>
            </svg>
          </motion.div>

          {/* Holographic Scan Lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.1) 2px,
                rgba(0, 255, 255, 0.1) 4px
              )`
            }}
            animate={{ x: [-100, 100] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          SV10 - Holographic Dreams
        </h1>
      </motion.div>
    </div>
  );
}