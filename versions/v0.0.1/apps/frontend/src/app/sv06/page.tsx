'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

const DafelLogo = ({ className = "" }) => (
  <svg width="400" height="240" viewBox="0 0 264.58 158.75" className={`w-full h-auto ${className}`}>
    <g id="curva-gris-completa">
      <motion.path 
        id="curva-gris-grande" 
        transform="translate(-13.827 16.81)" 
        d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
        fill="#eaeaea"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path 
        id="curva-gris-pequena" 
        transform="translate(-13.827 16.81)" 
        d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
        fill="#eaeaea"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
      />
      <motion.ellipse 
        id="curva-gris-circulo" 
        transform="translate(-13.827 16.81)" 
        cx="212.5" 
        cy="42.875" 
        rx="5.5644" 
        ry="4.5354" 
        fill="#eaeaea"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
      />
    </g>
    <g id="curva-azul-completa" transform="translate(-56.555 18.389)">
      <motion.path 
        id="curva-azul-grande" 
        transform="translate(27.41 -13.531)" 
        d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z" 
        fill="#a7c9ea"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
      />
      <motion.path 
        id="curva-azul-pequena" 
        transform="translate(27.41 -13.531)" 
        d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z" 
        fill="#a7c9ea"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1.1, ease: "easeInOut" }}
      />
      <motion.ellipse 
        id="curva-azul-circulo" 
        transform="translate(27.41 -13.531)" 
        cx="212.5" 
        cy="42.875" 
        rx="5.5644" 
        ry="4.5354" 
        fill="#a7c9ea"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 1.4, type: "spring", stiffness: 300, damping: 20 }}
      />
    </g>
    <motion.path 
      id="texto-dafel" 
      d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z" 
      fill="#241f1f"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, delay: 1.8, ease: "easeInOut" }}
    />
    <motion.text 
      transform="scale(1.0099 .99024)" 
      x="21.478451" 
      y="125.46717" 
      fill="#666666" 
      fontSize="20.663" 
      fontFamily="'Bangla MN'"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2.5, type: "spring", stiffness: 200, damping: 20 }}
    >
      <tspan x="21.478451" y="125.46717">Consulting Services</tspan>
    </motion.text>
  </svg>
)

const BouncingElement = ({ children, delay = 0, duration = 2 }) => {
  return (
    <motion.div
      initial={{ y: -100, scale: 0.5, rotate: -180 }}
      animate={{ 
        y: 0, 
        scale: 1, 
        rotate: 0,
      }}
      transition={{
        delay,
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 1,
        duration
      }}
    >
      {children}
    </motion.div>
  )
}

export default function SV06Page() {
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const mainControls = useAnimation()

  const handleClick = () => {
    setClickCount(prev => prev + 1)
    
    // Elastic bounce animation
    mainControls.start({
      scale: [1, 1.3, 0.9, 1.1, 1],
      rotate: [0, 5, -5, 2, 0],
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Auto bounce every 5 seconds
      mainControls.start({
        y: [0, -20, 0],
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [mainControls])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center overflow-hidden relative">
      <style jsx>{`
        .elastic-bg {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: elastic-pulse 4s ease-in-out infinite;
        }
        
        @keyframes elastic-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(2deg); }
        }
        
        .bounce-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #666;
          font-size: 14px;
          animation: bounce-hint 2s ease-in-out infinite;
        }
        
        @keyframes bounce-hint {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-10px); }
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: ripple-effect 1s ease-out;
          pointer-events: none;
        }
        
        @keyframes ripple-effect {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Elastic background */}
      <div className="elastic-bg" />
      
      {/* Floating elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-blue-400 rounded-full opacity-20"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        />
      ))}
      
      <motion.div 
        className="relative w-96 h-64 cursor-pointer"
        animate={mainControls}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        whileTap={{
          scale: 0.95,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        }}
      >
        {/* Main logo with staggered bounce entrance */}
        <BouncingElement delay={0.5} duration={2}>
          <DafelLogo />
        </BouncingElement>
        
        {/* Bouncing shadow */}
        <motion.div
          className="absolute inset-0 opacity-30 blur-sm"
          initial={{ y: 100, scale: 0.8 }}
          animate={{ y: 10, scale: 0.9 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 2
          }}
        >
          <DafelLogo className="filter blur-sm opacity-50" />
        </motion.div>
        
        {/* Elastic hover effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            scale: isHovered ? 1.02 : 1,
            opacity: isHovered ? 0.3 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className="w-full h-full rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 blur-xl" />
        </motion.div>
        
        {/* Bounce particles on click */}
        {clickCount > 0 && [...Array(6)].map((_, i) => (
          <motion.div
            key={`${clickCount}-${i}`}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos(i * 60 * Math.PI / 180) * 100,
              y: Math.sin(i * 60 * Math.PI / 180) * 100,
            }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          />
        ))}
        
        {/* Jello effect on hover */}
        <motion.div
          className="absolute inset-0"
          animate={isHovered ? {
            scaleX: [1, 1.1, 0.9, 1.05, 1],
            scaleY: [1, 0.9, 1.1, 0.95, 1]
          } : {}}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Corner springs */}
      {[
        { corner: 'top-left', x: '10%', y: '10%' },
        { corner: 'top-right', x: '90%', y: '10%' },
        { corner: 'bottom-left', x: '10%', y: '90%' },
        { corner: 'bottom-right', x: '90%', y: '90%' }
      ].map((corner, i) => (
        <motion.div
          key={corner.corner}
          className="absolute w-6 h-6 bg-blue-400 rounded-full"
          style={{ left: corner.x, top: corner.y }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        />
      ))}
      
      {/* Bounce hint */}
      <div className="bounce-indicator">
        Click for elastic bounce effect
      </div>
    </div>
  )
}