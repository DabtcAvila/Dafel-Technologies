import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthProvider from '@/providers/AuthProvider';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import PerformanceMonitor from '@/components/PerformanceMonitor';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

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
    url: 'https://dafel-technologies.com',
    siteName: 'Dafel Technologies',
    locale: 'es_ES',
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
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Critical CSS and Resource Hints */}
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        
        {/* Critical inline CSS for instant paint */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for instant paint */
            html { font-family: var(--font-inter), system-ui, sans-serif; }
            body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .loading-spinner { 
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
              width: 32px; height: 32px; border: 2px solid #f3f3f3;
              border-top: 2px solid #000; border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
            .hero-gradient { background: linear-gradient(180deg, #f9fafb 0%, #ffffff 50%, #f9fafb 100%); }
          `
        }} />
        
        {/* Prefetch next likely pages */}
        <link rel="prefetch" href="/login" />
        <link rel="prefetch" href="/studio" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <ServiceWorkerRegistration />
            <PerformanceMonitor />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}