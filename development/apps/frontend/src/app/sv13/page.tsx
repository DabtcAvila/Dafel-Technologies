'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const QuantumLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const controls = useAnimation();
  
  // Quantum particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      energy: number;
      quantum: number;
      entangled?: any;
    }> = [];
    
    // Create quantum particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 1000,
        maxLife: 1000 + Math.random() * 1000,
        energy: Math.random() * 5 + 1,
        quantum: Math.random() * Math.PI * 2
      });
    }
    
    // Quantum entanglement pairs
    for (let i = 0; i < particles.length; i += 2) {
      if (particles[i + 1]) {
        particles[i].entangled = particles[i + 1];
        particles[i + 1].entangled = particles[i];
      }
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position with quantum uncertainty
        particle.x += particle.vx + Math.sin(particle.quantum) * 0.5;
        particle.y += particle.vy + Math.cos(particle.quantum) * 0.5;
        particle.quantum += 0.02;
        
        // Quantum tunneling (teleportation)
        if (Math.random() < 0.001) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Update life
        particle.life += 1;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.energy = Math.random() * 5 + 1;
        }
        
        // Draw particle with quantum glow
        const alpha = 1 - (particle.life / particle.maxLife);
        const size = particle.energy * (0.5 + alpha * 0.5);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Particle core
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 3
        );
        gradient.addColorStop(0, `hsl(${200 + particle.energy * 20}, 80%, 70%)`);
        gradient.addColorStop(0.5, `hsl(${200 + particle.energy * 20}, 60%, 50%)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Quantum probability cloud
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = `hsl(${250 + particle.energy * 30}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw entanglement connections
        if (particle.entangled && Math.random() < 0.1) {
          const entangled = particle.entangled;
          const dx = entangled.x - particle.x;
          const dy = entangled.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 200) * 0.5;
            ctx.strokeStyle = `hsl(${300 + Math.sin(Date.now() * 0.01) * 60}, 80%, 60%)`;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 10]);
            ctx.lineDashOffset = Date.now() * 0.1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(entangled.x, entangled.y);
            ctx.stroke();
            ctx.restore();
          }
        }
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
        await controls.start({
          rotateY: [0, 360],
          scale: [1, 1.1, 1],
          filter: [
            'hue-rotate(0deg) brightness(1)',
            'hue-rotate(180deg) brightness(1.5)',
            'hue-rotate(360deg) brightness(1)'
          ],
          transition: { duration: 4, ease: "easeInOut" }
        });
        
        await controls.start({
          scale: [1, 0.8, 1.2, 1],
          rotateZ: [0, 5, -5, 0],
          transition: { duration: 2, ease: "easeInOut" }
        });
      }
    };
    
    animateLoop();
  }, [controls]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Quantum particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Quantum field overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-radial from-transparent via-blue-900/10 to-purple-900/20" />
      
      {/* Centered animated logo */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          animate={controls}
          className="relative"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
          }}
        >
          <svg
            ref={logoRef}
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
                fill="url(#quantumGradient1)"
                strokeWidth="0.26458"
                animate={{
                  fill: [
                    'url(#quantumGradient1)',
                    'url(#quantumGradient2)',
                    'url(#quantumGradient1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.path
                id="curva-gris-pequena"
                transform="translate(-13.827 16.81)"
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="url(#quantumGradient1)"
                strokeWidth="0.37418"
                animate={{
                  fill: [
                    'url(#quantumGradient1)',
                    'url(#quantumGradient2)',
                    'url(#quantumGradient1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.ellipse
                id="curva-gris-circulo"
                transform="translate(-13.827 16.81)"
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="url(#quantumGradient1)"
                strokeWidth="0.26458"
                animate={{
                  fill: [
                    'url(#quantumGradient1)',
                    'url(#quantumGradient2)',
                    'url(#quantumGradient1)'
                  ],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>
            
            <motion.path
              id="texto-dafel-layer-3"
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="url(#textGradient)"
              strokeWidth="3.1441"
              animate={{
                fill: [
                  'url(#textGradient)',
                  'url(#textGradient2)',
                  'url(#textGradient)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <motion.text
              transform="scale(1.0099 .99024)"
              x="21.478451"
              y="125.46717"
              fill="url(#subtextGradient)"
              fontSize="20.663"
              fontFamily="'Bangla MN'"
              animate={{
                opacity: [0.7, 1, 0.7],
                fill: [
                  'url(#subtextGradient)',
                  'url(#subtextGradient2)',
                  'url(#subtextGradient)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <tspan>Consulting Services</tspan>
            </motion.text>
            
            <defs>
              <radialGradient id="quantumGradient1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.5" />
              </radialGradient>
              
              <radialGradient id="quantumGradient2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
              </radialGradient>
              
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              
              <linearGradient id="textGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              
              <linearGradient id="subtextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>
              
              <linearGradient id="subtextGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      
      {/* Quantum field pulses */}
      <motion.div
        className="absolute inset-0 z-5 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </div>
  );
};

export default function SV13Page() {
  return <QuantumLogo />;
}