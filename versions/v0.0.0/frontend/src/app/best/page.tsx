'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import PremiumCursor from '@/components/best/PremiumCursor';
import Fortune500Background from '@/components/best/Fortune500Background';
import EnterpriseMetrics from '@/components/best/EnterpriseMetrics';

export default function BestLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll();
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const logoY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 20,
        y: (e.clientY - window.innerHeight / 2) / 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-white overflow-hidden relative"
    >
      <PremiumCursor />
      <Fortune500Background />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
          {/* Animated Logo */}
          <motion.div
            ref={logoRef}
            variants={itemVariants}
            style={{
              scale: logoScale,
              y: logoY,
              x: mousePosition.x,
              rotateY: mousePosition.x * 0.1,
              rotateX: mousePosition.y * -0.1
            }}
            className="mb-12 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Logo container with enhanced animations */}
            <motion.div
              className="relative"
              animate={{
                filter: [
                  "drop-shadow(0 10px 20px rgba(167, 201, 234, 0.1))",
                  "drop-shadow(0 20px 40px rgba(167, 201, 234, 0.2))",
                  "drop-shadow(0 10px 20px rgba(167, 201, 234, 0.1))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.svg
                width="400"
                height="240"
                viewBox="0 0 264.58 158.75"
                className="w-full max-w-md"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                {/* Gray curves with subtle animation */}
                <motion.g
                  id="curva-gris-completa"
                  animate={{
                    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.path
                    d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                    fill="#eaeaea"
                    transform="translate(-13.827 16.81)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                  />
                  <motion.path
                    d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                    fill="#eaeaea"
                    transform="translate(-13.827 16.81)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                  />
                  <motion.ellipse
                    cx="212.5"
                    cy="42.875"
                    rx="5.5644"
                    ry="4.5354"
                    fill="#eaeaea"
                    transform="translate(-13.827 16.81)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  />
                </motion.g>

                {/* Blue curves with enhanced animation */}
                <motion.g
                  id="curva-azul-completa"
                  transform="translate(-56.555 18.389)"
                  animate={{
                    filter: [
                      "brightness(1) saturate(1)",
                      "brightness(1.2) saturate(1.1)",
                      "brightness(1) saturate(1)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <motion.path
                    d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                    fill="#a7c9ea"
                    transform="translate(27.41 -13.531)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                  <motion.path
                    d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                    fill="#a7c9ea"
                    transform="translate(27.41 -13.531)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.0 }}
                  />
                  <motion.ellipse
                    cx="212.5"
                    cy="42.875"
                    rx="5.5644"
                    ry="4.5354"
                    fill="#a7c9ea"
                    transform="translate(27.41 -13.531)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  />
                </motion.g>

                {/* DAFEL text with typewriter effect */}
                <motion.path
                  d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
                  fill="#241f1f"
                  strokeWidth="3.1441"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2.5, delay: 1.4 }}
                />

                {/* Consulting Services text */}
                <motion.text
                  x="21.5"
                  y="125"
                  fill="#666666"
                  fontSize="20"
                  fontFamily="system-ui, sans-serif"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 2.2 }}
                >
                  Consulting Services
                </motion.text>
              </motion.svg>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-8">
            <motion.h1 
              className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.5, delay: 2.5 }}
            >
              <span className="block">Transformamos el</span>
              <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Futuro Digital
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3 }}
            >
              Soluciones corporativas de inteligencia artificial que revolucionan 
              la manera en que las empresas innovan, crecen y prosperan en la era digital.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
              <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId="buttonBackground"
              />
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                    "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Explorar Soluciones
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 relative overflow-hidden group cursor-pointer bg-white"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.05)"
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.7 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div
                className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-0 group-hover:opacity-50 scale-110"
                animate={{
                  scale: [1.1, 1.2, 1.1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Contactar Expertos
                <motion.span
                  className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Enterprise Metrics Section */}
        <EnterpriseMetrics />
        
        {/* Services Section */}
        <ServicesSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Contact Section */}
        <ContactSection />
      </motion.div>
    </div>
  );
}

function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.2 });

  const services = [
    {
      title: "Inteligencia Artificial",
      description: "Implementamos soluciones de IA personalizadas que automatizan procesos y optimizan la toma de decisiones empresariales.",
      icon: "🧠"
    },
    {
      title: "Machine Learning",
      description: "Desarrollamos modelos predictivos que transforman datos en insights accionables para impulsar el crecimiento.",
      icon: "⚡"
    },
    {
      title: "Consultoría Digital",
      description: "Acompañamos a las empresas en su transformación digital con estrategias innovadoras y tecnologías de vanguardia.",
      icon: "🚀"
    }
  ];

  return (
    <section ref={ref} className="py-20 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones integrales que combinan experiencia técnica 
            con visión estratégica para acelerar el éxito de su negocio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Por qué elegir Dafel?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combinamos experiencia técnica de vanguardia con una comprensión profunda 
            de los desafíos empresariales modernos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <ul className="space-y-6">
              {[
                "Más de 10 años de experiencia en tecnología empresarial",
                "Equipo multidisciplinario de expertos certificados",
                "Metodologías ágiles y resultados medibles",
                "Soporte 24/7 y mantenimiento continuo"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center text-lg text-gray-700"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-gray-50 p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Compromiso con la Excelencia
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              En Dafel, no solo implementamos tecnología; creamos soluciones que 
              transforman la manera en que las empresas operan, innovan y crecen 
              en el ecosistema digital del siglo XXI.
            </p>
            <motion.button
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Conocer Más
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comenzemos su Transformación Digital
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contáctenos hoy para una consulta gratuita y descubra cómo podemos 
            acelerar el crecimiento de su empresa con tecnología de vanguardia.
          </p>
          <motion.button
            className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            Solicitar Consulta Gratuita
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}