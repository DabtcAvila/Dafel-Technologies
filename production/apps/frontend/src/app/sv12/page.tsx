'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SV12Page() {
  const [dnaRotation, setDnaRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDnaRotation(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate DNA base pairs
  const basePairs = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    y: i * 20,
    rotation: (i * 36) % 360, // 10 base pairs per turn
    baseType: ['A', 'T', 'G', 'C'][i % 4]
  }));

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return '#ef4444'; // Red
      case 'T': return '#3b82f6'; // Blue  
      case 'G': return '#10b981'; // Green
      case 'C': return '#f59e0b'; // Orange
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-950 via-emerald-950 to-blue-950">
      {/* Cellular Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cellular" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="20" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
              <circle cx="40" cy="40" r="10" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="40" cy="40" r="3" fill="#ef4444" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cellular)"/>
        </svg>
      </div>

      {/* Genetic Code Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs font-mono opacity-30"
            style={{
              color: getBaseColor(['A', 'T', 'G', 'C'][i % 4]),
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.3, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            {['A', 'T', 'G', 'C'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* DNA Double Helix Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          style={{
            width: '800px',
            height: '600px'
          }}
          animate={{ rotateZ: dnaRotation }}
          transition={{ duration: 0.1, ease: "linear" }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="helixGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3"/>
              </linearGradient>
              <linearGradient id="helixGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            
            {/* Left DNA strand */}
            <path
              d={`M 200 50 ${basePairs.map((bp, i) => 
                `Q ${200 + Math.cos((bp.rotation + dnaRotation) * Math.PI / 180) * 100} ${bp.y + 50} ${200 + Math.cos((bp.rotation + dnaRotation + 180) * Math.PI / 180) * 100} ${bp.y + 70}`
              ).join(' Q ')}`}
              fill="none"
              stroke="url(#helixGradient1)"
              strokeWidth="4"
              opacity="0.7"
            />
            
            {/* Right DNA strand */}
            <path
              d={`M 600 50 ${basePairs.map((bp, i) => 
                `Q ${600 + Math.cos((bp.rotation + dnaRotation + 180) * Math.PI / 180) * 100} ${bp.y + 50} ${600 + Math.cos((bp.rotation + dnaRotation) * Math.PI / 180) * 100} ${bp.y + 70}`
              ).join(' Q ')}`}
              fill="none"
              stroke="url(#helixGradient2)"
              strokeWidth="4"
              opacity="0.7"
            />

            {/* Base pair connections */}
            {basePairs.map((bp) => (
              <g key={bp.id}>
                <line
                  x1={200 + Math.cos((bp.rotation + dnaRotation) * Math.PI / 180) * 100}
                  y1={bp.y + 60}
                  x2={600 + Math.cos((bp.rotation + dnaRotation + 180) * Math.PI / 180) * 100}
                  y2={bp.y + 60}
                  stroke={getBaseColor(bp.baseType)}
                  strokeWidth="2"
                  opacity="0.4"
                />
                <circle
                  cx={200 + Math.cos((bp.rotation + dnaRotation) * Math.PI / 180) * 100}
                  cy={bp.y + 60}
                  r="4"
                  fill={getBaseColor(bp.baseType)}
                  opacity="0.8"
                />
                <circle
                  cx={600 + Math.cos((bp.rotation + dnaRotation + 180) * Math.PI / 180) * 100}
                  cy={bp.y + 60}
                  r="4"
                  fill={getBaseColor(['T', 'A', 'C', 'G'][['A', 'T', 'G', 'C'].indexOf(bp.baseType)])}
                  opacity="0.8"
                />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Central Logo */}
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="relative z-20"
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 2, type: "spring" }}
        >
          {/* Genetic Aura */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                from 0deg,
                #ef444480, #f59e0b80, #10b98180, #3b82f680,
                #ef444480
              )`,
              filter: 'blur(25px)',
              transform: 'scale(1.8)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* DNA Spiral Orbits */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                border: '2px solid',
                borderColor: getBaseColor(['A', 'G', 'C'][i]),
                borderRadius: '50%',
                transform: `scale(${1.2 + i * 0.3})`
              }}
              animate={{
                rotate: 360,
                borderColor: [
                  getBaseColor(['A', 'G', 'C'][i]),
                  getBaseColor(['T', 'C', 'G'][i]),
                  getBaseColor(['G', 'A', 'T'][i]),
                  getBaseColor(['A', 'G', 'C'][i])
                ]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Logo with Genetic Enhancement */}
          <motion.div
            className="relative p-8"
            animate={{
              filter: [
                'brightness(1) saturate(1) hue-rotate(0deg)',
                'brightness(1.2) saturate(1.3) hue-rotate(10deg)',
                'brightness(1.1) saturate(1.1) hue-rotate(-5deg)',
                'brightness(1) saturate(1) hue-rotate(0deg)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <svg 
              width="350" 
              height="210" 
              viewBox="0 0 264.58 158.75"
              className="filter drop-shadow-2xl"
            >
              <defs>
                {/* Genetic Gradient */}
                <linearGradient id="genetic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9">
                    <animate attributeName="stop-color" 
                      values="#10b981;#3b82f6;#ef4444;#f59e0b;#10b981" 
                      dur="4s" 
                      repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7">
                    <animate attributeName="stop-color" 
                      values="#3b82f6;#ef4444;#f59e0b;#10b981;#3b82f6" 
                      dur="4s" 
                      repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9">
                    <animate attributeName="stop-color" 
                      values="#ef4444;#f59e0b;#10b981;#3b82f6;#ef4444" 
                      dur="4s" 
                      repeatCount="indefinite" />
                  </stop>
                </linearGradient>

                {/* Genetic Code Filter */}
                <filter id="geneticGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feColorMatrix 
                    values="1 0 0 0 0  0 1.2 0 0 0  0 0 1.5 0 0  0 0 0 1 0" 
                    result="genetic"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="genetic"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                {/* DNA Pattern */}
                <pattern id="dnaPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="5" r="2" fill="#10b981" opacity="0.3"/>
                  <circle cx="10" cy="15" r="2" fill="#ef4444" opacity="0.3"/>
                  <line x1="10" y1="5" x2="10" y2="15" stroke="#3b82f6" strokeWidth="1" opacity="0.2"/>
                </pattern>
              </defs>

              {/* Gray curves with genetic pattern */}
              <g transform="translate(-13.827 16.81)">
                <path d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
                      fill="url(#dnaPattern)" 
                      opacity="0.6"
                      filter="url(#geneticGlow)"/>
                <path d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
                      fill="url(#dnaPattern)" 
                      opacity="0.6"
                      filter="url(#geneticGlow)"/>
                <ellipse cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" 
                         fill="url(#dnaPattern)" 
                         opacity="0.6"
                         filter="url(#geneticGlow)"/>
              </g>

              {/* Blue curves with genetic enhancement */}
              <g transform="translate(-56.555 18.389)">
                <path d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
                      fill="url(#genetic)" 
                      opacity="0.8"
                      transform="translate(27.41 -13.531)"
                      filter="url(#geneticGlow)"/>
                <path d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
                      fill="url(#genetic)" 
                      opacity="0.8"
                      transform="translate(27.41 -13.531)"
                      filter="url(#geneticGlow)"/>
                <ellipse cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" 
                         fill="url(#genetic)" 
                         opacity="0.8"
                         transform="translate(27.41 -13.531)"
                         filter="url(#geneticGlow)"/>
              </g>

              {/* DAFEL text with genetic code */}
              <path d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z" 
                    fill="url(#genetic)" 
                    filter="url(#geneticGlow)"
                    stroke="#10b981" 
                    strokeWidth="0.3"/>

              {/* Consulting text */}
              <text x="21.5" y="125.5" 
                    fill="url(#genetic)" 
                    fontSize="20.663" 
                    fontFamily="Bangla MN"
                    filter="url(#geneticGlow)">
                Consulting Services
              </text>
            </svg>
          </motion.div>

          {/* Genetic Sequence Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            {['A', 'T', 'G', 'C'].map((base, i) => (
              <motion.div
                key={base}
                className="absolute text-lg font-mono font-bold"
                style={{
                  color: getBaseColor(base),
                  left: `${50 + Math.cos(i * Math.PI / 2) * 40}%`,
                  top: `${50 + Math.sin(i * Math.PI / 2) * 40}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                {base}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-red-500">
          SV12 - Genetic Evolution
        </h1>
      </motion.div>
    </div>
  );
}