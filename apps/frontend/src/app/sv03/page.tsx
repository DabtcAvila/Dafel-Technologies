'use client'

import { motion } from 'framer-motion'

export default function SV03Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center perspective-1000">
      <motion.div
        className="w-96 h-64 relative"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
        initial={{ 
          rotateX: -90, 
          rotateY: -90, 
          scale: 0.5,
          opacity: 0
        }}
        animate={{ 
          rotateX: 0, 
          rotateY: 0, 
          scale: 1,
          opacity: 1
        }}
        transition={{ 
          duration: 2, 
          ease: "easeOut",
          type: "spring",
          damping: 20
        }}
      >
        {/* 3D rotating container */}
        <motion.div
          style={{ 
            transformStyle: "preserve-3d"
          }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 10, -10, 0]
          }}
          transition={{
            rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 264.58 158.75" 
            className="drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 20px rgba(167, 201, 234, 0.5))"
            }}
          >
            {/* Gray curves with 3D depth illusion */}
            <motion.g
              animate={{
                scale: [1, 1.1, 1],
                skewY: [0, 2, -2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.path
                d="m41.535 25.9205c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                fill="url(#grayGradient)"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  strokeDasharray: [0, 500, 1000],
                  strokeDashoffset: [0, -500, -1000]
                }}
                stroke="#eaeaea"
                strokeWidth="2"
                transition={{
                  pathLength: { duration: 2, ease: "easeInOut" },
                  strokeDasharray: { duration: 4, repeat: Infinity, ease: "linear" },
                  strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
              />
              <motion.path
                d="m167.403 146.63c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="url(#grayGradient)"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  strokeDasharray: [0, 300, 600],
                  strokeDashoffset: [0, -300, -600]
                }}
                stroke="#eaeaea"
                strokeWidth="1.5"
                transition={{
                  pathLength: { duration: 2, delay: 0.3, ease: "easeInOut" },
                  strokeDasharray: { duration: 3, delay: 0.5, repeat: Infinity, ease: "linear" },
                  strokeDashoffset: { duration: 3, delay: 0.5, repeat: Infinity, ease: "linear" }
                }}
              />
              <motion.ellipse
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="url(#grayRadial)"
                transform="translate(-13.827 16.81)"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
              />
            </motion.g>

            {/* Blue curves with different 3D perspective */}
            <motion.g
              animate={{
                scale: [1, 0.95, 1.05, 1],
                skewX: [0, -1, 1, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <motion.path
                d="m82.777 4.858c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                fill="url(#blueGradient)"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  strokeDasharray: [0, 600, 1200],
                  strokeDashoffset: [0, -600, -1200]
                }}
                stroke="#a7c9ea"
                strokeWidth="2.5"
                transition={{
                  pathLength: { duration: 2, delay: 0.5, ease: "easeInOut" },
                  strokeDasharray: { duration: 5, repeat: Infinity, ease: "linear" },
                  strokeDashoffset: { duration: 5, repeat: Infinity, ease: "linear" }
                }}
              />
              <motion.path
                d="m208.64 116.289c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="url(#blueGradient)"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  strokeDasharray: [0, 400, 800],
                  strokeDashoffset: [0, -400, -800]
                }}
                stroke="#a7c9ea"
                strokeWidth="2"
                transition={{
                  pathLength: { duration: 2, delay: 0.8, ease: "easeInOut" },
                  strokeDasharray: { duration: 4, delay: 0.3, repeat: Infinity, ease: "linear" },
                  strokeDashoffset: { duration: 4, delay: 0.3, repeat: Infinity, ease: "linear" }
                }}
              />
              <motion.ellipse
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="url(#blueRadial)"
                transform="translate(27.41 -13.531)"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, -180, -360]
                }}
                transition={{
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  rotate: { duration: 5, repeat: Infinity, ease: "linear", delay: 0.5 }
                }}
              />
            </motion.g>

            {/* DAFEL text with 3D perspective transform */}
            <motion.g
              animate={{
                rotateX: [0, 5, -5, 0],
                rotateY: [0, 2, -2, 0],
                z: [0, 20, -20, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: "center" }}
            >
              <motion.path
                d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
                fill="url(#textGradient)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  strokeDasharray: [0, 1000, 2000],
                  strokeDashoffset: [0, -1000, -2000]
                }}
                stroke="#ffffff"
                strokeWidth="0.5"
                transition={{
                  pathLength: { duration: 3, delay: 1, ease: "easeInOut" },
                  opacity: { duration: 2, delay: 1 },
                  strokeDasharray: { duration: 6, delay: 2, repeat: Infinity, ease: "linear" },
                  strokeDashoffset: { duration: 6, delay: 2, repeat: Infinity, ease: "linear" }
                }}
              />
            </motion.g>

            {/* Consulting text with 3D depth */}
            <motion.g
              animate={{
                rotateX: [0, -3, 3, 0],
                rotateY: [0, -1, 1, 0],
                z: [0, 10, -10, 0]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <motion.text
                x="21.478451"
                y="125.46717"
                fill="url(#consultingGradient)"
                fontSize="20.663"
                fontFamily="system-ui, sans-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  letterSpacing: ["0px", "2px", "0px"]
                }}
                transition={{
                  opacity: { duration: 2, delay: 2 },
                  y: { duration: 2, delay: 2 },
                  letterSpacing: { duration: 4, delay: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                Consulting Services
              </motion.text>
            </motion.g>

            {/* Gradient definitions for 3D effect */}
            <defs>
              <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#f0f0f0", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#eaeaea", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#d0d0d0", stopOpacity: 1 }} />
              </linearGradient>
              
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#c7e9ff", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#a7c9ea", stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: "#87a9ca", stopOpacity: 1 }} />
              </linearGradient>

              <radialGradient id="grayRadial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#eaeaea", stopOpacity: 1 }} />
              </radialGradient>

              <radialGradient id="blueRadial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: "#e7f4ff", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#a7c9ea", stopOpacity: 1 }} />
              </radialGradient>

              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#f0f0f0", stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
              </linearGradient>

              <linearGradient id="consultingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#aaaaaa", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#888888", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#aaaaaa", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* 3D shadow effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            transform: "translateZ(-50px) rotateX(90deg)",
            background: "radial-gradient(ellipse, rgba(167, 201, 234, 0.3) 0%, transparent 70%)",
            filter: "blur(20px)"
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  )
}