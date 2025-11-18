import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Dafel Technologies - Consultoría Actuarial con Análisis Histórico | 5-15 Años',
  description: 'Transforme sus análisis actuariales con IA avanzada. Especialistas en análisis histórico de 5-15 años de datos. Consultoría empresarial para empresas medianas y grandes.',
  keywords: [
    'consultoría actuarial',
    'análisis actuarial IA',
    'datos históricos actuariales',
    'empresas medianas grandes',
    'análisis 5-15 años',
    'Dafel Technologies',
    'optimización fiscal actuarial',
    'modelado predictivo empresarial'
  ],
  authors: [{ name: 'Dafel Technologies', url: 'https://dafel.com.mx' }],
  creator: 'Dafel Technologies',
  publisher: 'Dafel Technologies',
  openGraph: {
    title: 'Dafel Technologies - Consultoría Actuarial con Análisis Histórico',
    description: 'Convertimos 5-15 años de reportes dispersos en ventaja estratégica actuarial. Análisis histórico inteligente para empresas medianas y grandes.',
    url: 'https://dafel.com.mx/new',
    siteName: 'Dafel Technologies',
    images: [
      {
        url: '/images/og-dafel-landing.webp',
        width: 1200,
        height: 630,
        alt: 'Dafel Technologies - Análisis Histórico Actuarial'
      }
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dafel Technologies - Consultoría Actuarial con Análisis Histórico',
    description: 'Convertimos 5-15 años de reportes dispersos en ventaja estratégica actuarial',
    images: ['/images/twitter-dafel-landing.webp'],
    creator: '@dafel_tech'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dafel.com.mx/new',
    languages: {
      'es-MX': 'https://dafel.com.mx/new',
      'en-US': 'https://dafel.com.mx/en/new'
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'business',
  classification: 'Actuarial Consulting Services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-MX" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Dafel Technologies",
              "alternateName": "Dafel Consulting",
              "description": "Consultoría actuarial especializada en análisis histórico de 5-15 años para empresas medianas y grandes",
              "url": "https://dafel.com.mx",
              "sameAs": [
                "https://linkedin.com/company/dafel-technologies",
                "https://twitter.com/dafel_tech"
              ],
              "logo": "https://dafel.com.mx/images/dafel-logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "MX",
                "addressLocality": "Ciudad de México"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+52-55-1234-5678",
                "contactType": "customer service",
                "availableLanguage": ["Spanish", "English"]
              },
              "foundingDate": "2009",
              "founder": {
                "@type": "Person",
                "name": "Dafel Technologies Team"
              },
              "serviceType": [
                "Análisis Actuarial Histórico",
                "Optimización Fiscal Actuarial", 
                "Modelado Predictivo Empresarial",
                "Consultoría en Pensiones y Beneficios"
              ],
              "areaServed": {
                "@type": "Country",
                "name": "México"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        
        {/* Analytics Scripts (to be added later) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                        page_path: window.location.pathname,
                      });
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </body>
    </html>
  )
}