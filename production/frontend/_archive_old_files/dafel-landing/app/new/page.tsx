'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports para optimización de bundle
const HeroSection = dynamic(() => import('@/components/landing/Hero/HeroSection'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dafel-blue-500"></div></div>
});

const ServicesOverview = dynamic(() => import('@/components/landing/Services/ServicesOverview'), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="skeleton h-32 w-full max-w-md"></div></div>
});

const DataAdvantage = dynamic(() => import('@/components/landing/Solutions/DataAdvantage'), {
  loading: () => <div className="h-64 flex items-center justify-center"><div className="skeleton h-24 w-full max-w-lg"></div></div>
});

const TestimonialCarousel = dynamic(() => import('@/components/landing/Testimonials/TestimonialCarousel'), {
  loading: () => <div className="h-80 flex items-center justify-center"><div className="skeleton h-40 w-full max-w-xl"></div></div>
});

const ContactSection = dynamic(() => import('@/components/landing/Contact/ContactSection'), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="skeleton h-48 w-full max-w-2xl"></div></div>
});

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-sand-50">
      {/* Hero Section */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-50 to-dafel-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dafel-blue-500 mx-auto mb-4"></div>
            <p className="text-dafel-slate-600">Cargando experiencia Dafel...</p>
          </div>
        </div>
      }>
        <HeroSection />
      </Suspense>

      {/* Services Overview */}
      <Suspense fallback={
        <section className="section-padding bg-white">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-16">
              <div className="skeleton h-8 w-64 mx-auto mb-4"></div>
              <div className="skeleton h-4 w-96 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-xl"></div>
              ))}
            </div>
          </div>
        </section>
      }>
        <ServicesOverview />
      </Suspense>

      {/* Data Advantage Section */}
      <Suspense fallback={
        <section className="section-padding bg-sand-50">
          <div className="container mx-auto container-padding">
            <div className="skeleton h-64 rounded-xl"></div>
          </div>
        </section>
      }>
        <DataAdvantage />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={
        <section className="section-padding bg-white">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-16">
              <div className="skeleton h-8 w-72 mx-auto mb-4"></div>
              <div className="skeleton h-4 w-80 mx-auto"></div>
            </div>
            <div className="skeleton h-80 rounded-xl"></div>
          </div>
        </section>
      }>
        <TestimonialCarousel />
      </Suspense>

      {/* Contact Section */}
      <Suspense fallback={
        <section className="section-padding bg-dafel-blue-900 text-white">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-16">
              <div className="skeleton h-8 w-96 mx-auto mb-4 bg-white/20"></div>
              <div className="skeleton h-4 w-80 mx-auto bg-white/10"></div>
            </div>
            <div className="skeleton h-96 rounded-xl bg-white/10"></div>
          </div>
        </section>
      }>
        <ContactSection />
      </Suspense>

      {/* Footer */}
      <footer className="bg-dafel-slate-900 text-white py-16">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dafel-blue-400 mb-4">
              DAFEL Technologies
            </h2>
            <p className="text-dafel-slate-300 mb-8">
              Transformando datos históricos en ventaja estratégica desde 2009
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="font-semibold mb-4">Servicios</h3>
                <ul className="space-y-2 text-sm text-dafel-slate-300">
                  <li>Análisis Histórico</li>
                  <li>Optimización Fiscal</li>
                  <li>Modelado Predictivo</li>
                  <li>Consultoría Actuarial</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Empresa</h3>
                <ul className="space-y-2 text-sm text-dafel-slate-300">
                  <li>15+ años de experiencia</li>
                  <li>500+ empresas</li>
                  <li>$50M+ en valor identificado</li>
                  <li>Certificaciones profesionales</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Contacto</h3>
                <ul className="space-y-2 text-sm text-dafel-slate-300">
                  <li>contacto@dafel.com.mx</li>
                  <li>Ciudad de México</li>
                  <li>+52 55 1234 5678</li>
                  <li>LinkedIn • Twitter</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-dafel-slate-800 pt-8">
              <p className="text-sm text-dafel-slate-400">
                © 2025 DAFEL Technologies. Todos los derechos reservados. 
                <span className="mx-2">•</span>
                15 años transformando datos actuariales en ventaja competitiva.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}