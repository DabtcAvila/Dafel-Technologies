'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SV08FractalAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Kaleidoscope Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-full h-2 bg-gradient-to-r from-transparent via-pink-400 to-transparent origin-left"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
            }}
            animate={{
              rotateZ: [i * 45, i * 45 + 360],
              scaleX: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Fractal Geometry Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 800"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <defs>
            <radialGradient id="fractalGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </radialGradient>
            <pattern id="fractalPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="25" fill="url(#fractalGradient)" opacity="0.5" />
              <circle cx="25" cy="25" r="12" fill="url(#fractalGradient)" opacity="0.7" />
              <circle cx="75" cy="75" r="12" fill="url(#fractalGradient)" opacity="0.7" />
              <circle cx="25" cy="75" r="8" fill="url(#fractalGradient)" opacity="0.9" />
              <circle cx="75" cy="25" r="8" fill="url(#fractalGradient)" opacity="0.9" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fractalPattern)" />
        </svg>
      </motion.div>

      {/* Kaleidoscope Mirrors */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-purple-400 to-transparent origin-left"
          style={{
            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
          }}
          animate={{
            rotateZ: [i * 60, i * 60 + 360],
            scaleX: [0.8, 2, 0.8],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}

      {/* Main Logo Container with Kaleidoscope Effect */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            rotateZ: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotateZ: {
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Multiple Logo Layers for Kaleidoscope Effect */}
          {[...Array(6)].map((_, layerIndex) => (
            <motion.div
              key={layerIndex}
              className="absolute top-0 left-0"
              style={{
                mixBlendMode: layerIndex % 2 === 0 ? 'multiply' : 'screen',
              }}
              animate={{
                rotate: [layerIndex * 60, layerIndex * 60 + 360],
                scale: [0.8 + layerIndex * 0.05, 1.2 - layerIndex * 0.05, 0.8 + layerIndex * 0.05],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 8 + layerIndex,
                repeat: Infinity,
                ease: "easeInOut",
                delay: layerIndex * 0.5
              }}
            >
              <motion.svg
                width="400"
                height="240"
                viewBox="0 0 264.58 158.75"
                className="drop-shadow-2xl"
                animate={{
                  filter: [
                    `hue-rotate(${layerIndex * 60}deg) saturate(1.5) brightness(1)`,
                    `hue-rotate(${layerIndex * 60 + 180}deg) saturate(2) brightness(1.3)`,
                    `hue-rotate(${layerIndex * 60 + 360}deg) saturate(1.5) brightness(1)`
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: layerIndex * 0.2
                }}
              >
                {/* Fractal Gray Curves */}
                <motion.g id={`curva-gris-completa-${layerIndex}`}>
                  <motion.path
                    d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                    transform="translate(-13.827 16.81)"
                    fill="#eaeaea"
                    animate={{
                      fill: ["#eaeaea", "#ff6b9d", "#c084fc", "#eaeaea"],
                      scale: [1, 1.1, 0.9, 1],
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{
                      duration: 3 + layerIndex * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: layerIndex * 0.1
                    }}
                  />
                  <motion.path
                    d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                    transform="translate(-13.827 16.81)"
                    fill="#eaeaea"
                    animate={{
                      fill: ["#eaeaea", "#ff6b9d", "#c084fc", "#eaeaea"],
                      scale: [1, 1.2, 0.8, 1],
                      rotate: [0, -20, 20, 0]
                    }}
                    transition={{
                      duration: 4 + layerIndex * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: layerIndex * 0.15
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
                      fill: ["#eaeaea", "#ff6b9d", "#c084fc", "#eaeaea"],
                      scale: [1, 2, 0.5, 1],
                      opacity: [0.8, 1, 0.6, 0.8]
                    }}
                    transition={{
                      duration: 2 + layerIndex * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: layerIndex * 0.05
                    }}
                  />
                </motion.g>

                {/* Fractal Blue Curves */}
                <motion.g id={`curva-azul-completa-${layerIndex}`} transform="translate(-56.555 18.389)">
                  <motion.path
                    d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                    transform="translate(27.41 -13.531)"
                    fill="#a7c9ea"
                    animate={{
                      fill: ["#a7c9ea", "#8b5cf6", "#ec4899", "#06b6d4", "#a7c9ea"],
                      scale: [1, 1.15, 0.85, 1.05, 1],
                      rotate: [0, 25, -25, 10, 0]
                    }}
                    transition={{
                      duration: 5 + layerIndex * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: layerIndex * 0.2
                    }}
                  />
                  <motion.path
                    d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                    transform="translate(27.41 -13.531)"
                    fill="#a7c9ea"
                    animate={{
                      fill: ["#a7c9ea", "#8b5cf6", "#ec4899", "#06b6d4", "#a7c9ea"],
                      scale: [1, 1.3, 0.7, 1.1, 1],
                      rotate: [0, -30, 30, -15, 0]
                    }}
                    transition={{
                      duration: 4.5 + layerIndex * 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: layerIndex * 0.25
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
                      fill: ["#a7c9ea", "#8b5cf6", "#ec4899", "#06b6d4", "#a7c9ea"],
                      scale: [1, 2.5, 0.3, 1.8, 1],
                      opacity: [0.9, 1, 0.4, 0.8, 0.9]
                    }}
                    transition={{
                      duration: 3 + layerIndex * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: layerIndex * 0.1
                    }}
                  />
                </motion.g>

                {/* Fractal DAFEL Text */}
                <motion.path
                  d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
                  fill="#241f1f"
                  animate={{
                    fill: ["#241f1f", "#8b5cf6", "#ec4899", "#06b6d4", "#241f1f"],
                    scale: [1, 1.05, 0.95, 1.02, 1],
                    skewX: [0, 5, -5, 2, 0]
                  }}
                  transition={{
                    duration: 6 + layerIndex * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: layerIndex * 0.3
                  }}
                />

                {/* Fractal Consulting Text */}
                <motion.text
                  x="21.478451"
                  y="125.46717"
                  style={{
                    fill: "#666666",
                    fontFamily: "'Bangla MN'",
                    fontSize: "20.663px"
                  }}
                  animate={{
                    fill: ["#666666", "#8b5cf6", "#ec4899", "#06b6d4", "#666666"],
                    scale: [1, 1.1, 0.9, 1.05, 1],
                    rotate: [0, 3, -3, 1, 0]
                  }}
                  transition={{
                    duration: 8 + layerIndex * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: layerIndex * 0.4
                  }}
                >
                  Consulting Services
                </motion.text>
              </motion.svg>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Kaleidoscope Outer Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          rotate: [0, -360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-32 bg-gradient-to-t from-transparent via-purple-400 to-transparent"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-200px)`,
              transformOrigin: '50% 200px'
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scaleY: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}