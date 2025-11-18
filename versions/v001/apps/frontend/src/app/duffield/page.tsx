import { Metadata } from 'next'
import { HeroSection } from '@/components/landing/Hero/HeroSection'
import { ServicesOverview } from '@/components/landing/Services/ServicesOverview'
import { ContactSection } from '@/components/landing/Contact/ContactSection'
import { TestimonialCarousel } from '@/components/landing/Testimonials/TestimonialCarousel'
import Container from '@/components/ui/Container'
import PathsBackground from '@/components/ui/PathsBackground'

export const metadata: Metadata = {
  title: 'Dafel - Soluciones Empresariales de IA',
  description: 'Transformamos tu negocio con soluciones de inteligencia artificial de vanguardia',
  openGraph: {
    title: 'Dafel - Soluciones Empresariales de IA',
    description: 'Transformamos tu negocio con soluciones de inteligencia artificial de vanguardia',
    type: 'website',
  }
}

export default function DuffieldLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Paths Background */}
      <PathsBackground className="opacity-30 dark:opacity-20" />
      
      {/* Hero Section */}
      <section className="relative z-10">
        <Container>
          <div className="py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              DAFEL
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Soluciones Empresariales de IA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transformamos tu negocio con tecnología de inteligencia artificial de vanguardia. 
              Desde automatización hasta análisis predictivo, llevamos tu empresa al futuro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Solicitar Demo
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                Ver Soluciones
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative z-10">
        <Container>
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Nuestros Servicios
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones completas de IA adaptadas a las necesidades específicas de tu industria
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Análisis Predictivo</h4>
              <p className="text-gray-600">Anticipa tendencias y optimiza decisiones empresariales con modelos de machine learning avanzados.</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Automatización IA</h4>
              <p className="text-gray-600">Automatiza procesos complejos y libera a tu equipo para tareas estratégicas de mayor valor.</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Chatbots Inteligentes</h4>
              <p className="text-gray-600">Mejora la experiencia del cliente con asistentes virtuales que aprenden y evolucionan.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative z-10">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Proyectos Exitosos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfacción Cliente</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Soporte Técnico</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Años de Experiencia</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50/80 backdrop-blur-sm relative z-10">
        <Container>
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              ¿Listo para Transformar tu Negocio?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contáctanos hoy y descubre cómo la IA puede revolucionar tu empresa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Agendar Consulta Gratuita
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                +52 (555) 123-4567
              </button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}