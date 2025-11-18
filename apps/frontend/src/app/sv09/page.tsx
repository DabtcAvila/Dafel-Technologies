'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SV09FirePlasmaAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-orange-900 to-yellow-900 flex items-center justify-center overflow-hidden relative">
      {/* Fire/Plasma Background Effect */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="plasmaGradient1" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#ff6b00" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#ff8f00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffb700" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="plasmaGradient2" cx="30%" cy="70%" r="40%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </radialGradient>
            <filter id="fireGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated Fire Shapes */}
          {[...Array(8)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx={150 + i * 130}
              cy={600}
              rx="60"
              ry="120"
              fill="url(#plasmaGradient1)"
              filter="url(#fireGlow)"
              animate={{
                ry: [120, 180, 100, 160, 120],
                rx: [60, 40, 80, 50, 60],
                cy: [600, 550, 650, 580, 600],
                opacity: [0.6, 1, 0.4, 0.8, 0.6]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
          
          {/* Plasma Energy Waves */}
          {[...Array(5)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0,${400 + i * 50} Q300,${350 + i * 30} 600,${400 + i * 50} T1200,${400 + i * 50}`}
              fill="none"
              stroke="url(#plasmaGradient2)"
              strokeWidth="3"
              opacity="0.7"
              animate={{
                d: [
                  `M0,${400 + i * 50} Q300,${350 + i * 30} 600,${400 + i * 50} T1200,${400 + i * 50}`,
                  `M0,${420 + i * 50} Q300,${380 + i * 30} 600,${420 + i * 50} T1200,${420 + i * 50}`,
                  `M0,${400 + i * 50} Q300,${350 + i * 30} 600,${400 + i * 50} T1200,${400 + i * 50}`
                ],
                opacity: [0.7, 1, 0.4, 0.7]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4
              }}
            />
          ))}
        </svg>
      </div>

      {/* Fire Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              ['#ff4500', '#ff6b00', '#ff8f00', '#ffb700', '#dc2626'][i % 5]
            } 0%, transparent 70%)`,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            opacity: 0
          }}
          animate={{
            y: -50,
            x: Math.random() * window.innerWidth,
            opacity: [0, 1, 0.8, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Energy Lightning */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-96 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-400 origin-bottom"
          style={{
            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
            filter: 'drop-shadow(0 0 10px #ff4500)'
          }}
          animate={{
            scaleY: [0.5, 1.5, 0.3, 1.2, 0.5],
            opacity: [0.3, 1, 0.1, 0.8, 0.3],
            rotate: [i * 60, i * 60 + 15, i * 60 - 15, i * 60 + 10, i * 60]
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}

      {/* Main Logo Container with Fire Effect */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [0, -15, 0, -10, 0],
            scale: [1, 1.05, 0.98, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Outer Fire Glow */}
          <motion.div
            className="absolute -inset-8 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,69,0,0.3) 0%, rgba(255,107,0,0.2) 30%, rgba(255,143,0,0.1) 60%, transparent 100%)',
              filter: 'blur(20px)'
            }}
            animate={{
              scale: [1, 1.3, 0.9, 1.2, 1],
              opacity: [0.5, 0.8, 0.3, 0.7, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.svg
            width="400"
            height="240"
            viewBox="0 0 264.58 158.75"
            className="drop-shadow-2xl relative z-10"
            style={{
              filter: 'drop-shadow(0 0 20px #ff4500) drop-shadow(0 0 40px #ff6b00)'
            }}
            animate={{
              filter: [
                'drop-shadow(0 0 20px #ff4500) drop-shadow(0 0 40px #ff6b00)',
                'drop-shadow(0 0 30px #dc2626) drop-shadow(0 0 50px #ea580c)',
                'drop-shadow(0 0 25px #ff8f00) drop-shadow(0 0 45px #ffb700)',
                'drop-shadow(0 0 20px #ff4500) drop-shadow(0 0 40px #ff6b00)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Fire-Animated Gray Curves */}
            <motion.g id="curva-gris-completa-fire">
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                transform="translate(-13.827 16.81)"
                fill="#eaeaea"
                animate={{
                  fill: ["#eaeaea", "#ff6b00", "#dc2626", "#ff8f00", "#eaeaea"],
                  d: [
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
                    "m55.362 9.1105c8.9043 85.586 176.22 128.89 159.45 49.069-0.49946 44.459-105.51 42.019-159.45-49.069z",
                    "m55.362 9.1105c8.9043 77.586 176.22 136.89 159.45 41.069-0.49946 52.459-105.51 34.019-159.45-41.069z",
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.path
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                transform="translate(-13.827 16.81)"
                fill="#eaeaea"
                animate={{
                  fill: ["#eaeaea", "#ff6b00", "#dc2626", "#ff8f00", "#eaeaea"],
                  scale: [1, 1.1, 0.95, 1.05, 1],
                  rotate: [0, 8, -5, 3, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              <motion.ellipse
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                transform="translate(-13.827 16.81)"
                fill="#eaeaea"
                animate={{
                  fill: ["#eaeaea", "#ff4500", "#ffb700", "#dc2626", "#eaeaea"],
                  scale: [1, 1.8, 0.6, 1.4, 1],
                  opacity: [0.8, 1, 0.9, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1
                }}
              />
            </motion.g>

            {/* Plasma-Animated Blue Curves */}
            <motion.g id="curva-azul-completa-plasma" transform="translate(-56.555 18.389)">
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                transform="translate(27.41 -13.531)"
                fill="#a7c9ea"
                animate={{
                  fill: ["#a7c9ea", "#ff4500", "#ff8f00", "#dc2626", "#ff6b00", "#a7c9ea"],
                  d: [
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
                    "m55.362 9.1105c8.9043 87.586 176.22 126.89 159.45 51.069-0.49946 42.459-105.51 44.019-159.45-51.069z",
                    "m55.362 9.1105c8.9043 75.586 176.22 138.89 159.45 39.069-0.49946 54.459-105.51 32.019-159.45-39.069z",
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.path
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                transform="translate(27.41 -13.531)"
                fill="#a7c9ea"
                animate={{
                  fill: ["#a7c9ea", "#ff4500", "#ff8f00", "#dc2626", "#ff6b00", "#a7c9ea"],
                  scale: [1, 1.15, 0.9, 1.08, 1.02, 1],
                  rotate: [0, 12, -8, 6, -3, 0]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.ellipse
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                transform="translate(27.41 -13.531)"
                fill="#a7c9ea"
                animate={{
                  fill: ["#a7c9ea", "#ff4500", "#ffb700", "#dc2626", "#ff8f00", "#a7c9ea"],
                  scale: [1, 2.2, 0.4, 1.8, 0.8, 1],
                  opacity: [0.9, 1, 0.8, 1, 0.9, 0.9]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
            </motion.g>

            {/* Fire-Energized DAFEL Text */}
            <motion.path
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="#241f1f"
              animate={{
                fill: ["#241f1f", "#ff4500", "#ff8f00", "#dc2626", "#241f1f"],
                y: [0, -3, 0, -2, 0],
                filter: [
                  'drop-shadow(0 0 5px transparent)',
                  'drop-shadow(0 0 10px #ff4500)',
                  'drop-shadow(0 0 8px #ff8f00)',
                  'drop-shadow(0 0 6px #dc2626)',
                  'drop-shadow(0 0 5px transparent)'
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Plasma Consulting Text */}
            <motion.text
              x="21.478451"
              y="125.46717"
              style={{
                fill: "#666666",
                fontFamily: "'Bangla MN'",
                fontSize: "20.663px"
              }}
              animate={{
                fill: ["#666666", "#ff6b00", "#ff8f00", "#dc2626", "#666666"],
                scale: [1, 1.05, 0.98, 1.02, 1],
                filter: [
                  'drop-shadow(0 0 3px transparent)',
                  'drop-shadow(0 0 8px #ff6b00)',
                  'drop-shadow(0 0 6px #ff8f00)',
                  'drop-shadow(0 0 4px #dc2626)',
                  'drop-shadow(0 0 3px transparent)'
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Consulting Services
            </motion.text>
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Fire Burst Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      >
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-24 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300"
            style={{
              transform: `rotate(${i * 22.5}deg) translateY(-100px)`,
              transformOrigin: '50% 100px'
            }}
            animate={{
              scaleY: [0, 1.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.05 + 3
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}