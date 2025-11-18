'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import BrutalCursor from '@/components/ui/BrutalCursor';
import ParticleField from '@/components/ui/ParticleField';
import PerformanceWrapper from '@/components/ui/PerformanceWrapper';

export default function SvLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  const { scrollYProgress } = useScroll();
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = window.innerHeight;
      const section = Math.floor(scrolled / height);
      setCurrentSection(section);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      title: "INNOVACIÓN",
      subtitle: "Brutal",
      description: "Transformamos ideas en realidades digitales que impactan",
      color: "from-slate-900 via-purple-900 to-slate-900"
    },
    {
      title: "TECNOLOGÍA",
      subtitle: "Avanzada", 
      description: "Desarrollamos con las tecnologías más cutting-edge del mercado",
      color: "from-blue-900 via-cyan-900 to-blue-900"
    },
    {
      title: "RESULTADOS",
      subtitle: "Extraordinarios",
      description: "Entregamos soluciones que superan expectativas y marcan diferencia",
      color: "from-emerald-900 via-teal-900 to-emerald-900"
    }
  ];

  return (
    <PerformanceWrapper>
      <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
        <BrutalCursor />
        <ParticleField />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center z-10">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${sections[currentSection]?.color || "from-slate-900 via-purple-900 to-slate-900"}`}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Animated Logo */}
        <motion.div
          className="relative z-20"
          style={{ scale: logoScale, opacity: logoOpacity }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 2,
            type: "spring",
            stiffness: 100
          }}
        >
          <motion.svg
            ref={logoRef}
            width="400"
            height="240"
            viewBox="0 0 264.58 158.75"
            className="drop-shadow-2xl"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Gray Curves with Animation */}
            <motion.g
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            >
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                fill="#eaeaea"
                transform="translate(-13.827 16.81)"
                animate={{
                  fill: ["#eaeaea", "#ffffff", "#eaeaea"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.path
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="#eaeaea"
                transform="translate(-13.827 16.81)"
                animate={{
                  fill: ["#eaeaea", "#f0f0f0", "#eaeaea"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.ellipse
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="#eaeaea"
                transform="translate(-13.827 16.81)"
                animate={{
                  scale: [1, 1.2, 1],
                  fill: ["#eaeaea", "#ffffff", "#eaeaea"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.g>

            {/* Blue Curves with Animation */}
            <motion.g
              transform="translate(-56.555 18.389)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                fill="#a7c9ea"
                transform="translate(27.41 -13.531)"
                animate={{
                  fill: ["#a7c9ea", "#00bfff", "#a7c9ea"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.path
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill="#a7c9ea"
                transform="translate(27.41 -13.531)"
                animate={{
                  fill: ["#a7c9ea", "#0080ff", "#a7c9ea"]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.7 }}
              />
              <motion.ellipse
                cx="212.5"
                cy="42.875"
                rx="5.5644"
                ry="4.5354"
                fill="#a7c9ea"
                transform="translate(27.41 -13.531)"
                animate={{
                  scale: [1, 1.3, 1],
                  fill: ["#a7c9ea", "#ffffff", "#a7c9ea"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </motion.g>

            {/* DAFEL Text with Stagger Animation */}
            <motion.path
              d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
              fill="#241f1f"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 1.5 }}
            />

            {/* Consulting Text */}
            <motion.text
              x="21.5"
              y="125"
              fill="#666666"
              fontSize="20"
              fontFamily="system-ui"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              Consulting Services
            </motion.text>
          </motion.svg>
        </motion.div>

        {/* Floating Text */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <motion.h1
            className="text-6xl font-bold text-white mb-4"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            DAFEL
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Transformando el futuro digital
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full opacity-75">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mx-auto mt-2"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Dynamic Content Sections */}
      {sections.map((section, index) => (
        <Section key={index} section={section} index={index} />
      ))}

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl z-50 flex items-center justify-center"
        whileHover={{ scale: 1.2, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 40px rgba(147, 51, 234, 0.8)",
            "0 0 20px rgba(59, 130, 246, 0.5)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-white text-2xl">⚡</span>
      </motion.button>
      </div>
    </PerformanceWrapper>
  );
}

function Section({ section, index }: { section: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.3 });

  return (
    <motion.section
      ref={ref}
      className="h-screen flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${section.color}`}
        animate={{ 
          opacity: isInView ? [0.9, 1, 0.9] : 0.5,
          scale: isInView ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <motion.div
        className="relative z-10 text-center max-w-4xl px-8"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isInView ? 0 : 100, 
          opacity: isInView ? 1 : 0 
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h2
          className="text-8xl font-bold text-white mb-4"
          animate={isInView ? {
            scale: [1, 1.1, 1],
            textShadow: [
              "0 0 30px rgba(255,255,255,0.5)",
              "0 0 60px rgba(255,255,255,0.8)",
              "0 0 30px rgba(255,255,255,0.5)"
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {section.title}
        </motion.h2>
        
        <motion.h3
          className="text-4xl text-gray-300 mb-8"
          animate={isInView ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {section.subtitle}
        </motion.h3>
        
        <motion.p
          className="text-xl text-gray-200 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            y: isInView ? 0 : 30 
          }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {section.description}
        </motion.p>

        <motion.div
          className="mt-12 flex justify-center space-x-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            scale: isInView ? 1 : 0.8 
          }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.button
            className="interactive px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white font-semibold border border-white border-opacity-30 relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgba(255,255,255,0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-30"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Explorar Más</span>
          </motion.button>
          
          <motion.button
            className="interactive px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(147, 51, 234, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">Contactar</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}