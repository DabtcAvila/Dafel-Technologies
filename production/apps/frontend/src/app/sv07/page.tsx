'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SV07WaveAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          <motion.path
            d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
            fill="url(#waveGradient)"
            animate={{
              d: [
                "M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z",
                "M0,450 Q300,350 600,450 T1200,450 L1200,800 L0,800 Z",
                "M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.path
            d="M0,500 Q400,400 800,500 T1600,500 L1600,800 L0,800 Z"
            fill="url(#waveGradient)"
            opacity="0.5"
            animate={{
              d: [
                "M0,500 Q400,400 800,500 T1600,500 L1600,800 L0,800 Z",
                "M0,550 Q400,450 800,550 T1600,550 L1600,800 L0,800 Z",
                "M0,500 Q400,400 800,500 T1600,500 L1600,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </svg>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-300 rounded-full opacity-60"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}

      {/* Main Logo Container */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateZ: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.svg
            width="400"
            height="240"
            viewBox="0 0 264.58 158.75"
            className="drop-shadow-2xl"
            animate={{
              filter: [
                "hue-rotate(0deg) saturate(1) brightness(1)",
                "hue-rotate(180deg) saturate(1.5) brightness(1.2)",
                "hue-rotate(360deg) saturate(1) brightness(1)"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Animated Gray Curves with Wave Effect */}
            <motion.g id="curva-gris-completa">
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                transform="translate(-13.827 16.81)"
                fill="#eaeaea"
                animate={{
                  d: [
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
                    "m55.362 9.1105c8.9043 81.586 176.22 142.89 159.45 35.069-0.49946 58.459-105.51 28.019-159.45-35.069z",
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
                transform="translate(-13.827 16.81)"
                fill="#eaeaea"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
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
                transform="translate(-13.827 16.81)"
                fill="#eaeaea"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.g>

            {/* Animated Blue Curves with Fluid Motion */}
            <motion.g id="curva-azul-completa" transform="translate(-56.555 18.389)">
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                transform="translate(27.41 -13.531)"
                fill="#a7c9ea"
                animate={{
                  fill: ["#a7c9ea", "#06b6d4", "#3b82f6", "#a7c9ea"],
                  d: [
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
                    "m55.362 9.1105c8.9043 91.586 176.22 122.89 159.45 55.069-0.49946 38.459-105.51 48.019-159.45-55.069z",
                    "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.path
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                transform="translate(27.41 -13.531)"
                fill="#a7c9ea"
                animate={{
                  fill: ["#a7c9ea", "#06b6d4", "#3b82f6", "#a7c9ea"],
                  scale: [1, 1.05, 1],
                  rotate: [0, -3, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
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
                  fill: ["#a7c9ea", "#06b6d4", "#3b82f6", "#a7c9ea"],
                  scale: [1, 1.5, 1],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
            </motion.g>

            {/* DAFEL Text with Wave Motion */}
            <motion.path
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="#241f1f"
              animate={{
                fill: ["#241f1f", "#1e3a8a", "#0f172a", "#241f1f"],
                y: [0, -2, 0, 2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Consulting Text with Gentle Wave */}
            <motion.text
              x="21.478451"
              y="125.46717"
              style={{
                fill: "#666666",
                fontFamily: "'Bangla MN'",
                fontSize: "20.663px"
              }}
              animate={{
                fill: ["#666666", "#3b82f6", "#06b6d4", "#666666"],
                x: [21.478451, 23.478451, 21.478451, 19.478451, 21.478451]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Consulting Services
            </motion.text>
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-96 h-96 border-2 border-cyan-300 rounded-full"
            animate={{
              scale: [0, 2],
              opacity: [1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}