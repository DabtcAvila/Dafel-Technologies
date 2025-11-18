'use client'

import { motion } from 'framer-motion'

export default function SV01Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        className="w-96 h-64"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 264.58 158.75" 
          className="drop-shadow-2xl"
        >
          {/* Gray curves with liquid morphing */}
          <motion.g
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.path
              d="m41.535 25.9205c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
              fill="#eaeaea"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  "m41.535 25.9205c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
                  "m41.535 25.9205c15.9043 75.586 170.22 140.89 165.45 40.069-5.49946 55.459-110.51 32.019-165.45-40.069z",
                  "m41.535 25.9205c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                ]
              }}
              transition={{
                pathLength: { duration: 2, ease: "easeInOut" },
                d: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.path
              d="m167.403 146.63c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
              fill="#eaeaea"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  "m167.403 146.63c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z",
                  "m167.403 146.63c-20.565-65.754 4.06227-105.98 30.316-90.08-33.622-42.807-71.429 44.496-30.316 90.08z",
                  "m167.403 146.63c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                ]
              }}
              transition={{
                pathLength: { duration: 2, delay: 0.3, ease: "easeInOut" },
                d: { duration: 6, delay: 0.3, repeat: Infinity, ease: "easeInOut" }
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
                rx: [5.5644, 7.5644, 5.5644],
                ry: [4.5354, 6.5354, 4.5354],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>

          {/* Blue curves with different morphing pattern */}
          <motion.g
            animate={{
              scale: [1, 0.98, 1],
              rotate: [0, -1, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <motion.path
              d="m82.777 4.858c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
              fill="#a7c9ea"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  "m82.777 4.858c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
                  "m82.777 4.858c12.9043 87.586 172.22 128.89 155.45 49.069-4.49946 44.459-109.51 42.019-155.45-49.069z",
                  "m82.777 4.858c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                ]
              }}
              transition={{
                pathLength: { duration: 2, delay: 0.5, ease: "easeInOut" },
                d: { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.path
              d="m208.64 116.289c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
              fill="#a7c9ea"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  "m208.64 116.289c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z",
                  "m208.64 116.289c-28.565-55.754-4.06227-113.98 22.316-98.08-33.622-34.807-63.429 52.496-22.316 98.08z",
                  "m208.64 116.289c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                ]
              }}
              transition={{
                pathLength: { duration: 2, delay: 0.8, ease: "easeInOut" },
                d: { duration: 7, delay: 0.2, repeat: Infinity, ease: "easeInOut" }
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
                rx: [5.5644, 6.5644, 5.5644],
                ry: [4.5354, 5.5354, 4.5354],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.g>

          {/* DAFEL text with liquid wave effect */}
          <motion.path
            d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
            fill="#ffffff"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 1, 0.9, 1],
              y: [0, -2, 0]
            }}
            transition={{
              pathLength: { duration: 3, delay: 1, ease: "easeInOut" },
              opacity: { duration: 2, delay: 1 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
          />

          {/* Consulting text with wave effect */}
          <motion.text
            x="21.478451"
            y="125.46717"
            fill="#888888"
            fontSize="20.663"
            fontFamily="system-ui, sans-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 1, 0.8, 1],
              y: [20, 0, -1, 0]
            }}
            transition={{
              opacity: { duration: 2, delay: 2 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }
            }}
          >
            Consulting Services
          </motion.text>
        </svg>
      </motion.div>
    </div>
  )
}