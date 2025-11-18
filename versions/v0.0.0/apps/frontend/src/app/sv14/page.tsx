'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const MatrixLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoControls = useAnimation();
  
  // Matrix digital rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Initialize drops
    const drops: Array<{
      y: number;
      speed: number;
      chars: string[];
      opacity: number;
      glitch: number;
    }> = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = {
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 1,
        chars: [],
        opacity: Math.random() * 0.8 + 0.2,
        glitch: 0
      };
      
      // Fill initial characters for each column
      for (let j = 0; j < Math.floor(canvas.height / fontSize); j++) {
        drops[i].chars[j] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
    }
    
    const animate = () => {
      // Semi-transparent black background for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Random character changes
        if (Math.random() < 0.1) {
          const charIndex = Math.floor(Math.random() * drop.chars.length);
          drop.chars[charIndex] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        
        // Draw the falling characters
        for (let j = 0; j < drop.chars.length; j++) {
          const y = drop.y + (j * fontSize);
          
          if (y > 0 && y < canvas.height) {
            // Calculate distance from center for logo interaction
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distanceFromCenter = Math.sqrt(
              Math.pow(i * fontSize - centerX, 2) + Math.pow(y - centerY, 2)
            );
            
            // Modify color based on distance from center
            let alpha = drop.opacity * (1 - j * 0.05);
            let color = '#00ff00';
            
            if (distanceFromCenter < 200) {
              // Near logo - more intense, blue-ish
              alpha *= 1.5;
              color = '#00ffff';
              
              // Add glitch effect near logo
              if (Math.random() < 0.05) {
                drop.glitch = 5;
              }
            } else if (distanceFromCenter < 400) {
              // Medium distance - standard green
              color = '#00ff00';
            } else {
              // Far from logo - darker green
              color = '#008800';
              alpha *= 0.7;
            }
            
            // Apply glitch effect
            let xOffset = 0;
            if (drop.glitch > 0) {
              xOffset = (Math.random() - 0.5) * 4;
              drop.glitch--;
              alpha *= 1.5;
              color = '#ff0040';
            }
            
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.fillText(drop.chars[j], i * fontSize + xOffset, y);
          }
        }
        
        // Move drop down
        drop.y += drop.speed;
        
        // Reset drop when it goes off screen
        if (drop.y > canvas.height + fontSize * drop.chars.length) {
          drop.y = -fontSize * drop.chars.length;
          drop.speed = Math.random() * 3 + 1;
          drop.opacity = Math.random() * 0.8 + 0.2;
        }
        
        // Random speed variations
        if (Math.random() < 0.01) {
          drop.speed = Math.random() * 4 + 0.5;
        }
      }
      
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Logo animations
  useEffect(() => {
    const animateLoop = async () => {
      while (true) {
        // Digital emergence effect
        await logoControls.start({
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          filter: [
            'brightness(0) saturate(0)',
            'brightness(2) saturate(2) hue-rotate(120deg)',
            'brightness(1) saturate(1) hue-rotate(0deg)'
          ],
          transition: { duration: 3, ease: "easeOut" }
        });
        
        // Matrix glitch effect
        await logoControls.start({
          x: [0, -2, 2, 0],
          y: [0, 1, -1, 0],
          scale: [1, 1.05, 0.98, 1],
          filter: [
            'brightness(1) saturate(1)',
            'brightness(1.5) saturate(1.5) hue-rotate(90deg)',
            'brightness(1) saturate(1)'
          ],
          transition: { duration: 0.3, repeat: 3 }
        });
        
        // Steady state with subtle pulse
        await logoControls.start({
          scale: [1, 1.02, 1],
          filter: [
            'brightness(1) saturate(1)',
            'brightness(1.1) saturate(1.1)',
            'brightness(1) saturate(1)'
          ],
          transition: { duration: 2, repeat: 2 }
        });
      }
    };
    
    animateLoop();
  }, [logoControls]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Matrix digital rain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Digital scan lines overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.1) 2px,
            rgba(0, 255, 0, 0.1) 4px
          )`
        }}
      />
      
      {/* Centered animated logo */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          animate={logoControls}
          className="relative"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 0, 0.8))'
          }}
        >
          <svg
            width="400"
            height="240"
            viewBox="0 0 264.58 158.75"
            className="w-96 h-auto"
          >
            <g id="curva-gris-completa-layer-1">
              <motion.path
                id="curva-gris-grande"
                transform="translate(-13.827 16.81)"
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                fill="url(#matrixGradient1)"
                strokeWidth="0.26458"
                animate={{
                  fill: [
                    'url(#matrixGradient1)',
                    'url(#matrixGradient2)',
                    'url(#matrixGradient1)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.path
                id="curva-gris-pequena"
                transform="translate(-13.827 16.81)"
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="url(#matrixGradient1)"
                strokeWidth="0.37418"
                animate={{
                  fill: [
                    'url(#matrixGradient1)',
                    'url(#matrixGradient2)',
                    'url(#matrixGradient1)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
              <motion.ellipse
                id="curva-gris-circulo"
                transform="translate(-13.827 16.81)"
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="url(#matrixGradient1)"
                strokeWidth="0.26458"
                animate={{
                  fill: [
                    'url(#matrixGradient1)',
                    'url(#matrixGradient2)',
                    'url(#matrixGradient1)'
                  ],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </g>
            
            <motion.path
              id="texto-dafel-layer-3"
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="url(#matrixTextGradient)"
              strokeWidth="3.1441"
              animate={{
                fill: [
                  'url(#matrixTextGradient)',
                  'url(#matrixTextGradient2)',
                  'url(#matrixTextGradient)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <motion.text
              transform="scale(1.0099 .99024)"
              x="21.478451"
              y="125.46717"
              fill="url(#matrixSubtextGradient)"
              fontSize="20.663"
              fontFamily="'Courier New', monospace"
              animate={{
                opacity: [0.6, 1, 0.6],
                fill: [
                  'url(#matrixSubtextGradient)',
                  'url(#matrixSubtextGradient2)',
                  'url(#matrixSubtextGradient)'
                ]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <tspan>Consulting Services</tspan>
            </motion.text>
            
            <defs>
              <linearGradient id="matrixGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00cc00" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#008800" stopOpacity="0.5" />
              </linearGradient>
              
              <linearGradient id="matrixGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff0040" stopOpacity="0.5" />
              </linearGradient>
              
              <linearGradient id="matrixTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#00ff00" />
                <stop offset="70%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              
              <linearGradient id="matrixTextGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0040" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00ff00" />
              </linearGradient>
              
              <linearGradient id="matrixSubtextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00cc00" />
                <stop offset="50%" stopColor="#00ff00" />
                <stop offset="100%" stopColor="#00cc00" />
              </linearGradient>
              
              <linearGradient id="matrixSubtextGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff0040" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      
      {/* Digital glitch overlay */}
      <motion.div
        className="absolute inset-0 z-15 pointer-events-none mix-blend-screen"
        animate={{
          opacity: [0, 0.1, 0, 0.2, 0],
          background: [
            'linear-gradient(90deg, transparent 98%, rgba(0, 255, 0, 0.5) 100%)',
            'linear-gradient(90deg, transparent 95%, rgba(255, 0, 64, 0.5) 100%)',
            'linear-gradient(90deg, transparent 97%, rgba(0, 255, 255, 0.5) 100%)',
          ]
        }}
        transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
      />
    </div>
  );
};

export default function SV14Page() {
  return <MatrixLogo />;
}