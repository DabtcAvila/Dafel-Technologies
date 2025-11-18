'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function SV02Page() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    // Generate particles for explosion effect
    const particleArray = []
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        delay: Math.random() * 2
      })
    }
    setParticles(particleArray)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Particle explosion background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            x: particle.x,
            y: particle.y,
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            delay: particle.delay + 2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        />
      ))}

      <motion.div
        className="w-96 h-64 relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 264.58 158.75" 
          className="drop-shadow-2xl"
        >
          {/* Gray curves with particle dissolve effect */}
          <motion.g>
            <motion.path
              d="m41.535 25.9205c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
              fill="#eaeaea"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: [0, 1, 0.8, 1, 0.3, 1],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(1px)",
                  "blur(0px)",
                  "blur(2px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                pathLength: { duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.path
              d="m167.403 146.63c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
              fill="#eaeaea"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: [0, 1, 0.6, 1, 0.2, 1],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(1.5px)",
                  "blur(0px)",
                  "blur(3px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                pathLength: { duration: 1.5, delay: 0.3, ease: "easeInOut" },
                opacity: { duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.ellipse
              cx="212.5"
              cy="42.875"
              rx="5.5644"
              ry="4.5354"
              fill="#eaeaea"
              transform="translate(-13.827 16.81)"
              animate={{
                scale: [1, 1.5, 0.5, 1.2, 0.8, 1],
                opacity: [1, 0.8, 0.3, 0.9, 0.4, 1],
                filter: [
                  "blur(0px)",
                  "blur(1px)",
                  "blur(3px)",
                  "blur(0.5px)",
                  "blur(2px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>

          {/* Blue curves with explosive dissolve */}
          <motion.g>
            <motion.path
              d="m82.777 4.858c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
              fill="#a7c9ea"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: [0, 1, 0.9, 0.1, 0.8, 1],
                scale: [1, 1.02, 0.98, 1.05, 0.95, 1],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(0.5px)",
                  "blur(4px)",
                  "blur(1px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                pathLength: { duration: 1.5, delay: 0.5, ease: "easeInOut" },
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.path
              d="m208.64 116.289c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
              fill="#a7c9ea"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: [0, 1, 0.7, 0.05, 0.9, 1],
                scale: [1, 1.03, 0.97, 1.08, 0.92, 1],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(1px)",
                  "blur(5px)",
                  "blur(0.8px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                pathLength: { duration: 1.5, delay: 0.8, ease: "easeInOut" },
                opacity: { duration: 5, delay: 0.3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5, delay: 0.3, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 5, delay: 0.3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.ellipse
              cx="212.5"
              cy="42.875"
              rx="5.5644"
              ry="4.5354"
              fill="#a7c9ea"
              transform="translate(27.41 -13.531)"
              animate={{
                scale: [1, 1.8, 0.2, 1.5, 0.6, 1],
                opacity: [1, 0.9, 0.1, 0.8, 0.2, 1],
                filter: [
                  "blur(0px)",
                  "blur(1.5px)",
                  "blur(4px)",
                  "blur(0.8px)",
                  "blur(2.5px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.g>

          {/* DAFEL text with explosive particle effect */}
          <motion.g>
            {/* Main text that dissolves and reforms */}
            <motion.path
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="#ffffff"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0, 1, 0.9, 0.05, 0.8, 1],
                scale: [1, 1.01, 1.05, 0.95, 1.02, 1],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(0.5px)",
                  "blur(6px)",
                  "blur(1px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                pathLength: { duration: 2, delay: 1, ease: "easeInOut" },
                opacity: { duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Particle burst from text */}
            {[...Array(20)].map((_, i) => (
              <motion.circle
                key={i}
                cx={50 + i * 8}
                cy={85}
                r="0.5"
                fill="#ffffff"
                initial={{ r: 0, opacity: 0 }}
                animate={{
                  r: [0, 2, 0],
                  opacity: [0, 1, 0],
                  cx: [50 + i * 8, 50 + i * 8 + (Math.random() - 0.5) * 100],
                  cy: [85, 85 + (Math.random() - 0.5) * 80]
                }}
                transition={{
                  duration: 2,
                  delay: 4 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 6
                }}
              />
            ))}
          </motion.g>

          {/* Consulting text with particle dissolution */}
          <motion.g>
            <motion.text
              x="21.478451"
              y="125.46717"
              fill="#888888"
              fontSize="20.663"
              fontFamily="system-ui, sans-serif"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0.8, 0.1, 0.9, 1],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(1px)",
                  "blur(4px)",
                  "blur(0.5px)",
                  "blur(0px)"
                ]
              }}
              transition={{
                opacity: { duration: 7, delay: 3, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 7, delay: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              Consulting Services
            </motion.text>

            {/* Particle burst from consulting text */}
            {[...Array(15)].map((_, i) => (
              <motion.circle
                key={`consulting-${i}`}
                cx={30 + i * 12}
                cy={125}
                r="0.3"
                fill="#888888"
                initial={{ r: 0, opacity: 0 }}
                animate={{
                  r: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                  cx: [30 + i * 12, 30 + i * 12 + (Math.random() - 0.5) * 60],
                  cy: [125, 125 + (Math.random() - 0.5) * 40]
                }}
                transition={{
                  duration: 1.5,
                  delay: 5 + i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 7
                }}
              />
            ))}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}