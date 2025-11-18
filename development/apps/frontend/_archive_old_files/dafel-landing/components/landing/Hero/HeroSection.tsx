'use client';

import { motion } from 'framer-motion';
import { ChevronRightIcon, ChartBarIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button, Container } from '@/components/ui';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function HeroSection() {
  const stats = [
    {
      value: "15+",
      label: "Años de experiencia",
      description: "Especializados en análisis actuarial"
    },
    {
      value: "500+",
      label: "Empresas transformadas", 
      description: "Clientes medianas y grandes"
    },
    {
      value: "$50M+",
      label: "Valor identificado",
      description: "En oportunidades históricas"
    },
    {
      value: "5-15",
      label: "Años de análisis",
      description: "Rango histórico especializado"
    }
  ];

  const trustIndicators = [
    {
      icon: ShieldCheckIcon,
      text: "Actuario certificado"
    },
    {
      icon: ChartBarIcon,
      text: "89% precisión en proyecciones"
    },
    {
      icon: ClockIcon,
      text: "Análisis en 48 horas"
    }
  ];

  return (
    <section className="hero-section min-h-screen flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 h-full w-full">
          <g fill="none" fillRule="evenodd">
            <circle cx="30" cy="30" r="1" fill="currentColor" />
          </g>
        </svg>
      </div>

      <Container maxWidth="xl" className="hero-content relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center px-4 py-2 rounded-full bg-dafel-blue-50 text-dafel-blue-600 text-sm font-medium mb-6"
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Consultoría actuarial certificada
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={staggerItem}
              className="heading-display text-balance mb-6"
            >
              Convierte{' '}
              <span className="text-dafel-blue-500">15 años de reportes</span>{' '}
              dispersos en{' '}
              <span className="bg-gradient-to-r from-dafel-blue-500 to-dafel-orange-500 bg-clip-text text-transparent">
                ventaja estratégica
              </span>{' '}
              actuarial
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={staggerItem}
              className="text-lead text-balance mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Para empresas con 5+ años de reportes actuariales: Transformamos tu histórico PDF/Excel 
              en análisis predictivos que generan decisiones estratégicas superiores y 
              <strong className="text-dafel-blue-600"> optimización fiscal demostrable</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start"
            >
              <Button
                size="xl"
                className="group"
                href="#contact"
              >
                Analizar Mi Histórico Gratuito
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                href="#demo"
              >
                Ver Demo de Transformación
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-dafel-slate-600"
            >
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <indicator.icon className="w-4 h-4 text-dafel-blue-500" />
                  <span>{indicator.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Visual Card */}
            <div className="bg-white rounded-2xl p-8 shadow-large border border-dafel-slate-100">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-dafel-slate-900 mb-2">
                  Análisis Histórico Inteligente
                </h3>
                <p className="text-dafel-slate-600 text-sm">
                  Convierte años de data en ventaja competitiva
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                    className="text-center p-4 rounded-xl bg-sand-50 hover:bg-dafel-blue-50 transition-colors"
                  >
                    <div className="text-2xl font-bold text-dafel-blue-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-dafel-slate-900 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-dafel-slate-600">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Highlight */}
              <div className="mt-6 p-4 bg-gradient-to-r from-dafel-blue-50 to-dafel-orange-50 rounded-xl border border-dafel-blue-100">
                <div className="text-center">
                  <div className="text-lg font-semibold text-dafel-blue-600 mb-1">
                    18% promedio
                  </div>
                  <div className="text-sm text-dafel-slate-700">
                    Ahorro fiscal identificado en análisis históricos
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-dafel-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <ChartBarIcon className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-dafel-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="w-6 h-10 border-2 border-dafel-slate-300 rounded-full flex justify-center"
          >
            <motion.div className="w-1 h-3 bg-dafel-slate-400 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </Container>

      {/* Social Proof Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-dafel-slate-200 py-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center"
          >
            <p className="text-sm text-dafel-slate-600 mb-3">
              Empresas líderes que han convertido su histórico en ventaja:
            </p>
            <div className="flex items-center justify-center gap-8 text-dafel-slate-400 opacity-60">
              {/* Placeholder logos - replace with real client logos */}
              <div className="h-8 w-24 bg-dafel-slate-200 rounded"></div>
              <div className="h-8 w-28 bg-dafel-slate-200 rounded"></div>
              <div className="h-8 w-32 bg-dafel-slate-200 rounded"></div>
              <div className="h-8 w-20 bg-dafel-slate-200 rounded"></div>
              <div className="h-8 w-26 bg-dafel-slate-200 rounded"></div>
            </div>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}