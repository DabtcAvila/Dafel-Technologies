import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthProvider from '@/providers/AuthProvider';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { dmSans, dmMono } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Dafel Technologies - Soluciones Corporativas de IA',
  description: 'Transformamos empresas con soluciones de Inteligencia Artificial de vanguardia',
  keywords: 'IA, Inteligencia Artificial, Machine Learning, Deep Learning, Consultoría, Tecnología',
  authors: [{ name: 'Dafel Technologies' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#000000' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Dafel Technologies',
    description: 'Soluciones Corporativas de Inteligencia Artificial',
    url: 'https://dafel.com.mx',
    siteName: 'Dafel Technologies',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dafel Technologies',
    description: 'Soluciones Corporativas de Inteligencia Artificial',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // CSP para desarrollo que permite eval
  const cspContent = isDevelopment
    ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.dafel-technologies.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";
  
  return (
    <html lang="es" suppressHydrationWarning className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* Critical CSS para eliminación inmediata de scrollbars */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html,body{margin:0!important;padding:0!important;overflow-x:hidden!important;width:100vw!important;max-width:100vw!important;box-sizing:border-box!important;scrollbar-width:none!important;-ms-overflow-style:none!important}
            html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
            body{margin-top:0!important;width:calc(100vw + 17px)!important;max-width:calc(100vw + 17px)!important}
            *,*::before,*::after{box-sizing:border-box!important}
            #__next{width:100vw!important;max-width:100vw!important;overflow-x:hidden!important}
            *::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
            *{scrollbar-width:none!important;-ms-overflow-style:none!important}
          `
        }} />
        
        {/* Critical CSS and Resource Hints */}
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical DM Sans resources */}
        <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        
        {/* Critical inline CSS for instant paint with DM Sans */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for instant paint with DM Sans optimization */
            html { font-family: var(--font-sans), system-ui, sans-serif; }
            body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .loading-spinner { 
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
              width: 32px; height: 32px; border: 2px solid #f3f3f3;
              border-top: 2px solid #000; border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
            .hero-gradient { background: #ffffff; }
            /* DM Sans font performance optimization */
            .windsurf-heading { font-family: var(--font-sans); font-weight: 700; }
          `
        }} />
        
        {/* Prefetch next likely pages */}
        <link rel="prefetch" href="/login" />
        <link rel="prefetch" href="/studio" />
      </head>
      <body className={`${dmSans.className} font-sans antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <ServiceWorkerRegistration />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}