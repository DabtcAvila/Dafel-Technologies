'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import DafelSection from '@/components/DafelSection';
import ContactModal from '@/components/ContactModal';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { locale, messages, changeLocale } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const router = useRouter();
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[70px] items-center">
            <div className="flex items-center flex-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 100" 
                className="h-7 w-7 mr-2"
                aria-label="Dafel Technologies Logo"
              >
                <path 
                  d="M 0,0 L 100,0 L 100,100 L 0,100 L 0,0 Z M 8,8 L 8,92 L 92,92 L 92,8 L 8,8 Z" 
                  className="fill-gray-900" 
                  fillRule="evenodd"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="27.5" 
                  className="fill-gray-900"
                />
              </svg>
              <span className="text-2xl font-sans font-semibold tracking-tight text-gray-900">
                {messages.navbar.company}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/login')}
                className="rounded-lg border border-gray-300 px-24 py-3 text-sm font-medium text-gray-900 transition-all hover:border-gray-900">
                Get Started
              </button>
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="rounded-lg border border-gray-300 px-24 py-3 text-sm font-medium text-gray-900 transition-all hover:border-gray-900"
              >
                {messages.navbar.scheduleConsultation}
              </button>
              <button 
                onClick={() => changeLocale(locale === 'es' ? 'en' : 'es')}
                className="flex items-center text-sm text-gray-600 transition-all hover:text-gray-900"
              >
                <span className={`${locale === 'es' ? 'font-semibold' : ''}`}>ES</span>
                <span className="mx-1.5 text-gray-400">|</span>
                <span className={`${locale === 'en' ? 'font-semibold' : ''}`}>EN</span>
              </button>
              <button className="text-gray-600 transition-colors hover:text-gray-900">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <button className="text-gray-600 transition-colors hover:text-gray-900">
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 lg:px-8 lg:pt-40">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1
              className="text-5xl font-mono font-light tracking-wider text-gray-900 sm:text-6xl lg:text-7xl"
              variants={fadeIn}
            >
              {messages.hero.title}
              <span className="block font-mono font-normal tracking-wider">{messages.hero.titleHighlight}</span>
            </motion.h1>
            
            <motion.p
              className="mx-auto mt-8 max-w-2xl text-lg font-sans leading-relaxed text-gray-600"
              variants={fadeIn}
            >
              {messages.hero.description}
            </motion.p>

            <motion.div
              className="mt-12 flex justify-center"
              variants={fadeIn}
            >
              <button 
                onClick={() => router.push('/login')}
                className="group relative overflow-hidden rounded-lg border border-gray-300 px-32 py-4 text-lg font-medium text-gray-900 transition-all hover:border-gray-900">
                <span className="relative z-10">Get Started</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.div
              className="flex flex-col items-center"
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-center justify-center mb-1">
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-600 font-sans font-medium tracking-wide">
                Scroll to Explore
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dafel Hero Section */}
      <DafelSection />

      {/* Framework Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-screen bg-white">
        <div className="flex flex-col lg:flex-row h-full min-h-[600px] lg:min-h-screen">
          {/* Left Column - Content */}
          <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-8 py-16 lg:px-16 lg:py-0">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl lg:text-6xl leading-tight">
                  <span className="font-light">{messages.framework.titleLine1}</span>
                  <br />
                  <span className="font-semibold">{messages.framework.titleLine2}</span>
                </h2>
                <p className="mt-8 text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  {messages.framework.subtitle}
                </p>
                <button 
                  onClick={() => router.push('/login')}
                  className="mt-10 bg-gray-900 text-white px-10 py-4 rounded-lg font-medium text-base hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  {messages.framework.ctaButton}
                  <span className="text-lg">→</span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Visual Architecture */}
          <div className="w-full lg:w-[60%] bg-gradient-to-br from-emerald-50 to-teal-50 p-8 lg:p-12 flex items-center justify-center">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Panel Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">{messages.framework.panelBrand}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-medium text-gray-900 flex items-center gap-2">
                  {messages.framework.panelTitle}
                  <span className="text-2xl">→</span>
                </h3>
              </div>

              {/* Layer System */}
              <div className="space-y-8">
                {/* Layer 1 - Semantic */}
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-300 text-sm font-mono">01</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-4">{messages.framework.layers.semantic.title}</h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Isometric Visual */}
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Nodes */}
                            <circle cx="30" cy="40" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="60" cy="20" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="90" cy="35" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="45" cy="70" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="75" cy="65" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="60" cy="95" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            {/* Connections */}
                            <line x1="30" y1="40" x2="60" y2="20" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="60" y1="20" x2="90" y2="35" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="30" y1="40" x2="45" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="45" y1="70" x2="75" y2="65" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="75" y1="65" x2="90" y2="35" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="45" y1="70" x2="60" y2="95" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="75" y1="65" x2="60" y2="95" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                          </svg>
                        </div>
                        {/* Features */}
                        <ul className="flex-1 space-y-2 text-sm text-gray-600">
                          {messages.framework.layers.semantic.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Layer 2 - Kinetic */}
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-300 text-sm font-mono">02</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-4">{messages.framework.layers.kinetic.title}</h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Isometric Visual */}
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Flow paths */}
                            <path d="M 20 30 Q 40 20, 60 30 T 100 30" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"/>
                            <path d="M 20 60 Q 40 50, 60 60 T 100 60" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"/>
                            <path d="M 20 90 Q 40 80, 60 90 T 100 90" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"/>
                            {/* Nodes */}
                            <rect x="15" y="25" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            <rect x="55" y="25" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            <rect x="95" y="25" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            {/* Arrows */}
                            <polygon points="48,30 52,28 52,32" fill="#3b82f6"/>
                            <polygon points="88,30 92,28 92,32" fill="#3b82f6"/>
                            <polygon points="48,60 52,58 52,62" fill="#3b82f6"/>
                            <polygon points="88,60 92,58 92,62" fill="#3b82f6"/>
                          </svg>
                        </div>
                        {/* Features */}
                        <ul className="flex-1 space-y-2 text-sm text-gray-600">
                          {messages.framework.layers.kinetic.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Layer 3 - Dynamic */}
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-300 text-sm font-mono">03</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-4">{messages.framework.layers.dynamic.title}</h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Isometric Visual */}
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Decision tree structure */}
                            <circle cx="60" cy="20" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="35" cy="50" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="85" cy="50" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="20" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="50" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="70" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="100" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            {/* Connections */}
                            <line x1="60" y1="26" x2="35" y2="44" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="60" y1="26" x2="85" y2="44" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="35" y1="56" x2="20" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="35" y1="56" x2="50" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="85" y1="56" x2="70" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="85" y1="56" x2="100" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        {/* Features */}
                        <ul className="flex-1 space-y-2 text-sm text-gray-600">
                          {messages.framework.layers.dynamic.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-mono font-light tracking-wider text-gray-900 sm:text-4xl">
              Capacidades Core
            </h2>
            <p className="mt-4 text-lg font-sans text-gray-600">
              {messages.services.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                {messages.services.aiDecisions.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.aiDecisions.description}
              </p>
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {messages.services.learnMore}
              </button>
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                {messages.services.automation.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.automation.description}
              </p>
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {messages.services.learnMore}
              </button>
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                {messages.services.predictive.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.predictive.description}
              </p>
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {messages.services.learnMore}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <motion.div
          className="mx-auto max-w-4xl px-6 text-center lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-mono font-light tracking-wider text-gray-900">
            {messages.cta.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {messages.cta.subtitle}
          </p>
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="mt-8 rounded-lg bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800"
          >
            {messages.cta.button}
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-lg font-sans font-semibold text-gray-900">
                {messages.footer.company}
              </span>
              <p className="mt-2 text-sm font-sans text-gray-600">
                {messages.footer.rights}
              </p>
            </div>
            <div className="flex space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.privacy}
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.terms}
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.cookies}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        open={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen} 
      />
    </>
  );
}

