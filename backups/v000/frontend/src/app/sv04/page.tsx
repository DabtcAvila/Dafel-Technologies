'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const DafelLogo = () => (
  <svg width="400" height="240" viewBox="0 0 264.58 158.75" className="w-full h-auto">
    <g id="curva-gris-completa">
      <path id="curva-gris-grande" transform="translate(-13.827 16.81)" d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" fill="#eaeaea"/>
      <path id="curva-gris-pequena" transform="translate(-13.827 16.81)" d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" fill="#eaeaea"/>
      <ellipse id="curva-gris-circulo" transform="translate(-13.827 16.81)" cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" fill="#eaeaea"/>
    </g>
    <g id="curva-azul-completa" transform="translate(-56.555 18.389)">
      <path id="curva-azul-grande" transform="translate(27.41 -13.531)" d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" fill="#a7c9ea"/>
      <path id="curva-azul-pequena" transform="translate(27.41 -13.531)" d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" fill="#a7c9ea"/>
      <ellipse id="curva-azul-circulo" transform="translate(27.41 -13.531)" cx="212.5" cy="42.875" rx="5.5644" ry="4.5354" fill="#a7c9ea"/>
    </g>
    <path id="texto-dafel" d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z" fill="#241f1f"/>
    <text transform="scale(1.0099 .99024)" x="21.478451" y="125.46717" fill="#666666" fontSize="20.663" fontFamily="'Bangla MN'">
      <tspan x="21.478451" y="125.46717">Consulting Services</tspan>
    </text>
  </svg>
)

export default function SV04Page() {
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <style jsx>{`
        .glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-active .glitch-layer:nth-child(1) {
          animation: glitch-1 0.2s ease-in-out;
          clip-path: polygon(0 0%, 100% 0%, 100% 20%, 0 20%);
        }
        
        .glitch-active .glitch-layer:nth-child(2) {
          animation: glitch-2 0.2s ease-in-out;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
        }
        
        .glitch-active .glitch-layer:nth-child(3) {
          animation: glitch-3 0.2s ease-in-out;
          clip-path: polygon(0 40%, 100% 40%, 100% 80%, 0 80%);
        }
        
        .glitch-active .glitch-layer:nth-child(4) {
          animation: glitch-4 0.2s ease-in-out;
          clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%);
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(3px); }
          40% { transform: translateX(-2px); }
          60% { transform: translateX(4px); }
          80% { transform: translateX(-1px); }
        }
        
        @keyframes glitch-3 {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(1px); }
        }
        
        @keyframes glitch-4 {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(4px); }
          40% { transform: translateX(-3px); }
          60% { transform: translateX(2px); }
          80% { transform: translateX(-5px); }
        }
        
        .digital-noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(90deg, transparent 98%, rgba(255,0,0,0.03) 100%),
            linear-gradient(90deg, transparent 98%, rgba(0,255,0,0.03) 100%),
            linear-gradient(90deg, transparent 98%, rgba(0,0,255,0.03) 100%);
          background-size: 3px 100%, 4px 100%, 5px 100%;
          mix-blend-mode: screen;
          opacity: 0.7;
        }
        
        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          );
          pointer-events: none;
        }
      `}</style>
      
      <motion.div 
        className={`relative w-96 h-64 ${glitchActive ? 'glitch-active' : ''}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Scanlines overlay */}
        <div className="scanlines" />
        
        {/* Digital noise overlay */}
        <div className="digital-noise" />
        
        {/* Main logo */}
        <motion.div
          animate={{
            filter: glitchActive ? [
              'hue-rotate(0deg) saturate(1)',
              'hue-rotate(90deg) saturate(1.5)',
              'hue-rotate(180deg) saturate(0.8)',
              'hue-rotate(270deg) saturate(1.2)',
              'hue-rotate(0deg) saturate(1)'
            ] : 'hue-rotate(0deg) saturate(1)'
          }}
          transition={{ duration: 0.2 }}
        >
          <DafelLogo />
        </motion.div>
        
        {/* Glitch layers */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glitch-layer">
            <motion.div
              style={{
                filter: `hue-rotate(${i * 90}deg) saturate(${1 + i * 0.2})`
              }}
            >
              <DafelLogo />
            </motion.div>
          </div>
        ))}
        
        {/* Static overlay for extra digital effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: glitchActive ? [0, 0.1, 0, 0.05, 0] : 0
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: `
              radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px, 30px 30px'
          }}
        />
      </motion.div>
    </div>
  )
}