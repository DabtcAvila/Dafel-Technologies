'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const DafelLogo = ({ className = "", style = {} }) => (
  <svg width="400" height="240" viewBox="0 0 264.58 158.75" className={`w-full h-auto ${className}`} style={style}>
    <defs>
      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="neon-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <g id="curva-gris-completa" filter="url(#neon-glow)">
      <path id="curva-gris-grande" transform="translate(-13.827 16.81)" d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" fill="#00ffff" stroke="#00ffff" strokeWidth="0.5"/>
      <path id="curva-gris-pequena" transform="translate(-13.827 16.81)" d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" fill="#00ffff" stroke="#00ffff" strokeWidth="0.5"/>
      <ellipse id="curva-gris-circulo" transform="translate(-13.827 16.81)" cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" fill="#00ffff" stroke="#00ffff" strokeWidth="0.5"/>
    </g>
    
    <g id="curva-azul-completa" transform="translate(-56.555 18.389)" filter="url(#neon-glow-strong)">
      <path id="curva-azul-grande" transform="translate(27.41 -13.531)" d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" fill="#ff0080" stroke="#ff0080" strokeWidth="0.8"/>
      <path id="curva-azul-pequena" transform="translate(27.41 -13.531)" d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" fill="#ff0080" stroke="#ff0080" strokeWidth="0.8"/>
      <ellipse id="curva-azul-circulo" transform="translate(27.41 -13.531)" cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" fill="#ff0080" stroke="#ff0080" strokeWidth="0.8"/>
    </g>
    
    <path id="texto-dafel" d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z" 
      fill="#ffffff" stroke="#ffffff" strokeWidth="0.3" filter="url(#neon-glow)"/>
      
    <text transform="scale(1.0099 .99024)" x="21.478451" y="125.46717" fill="#00ff80" fontSize="20.663" fontFamily="'Bangla MN'" filter="url(#neon-glow)">
      <tspan x="21.478451" y="125.46717">Consulting Services</tspan>
    </text>
  </svg>
)

export default function SV05Page() {
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 4)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      <style jsx>{`
        .cyberpunk-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
        }
        
        .neon-glow {
          filter: drop-shadow(0 0 5px currentColor) 
                   drop-shadow(0 0 10px currentColor) 
                   drop-shadow(0 0 15px currentColor);
        }
        
        .neon-glow-strong {
          filter: drop-shadow(0 0 10px currentColor) 
                   drop-shadow(0 0 20px currentColor) 
                   drop-shadow(0 0 30px currentColor)
                   drop-shadow(0 0 40px currentColor);
        }
        
        .cyberpunk-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(45deg, transparent 48%, rgba(255, 0, 128, 0.1) 49%, rgba(255, 0, 128, 0.1) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(0, 255, 255, 0.1) 49%, rgba(0, 255, 255, 0.1) 51%, transparent 52%);
          background-size: 200px 200px;
          animation: cyber-lines 8s linear infinite;
        }
        
        @keyframes cyber-lines {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 200px 200px, -200px 200px; }
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #00ffff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ffff;
        }
      `}</style>
      
      {/* Cyberpunk grid background */}
      <div className="cyberpunk-grid" />
      
      {/* Animated cyberpunk lines */}
      <div className="cyberpunk-lines" />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
        />
      ))}
      
      <motion.div 
        className="relative w-96 h-64 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Main glowing logo */}
        <motion.div
          animate={{
            filter: [
              'drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 40px #ff0080)',
              'drop-shadow(0 0 30px #ff0080) drop-shadow(0 0 50px #00ffff)',
              'drop-shadow(0 0 25px #00ff80) drop-shadow(0 0 45px #ff0080)',
              'drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 40px #ff0080)'
            ]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DafelLogo />
        </motion.div>
        
        {/* Pulsing background layers */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            scale: pulsePhase === 0 ? [1, 1.05, 1] : 1,
            opacity: pulsePhase === 0 ? [0.3, 0.6, 0.3] : 0.3
          }}
          transition={{ duration: 1 }}
        >
          <DafelLogo 
            style={{ 
              filter: 'blur(2px) drop-shadow(0 0 30px #00ffff)',
              transform: 'scale(1.02)'
            }} 
          />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            scale: pulsePhase === 1 ? [1, 1.08, 1] : 1,
            opacity: pulsePhase === 1 ? [0.2, 0.5, 0.2] : 0.2
          }}
          transition={{ duration: 1 }}
        >
          <DafelLogo 
            style={{ 
              filter: 'blur(4px) drop-shadow(0 0 40px #ff0080)',
              transform: 'scale(1.04)'
            }} 
          />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 opacity-15"
          animate={{
            scale: pulsePhase === 2 ? [1, 1.1, 1] : 1,
            opacity: pulsePhase === 2 ? [0.15, 0.4, 0.15] : 0.15
          }}
          transition={{ duration: 1 }}
        >
          <DafelLogo 
            style={{ 
              filter: 'blur(6px) drop-shadow(0 0 50px #00ff80)',
              transform: 'scale(1.06)'
            }} 
          />
        </motion.div>
        
        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.3) 45%, rgba(0,255,255,0.8) 50%, rgba(0,255,255,0.3) 55%, transparent 100%)',
              'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.3) 45%, rgba(0,255,255,0.8) 50%, rgba(0,255,255,0.3) 55%, transparent 100%)'
            ],
            backgroundPosition: ['-100% 0', '200% 0']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400 neon-glow" style={{ color: '#00ffff' }} />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-pink-400 neon-glow" style={{ color: '#ff0080' }} />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-green-400 neon-glow" style={{ color: '#00ff80' }} />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400 neon-glow" style={{ color: '#00ffff' }} />
      </motion.div>
    </div>
  )
}