'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PathsBackground, Button } from '@/components/ui';
import { ArrowRightIcon, SparklesIcon, RocketLaunchIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function NewLandingPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Static fallback while mounting
  if (!mounted) {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 overflow-hidden">
        <PathsBackground 
          className="opacity-60" 
        />
        
        <section className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight">
              Dafel Technologies
            </h1>
            <p className="text-2xl md:text-3xl text-slate-700 dark:text-slate-300 mb-8 font-light">
              Impulsando el futuro con{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Inteligencia Artificial
              </span>
            </p>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Creamos soluciones tecnológicas innovadoras que transforman empresas 
              y aceleran el crecimiento con IA, análisis avanzado y desarrollo de última generación.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Solutions",
      description: "Transformamos tu negocio con inteligencia artificial de vanguardia"
    },
    {
      icon: RocketLaunchIcon,
      title: "Performance Optimizada",
      description: "Sistemas ultra-rápidos que escalan con tu crecimiento empresarial"
    },
    {
      icon: ChartBarIcon,
      title: "Analytics Avanzados",
      description: "Insights profundos que impulsan decisiones estratégicas inteligentes"
    }
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 overflow-hidden">
      {/* Animated Paths Background */}
      <PathsBackground 
        className="opacity-60" 
      />
      
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Main Heading */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight"
            variants={fadeInUp}
          >
            Dafel Technologies
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-2xl md:text-3xl text-slate-700 dark:text-slate-300 mb-8 font-light"
            variants={fadeInUp}
          >
            Impulsando el futuro con{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Inteligencia Artificial
            </span>
          </motion.p>
          
          {/* Description */}
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Creamos soluciones tecnológicas innovadoras que transforman empresas 
            y aceleran el crecimiento con IA, análisis avanzado y desarrollo de última generación.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
            variants={fadeInUp}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Comenzar Ahora
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Ver Portfolio
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={fadeInUp}
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { number: "100+", label: "Proyectos Exitosos" },
            { number: "50+", label: "Clientes Satisfechos" },
            { number: "99.9%", label: "Uptime Garantizado" },
            { number: "24/7", label: "Soporte Técnico" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={fadeInUp}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-2xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </main>
  );
}