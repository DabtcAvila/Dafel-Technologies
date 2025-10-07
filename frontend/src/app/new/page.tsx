'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import HeroSection from '@/components/landing/Hero/HeroSection';
import { 
  RainbowBackground, 
  RainbowText, 
  InteractiveElement, 
  ScrollAnimated,
  PerformanceContainer,
  WindsurfProvider 
} from '@/components/windsurf';
import { WindsurfEngine } from '@/lib/windsurf-engine';

export default function NewLandingPage() {
  // Initialize WindsurfEngine for enhanced animations
  const windsurfConfig = {
    colorConfig: {
      hue: 180,
      saturation: 65,
      lightness: 67
    },
    animationConfig: {
      duration: 3000,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      delay: 0,
      repeat: 'infinite' as const,
      direction: 'normal' as const
    },
    performanceConfig: {
      maxFPS: 60,
      gpuAcceleration: true,
      reducedMotion: false,
      batteryAware: true,
      memoryThreshold: 100 * 1024 * 1024
    },
    debug: process.env.NODE_ENV === 'development'
  };

  const features = [
    {
      title: "Análisis Histórico Inteligente",
      description: "Procesamos 5-15 años de reportes actuariales para identificar patrones únicos en tu empresa."
    },
    {
      title: "Optimización Fiscal Demostrable",
      description: "89% de precisión en proyecciones que generan ahorros fiscales promedio del 18%."
    },
    {
      title: "Implementación en 48 Horas",
      description: "Análisis gratuito de tu histórico con recomendaciones específicas y roadmap personalizado."
    }
  ];

  return (
    <WindsurfProvider config={windsurfConfig}>
      <PerformanceContainer monitoring={true}>
        <main className="min-h-screen bg-white relative overflow-hidden">
          {/* Enhanced Rainbow Background */}
          <RainbowBackground 
            intensity="medium" 
            speed="normal" 
            direction="diagonal"
            className="absolute inset-0 z-0"
          >
            <div className="windsurf-gradient-system" />
          </RainbowBackground>
          
          {/* Content Layer */}
          <div className="relative z-10">
            {/* Hero Section with Windsurf Enhancement */}
            <InteractiveElement 
              className="windsurf-hero-background"
              onHover={(isHovered) => console.log('Hero hovered:', isHovered)}
            >
              <HeroSection />
            </InteractiveElement>

            {/* Enhanced Features Section with Windsurf Animations */}
            <ScrollAnimated
              animationType="fadeIn"
              threshold={0.2}
              delay={0.3}
            >
              <section className="py-24 bg-slate-50/50 relative">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 opacity-30">
                  <div className="windsurf-gradient-system windsurf-fade-in-scale" />
                </div>

                <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                  <InteractiveElement className="text-center mb-16">
                    <ScrollAnimated animationType="slideUp" delay={0.2}>
                      <RainbowText 
                        as="h2" 
                        gradient="rainbow"
                        className="text-3xl lg:text-5xl font-bold mb-6 windsurf-heading"
                      >
                        ¿Por qué el análisis histórico 
                        <br />
                        <span className="windsurf-text-gradient">cambia todo?</span>
                      </RainbowText>
                    </ScrollAnimated>

                    <ScrollAnimated animationType="fadeIn" delay={0.4}>
                      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Tu ventaja no está en el software más nuevo, sino en tu data más antigua 
                        analizada inteligentemente.
                      </p>
                    </ScrollAnimated>
                  </InteractiveElement>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                      <ScrollAnimated
                        key={index}
                        animationType="scaleIn"
                        delay={index * 0.1 + 0.5}
                      >
                        <InteractiveElement 
                          className="windsurf-card text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-100 transition-all duration-200 hover:shadow-xl"
                          onHover={(isHovered) => {
                            // Enhanced hover effects handled by WindsurfEngine
                          }}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <RainbowText 
                            as="h3" 
                            gradient="ocean"
                            className="text-xl font-semibold text-slate-900 mb-3"
                          >
                            {feature.title}
                          </RainbowText>
                          <p className="text-slate-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </InteractiveElement>
                      </ScrollAnimated>
                    ))}
                  </div>
                </div>
              </section>
            </ScrollAnimated>

            {/* Enhanced Contact CTA Section with Windsurf Magic */}
            <ScrollAnimated
              animationType="slideUp"
              threshold={0.1}
              delay={0.2}
            >
              <section className="py-24 bg-slate-900 relative overflow-hidden">
                {/* Advanced Rainbow Background for CTA */}
                <RainbowBackground 
                  intensity="high" 
                  speed="slow" 
                  direction="radial"
                  className="absolute inset-0 opacity-20"
                >
                  <div className="windsurf-gradient-system windsurf-pulse" />
                </RainbowBackground>

                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                  <InteractiveElement>
                    <ScrollAnimated animationType="fadeIn" delay={0.3}>
                      <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 windsurf-heading">
                        Transforma tu histórico
                        <br />
                        <RainbowText 
                          as="span" 
                          gradient="rainbow"
                          className="windsurf-text-gradient block mt-2"
                        >
                          en ventaja hoy
                        </RainbowText>
                      </h2>
                    </ScrollAnimated>

                    <ScrollAnimated animationType="fadeIn" delay={0.5}>
                      <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Análisis gratuito de tu histórico actuarial. 
                        En 48 horas recibes oportunidades específicas identificadas.
                      </p>
                    </ScrollAnimated>
                    
                    <ScrollAnimated animationType="scaleIn" delay={0.7}>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <InteractiveElement
                          className="windsurf-button windsurf-interactive windsurf-ripple"
                          onHover={(isHovered) => console.log('Primary button hovered:', isHovered)}
                        >
                          <Button 
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                          >
                            Analizar Mi Histórico Gratuito
                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                          </Button>
                        </InteractiveElement>
                        
                        <InteractiveElement
                          className="windsurf-interactive windsurf-ripple"
                        >
                          <Button 
                            variant="outline"
                            size="lg"
                            className="px-12 py-4 rounded-xl font-semibold border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                          >
                            Ver Casos de Éxito
                          </Button>
                        </InteractiveElement>
                      </div>
                    </ScrollAnimated>

                    <ScrollAnimated animationType="slideUp" delay={0.9}>
                      <div className="mt-12 pt-8 border-t border-slate-800">
                        <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
                          <InteractiveElement className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full windsurf-pulse" />
                            <span>15+ años de experiencia</span>
                          </InteractiveElement>
                          <InteractiveElement className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full windsurf-pulse" />
                            <span>500+ empresas transformadas</span>
                          </InteractiveElement>
                          <InteractiveElement className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full windsurf-pulse" />
                            <span>$50M+ en valor identificado</span>
                          </InteractiveElement>
                        </div>
                      </div>
                    </ScrollAnimated>
                  </InteractiveElement>
                </div>
              </section>
            </ScrollAnimated>

            {/* Enhanced Footer with Windsurf Elements */}
            <ScrollAnimated animationType="fadeIn" threshold={0.8}>
              <footer className="py-12 bg-white/95 backdrop-blur-sm border-t border-slate-100 relative">
                {/* Subtle footer gradient */}
                <div className="absolute inset-0 opacity-10">
                  <RainbowBackground 
                    intensity="low" 
                    speed="slow" 
                    direction="horizontal"
                  />
                </div>
                
                <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <InteractiveElement className="mb-4 md:mb-0">
                      <RainbowText 
                        as="h3" 
                        gradient="ocean"
                        className="text-2xl font-bold text-slate-900 mb-2 windsurf-heading"
                      >
                        DAFEL Technologies
                      </RainbowText>
                      <p className="text-slate-600">Transformando datos históricos en ventaja estratégica</p>
                    </InteractiveElement>
                    
                    <InteractiveElement className="text-center md:text-right">
                      <p className="text-sm text-slate-500 mb-2">contacto@dafel.com.mx</p>
                      <p className="text-sm text-slate-400">
                        © 2025 DAFEL Technologies. Todos los derechos reservados.
                      </p>
                    </InteractiveElement>
                  </div>
                </div>
              </footer>
            </ScrollAnimated>
          </div>
        </main>
      </PerformanceContainer>
    </WindsurfProvider>
  );
}