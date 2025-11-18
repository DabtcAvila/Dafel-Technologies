'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SV11Page() {
  const [magneticField, setMagneticField] = useState({ strength: 1, rotation: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    // Set initial window size
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    const interval = setInterval(() => {
      setMagneticField(prev => ({
        strength: 0.5 + Math.sin(Date.now() * 0.001) * 0.5,
        rotation: (prev.rotation + 1) % 360
      }));
    }, 50);

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => clearInterval(interval);
  }, []);

  // Generate magnetic field lines
  const fieldLines = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360;
    const radius = 100 + i * 15;
    return { angle, radius, id: i };
  });

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Electromagnetic Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="electromagnetic" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="#3b82f6" opacity="0.5"/>
              <path d="M0 30 Q15 15 30 30 Q45 45 60 30" stroke="#06b6d4" strokeWidth="0.5" fill="none"/>
              <path d="M30 0 Q45 15 30 30 Q15 45 30 60" stroke="#06b6d4" strokeWidth="0.5" fill="none"/>
            </pattern>
            
            <radialGradient id="magneticGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
              <stop offset="70%" stopColor="#1e40af" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#electromagnetic)"/>
        </svg>
      </div>

      {/* Magnetic Field Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        {fieldLines.map((line) => (
          <motion.div
            key={line.id}
            className="absolute"
            style={{
              width: line.radius * 2,
              height: line.radius * 2,
            }}
            animate={{
              rotate: magneticField.rotation + line.angle,
              scale: magneticField.strength
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          >
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <defs>
                <linearGradient id={`fieldGradient${line.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0"/>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <ellipse
                cx="50%"
                cy="50%"
                rx={line.radius}
                ry={line.radius * 0.3}
                fill="none"
                stroke={`url(#fieldGradient${line.id})`}
                strokeWidth="2"
                opacity={1 - line.id * 0.04}
              />
              {/* Force direction arrows */}
              <polygon
                points={`${line.radius * 1.5},${line.radius * 0.3} ${line.radius * 1.7},${line.radius * 0.3} ${line.radius * 1.6},${line.radius * 0.4}`}
                fill="#06b6d4"
                opacity="0.6"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Electromagnetic Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? '#ef4444' : '#3b82f6',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#ef4444' : '#3b82f6'}`
            }}
            animate={{
              x: [
                Math.cos(i * 0.2) * 200 + windowSize.width / 2,
                Math.cos(i * 0.2 + Math.PI) * 200 + windowSize.width / 2
              ],
              y: [
                Math.sin(i * 0.2) * 200 + windowSize.height / 2,
                Math.sin(i * 0.2 + Math.PI) * 200 + windowSize.height / 2
              ]
            }}
            transition={{
              duration: 4 + i * 0.1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Central Logo */}
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="relative z-10"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
        >
          {/* Magnetic Core Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, #3b82f6 0%, #1e40af 30%, transparent 70%)',
              filter: 'blur(30px)',
              transform: 'scale(2)'
            }}
            animate={{
              scale: [2, 2.5, 2],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Electromagnetic Pulse Rings */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-blue-400 rounded-full"
              style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
              animate={{
                scale: [1, 3],
                opacity: [1, 0],
                borderWidth: [2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Logo with Magnetic Distortion */}
          <motion.div
            className="relative p-8"
            animate={{
              filter: [
                'brightness(1) contrast(1) hue-rotate(0deg)',
                'brightness(1.3) contrast(1.2) hue-rotate(20deg)',
                'brightness(1) contrast(1) hue-rotate(0deg)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg 
              width="350" 
              height="210" 
              viewBox="0 0 264.58 158.75"
              className="filter drop-shadow-2xl"
            >
              <defs>
                {/* Magnetic Field Gradient */}
                <radialGradient id="magnetic" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="1"/>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.6"/>
                </radialGradient>

                {/* Electric Charge Effect */}
                <filter id="electric">
                  <feGaussianBlur stdDeviation="1" result="blur"/>
                  <feColorMatrix 
                    values="1 0 0 0 0  0 1 0 0 0  0 0 2 0 0  0 0 0 1 0" 
                    result="electric"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="electric"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                {/* Magnetic Distortion */}
                <filter id="magneticDistort">
                  <feTurbulence baseFrequency="0.01" numOctaves="3" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="5"/>
                </filter>
              </defs>

              {/* Gray curves with magnetic effect */}
              <g transform="translate(-13.827 16.81)" filter="url(#electric)">
                <path d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
                      fill="url(#magnetic)" opacity="0.7"/>
                <path d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
                      fill="url(#magnetic)" opacity="0.7"/>
                <ellipse cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" 
                         fill="url(#magnetic)" opacity="0.7"/>
              </g>

              {/* Blue curves with electromagnetic effect */}
              <g transform="translate(-56.555 18.389)" filter="url(#magneticDistort)">
                <path d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
                      fill="#60a5fa" opacity="0.9" transform="translate(27.41 -13.531)"/>
                <path d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
                      fill="#60a5fa" opacity="0.9" transform="translate(27.41 -13.531)"/>
                <ellipse cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" 
                         fill="#60a5fa" opacity="0.9" transform="translate(27.41 -13.531)"/>
              </g>

              {/* DAFEL text with electric charge */}
              <path d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z" 
                    fill="#e0f2fe" 
                    filter="url(#electric)"
                    stroke="#3b82f6" 
                    strokeWidth="0.5"/>

              {/* Consulting text */}
              <text x="21.5" y="125.5" 
                    fill="#bfdbfe" 
                    fontSize="20.663" 
                    fontFamily="Bangla MN"
                    filter="url(#electric)">
                Consulting Services
              </text>
            </svg>
          </motion.div>

          {/* Electric Arcs */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <path
                d="M 50% 20% Q 70% 30%, 80% 50% Q 70% 70%, 50% 80% Q 30% 70%, 20% 50% Q 30% 30%, 50% 20%"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                opacity="0.6"
                filter="url(#electric)"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-500">
          SV11 - Electromagnetic Forces
        </h1>
      </motion.div>
    </div>
  );
}