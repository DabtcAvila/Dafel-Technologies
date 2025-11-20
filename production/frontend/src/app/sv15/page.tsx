'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AuroraLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoControls = useAnimation();
  
  // Aurora borealis effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Aurora waves
    const waves: Array<{
      points: Array<{ x: number; y: number; vx: number; vy: number }>;
      color: string;
      opacity: number;
      speed: number;
      amplitude: number;
      frequency: number;
      phase: number;
      thickness: number;
    }> = [];
    
    // Create multiple aurora layers
    for (let i = 0; i < 6; i++) {
      const wave = {
        points: [],
        color: ['#00ff88', '#0088ff', '#8800ff', '#ff0088', '#88ff00', '#ff8800'][i],
        opacity: 0.3 + Math.random() * 0.4,
        speed: 0.01 + Math.random() * 0.02,
        amplitude: 50 + Math.random() * 100,
        frequency: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        thickness: 30 + Math.random() * 50
      };
      
      // Initialize points for this wave
      for (let j = 0; j <= canvas.width + 100; j += 20) {
        wave.points.push({
          x: j,
          y: canvas.height * (0.3 + i * 0.1) + Math.sin(j * wave.frequency + wave.phase) * wave.amplitude,
          vx: 0,
          vy: 0
        });
      }
      
      waves.push(wave);
    }
    
    // Stars
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      twinkle: number;
      twinkleSpeed: number;
    }> = [];
    
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03
      });
    }
    
    let time = 0;
    
    const animate = () => {
      time += 0.016;
      
      // Clear with gradient background (night sky)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a2e');
      gradient.addColorStop(0.3, '#16213e');
      gradient.addColorStop(0.7, '#1a1a3a');
      gradient.addColorStop(1, '#000011');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        star.twinkle += star.twinkleSpeed;
        const brightness = 0.5 + Math.sin(star.twinkle) * 0.5;
        
        ctx.save();
        ctx.globalAlpha = brightness;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Draw aurora waves
      waves.forEach((wave, waveIndex) => {
        // Update wave points
        wave.points.forEach((point, index) => {
          const baseY = canvas.height * (0.3 + waveIndex * 0.1);
          point.y = baseY + Math.sin(point.x * wave.frequency + wave.phase + time * wave.speed * 100) * wave.amplitude;
          
          // Add some randomness for organic movement
          point.y += Math.sin(time * 2 + index * 0.5) * 10;
        });
        
        // Create aurora effect with multiple layers
        for (let layer = 0; layer < 3; layer++) {
          ctx.save();
          
          // Create gradient for aurora colors
          const auroraGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          const baseColor = wave.color;
          const layerOpacity = wave.opacity * (1 - layer * 0.3);
          
          auroraGradient.addColorStop(0, `${baseColor}00`);
          auroraGradient.addColorStop(0.3, `${baseColor}${Math.floor(layerOpacity * 255).toString(16).padStart(2, '0')}`);
          auroraGradient.addColorStop(0.7, `${baseColor}${Math.floor(layerOpacity * 128).toString(16).padStart(2, '0')}`);
          auroraGradient.addColorStop(1, `${baseColor}00`);
          
          ctx.fillStyle = auroraGradient;
          ctx.globalCompositeOperation = 'screen';
          
          // Draw wave shape
          ctx.beginPath();
          ctx.moveTo(wave.points[0].x, wave.points[0].y + layer * 20);
          
          // Create smooth curves
          for (let i = 1; i < wave.points.length - 2; i++) {
            const cp1x = (wave.points[i].x + wave.points[i + 1].x) / 2;
            const cp1y = (wave.points[i].y + wave.points[i + 1].y) / 2 + layer * 20;
            const cp2x = (wave.points[i].x + wave.points[i + 1].x) / 2;
            const cp2y = (wave.points[i].y + wave.points[i + 1].y) / 2 + layer * 20;
            
            ctx.quadraticCurveTo(wave.points[i].x, wave.points[i].y + layer * 20, cp1x, cp1y);
          }
          
          // Close the shape to the bottom
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();
          ctx.fill();
          
          // Add shimmer effect
          if (Math.random() < 0.1) {
            const shimmerX = Math.random() * canvas.width;
            const shimmerY = wave.points[Math.floor(wave.points.length * Math.random())].y + layer * 20;
            
            const shimmerGradient = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, 50);
            shimmerGradient.addColorStop(0, `${baseColor}aa`);
            shimmerGradient.addColorStop(1, `${baseColor}00`);
            
            ctx.fillStyle = shimmerGradient;
            ctx.beginPath();
            ctx.arc(shimmerX, shimmerY, 50, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }
        
        // Update wave properties for organic movement
        wave.phase += wave.speed;
        wave.amplitude += Math.sin(time * 0.5 + waveIndex) * 0.5;
      });
      
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
        // Aurora emergence effect
        await logoControls.start({
          scale: [0.8, 1],
          opacity: [0.3, 1],
          rotateY: [0, 360],
          filter: [
            'brightness(0.5) saturate(0.5)',
            'brightness(1.5) saturate(1.5) hue-rotate(0deg)',
            'brightness(1.2) saturate(1.2) hue-rotate(60deg)',
            'brightness(1) saturate(1) hue-rotate(0deg)'
          ],
          transition: { duration: 6, ease: "easeInOut" }
        });
        
        // Aurora pulse effect
        await logoControls.start({
          scale: [1, 1.1, 1],
          filter: [
            'brightness(1) saturate(1) hue-rotate(0deg)',
            'brightness(1.3) saturate(1.3) hue-rotate(120deg)',
            'brightness(1.1) saturate(1.1) hue-rotate(240deg)',
            'brightness(1) saturate(1) hue-rotate(360deg)'
          ],
          transition: { duration: 4, ease: "easeInOut" }
        });
        
        // Gentle floating
        await logoControls.start({
          y: [0, -10, 10, 0],
          rotateZ: [0, 1, -1, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 8, ease: "easeInOut" }
        });
      }
    };
    
    animateLoop();
  }, [logoControls]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Aurora canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-radial from-transparent via-blue-900/5 to-purple-900/10" />
      
      {/* Centered animated logo */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          animate={logoControls}
          className="relative"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(0, 255, 136, 0.6))'
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
                fill="url(#auroraGradient1)"
                strokeWidth="0.26458"
                animate={{
                  fill: [
                    'url(#auroraGradient1)',
                    'url(#auroraGradient2)',
                    'url(#auroraGradient3)',
                    'url(#auroraGradient1)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.path
                id="curva-gris-pequena"
                transform="translate(-13.827 16.81)"
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="url(#auroraGradient1)"
                strokeWidth="0.37418"
                animate={{
                  fill: [
                    'url(#auroraGradient1)',
                    'url(#auroraGradient2)',
                    'url(#auroraGradient3)',
                    'url(#auroraGradient1)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              />
              <motion.ellipse
                id="curva-gris-circulo"
                transform="translate(-13.827 16.81)"
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="url(#auroraGradient1)"
                strokeWidth="0.26458"
                animate={{
                  fill: [
                    'url(#auroraGradient1)',
                    'url(#auroraGradient2)',
                    'url(#auroraGradient3)',
                    'url(#auroraGradient1)'
                  ],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </g>
            
            <motion.path
              id="texto-dafel-layer-3"
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="url(#auroraTextGradient)"
              strokeWidth="3.1441"
              animate={{
                fill: [
                  'url(#auroraTextGradient)',
                  'url(#auroraTextGradient2)',
                  'url(#auroraTextGradient3)',
                  'url(#auroraTextGradient)'
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            <motion.text
              transform="scale(1.0099 .99024)"
              x="21.478451"
              y="125.46717"
              fill="url(#auroraSubtextGradient)"
              fontSize="20.663"
              fontFamily="'Bangla MN'"
              animate={{
                opacity: [0.7, 1, 0.7],
                fill: [
                  'url(#auroraSubtextGradient)',
                  'url(#auroraSubtextGradient2)',
                  'url(#auroraSubtextGradient)'
                ]
              }}
              transition={{ duration: 12, repeat: Infinity }}
            >
              <tspan>Consulting Services</tspan>
            </motion.text>
            
            <defs>
              <radialGradient id="auroraGradient1" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0088ff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8800ff" stopOpacity="0.5" />
              </radialGradient>
              
              <radialGradient id="auroraGradient2" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#ff0088" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#88ff00" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.5" />
              </radialGradient>
              
              <radialGradient id="auroraGradient3" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#ff8800" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#8800ff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0088ff" stopOpacity="0.5" />
              </radialGradient>
              
              <linearGradient id="auroraTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="33%" stopColor="#00ff88" />
                <stop offset="66%" stopColor="#0088ff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              
              <linearGradient id="auroraTextGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0088" />
                <stop offset="33%" stopColor="#ffffff" />
                <stop offset="66%" stopColor="#88ff00" />
                <stop offset="100%" stopColor="#ff0088" />
              </linearGradient>
              
              <linearGradient id="auroraTextGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8800ff" />
                <stop offset="33%" stopColor="#ff8800" />
                <stop offset="66%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#0088ff" />
              </linearGradient>
              
              <linearGradient id="auroraSubtextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#aaccee" />
                <stop offset="50%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#aaccee" />
              </linearGradient>
              
              <linearGradient id="auroraSubtextGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff88aa" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#88aaff" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      
      {/* Aurora shimmer overlay */}
      <motion.div
        className="absolute inset-0 z-15 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(0, 255, 136, 0.1) 0%, transparent 60%)',
            'radial-gradient(ellipse at 70% 60%, rgba(255, 0, 136, 0.1) 0%, transparent 60%)',
            'radial-gradient(ellipse at 50% 20%, rgba(136, 0, 255, 0.1) 0%, transparent 60%)',
            'radial-gradient(ellipse at 20% 80%, rgba(0, 136, 255, 0.1) 0%, transparent 60%)',
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
    </div>
  );
};

export default function SV15Page() {
  return <AuroraLogo />;
}