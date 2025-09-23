/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  
  // Performance optimizations
  trailingSlash: false,
  generateEtags: false,
  
  // Static optimization
  generateBuildId: async () => {
    return 'dafel-build-' + Date.now()
  },
  
  // Optimización de imágenes para máxima performance
  images: {
    domains: ['localhost', 'dafel-technologies.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año de cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    quality: 85, // Optimal balance between quality and size
  },
  
  // Headers de seguridad y performance
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // CSP para producción (sin eval)
    const productionCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // unsafe-inline necesario para Next.js
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.dafel-technologies.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
    
    return [
      {
        source: '/:path*',
        headers: [
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Solo aplicar CSP estricto en producción
          // El middleware maneja CSP para desarrollo
          ...(isDevelopment ? [] : [
            {
              key: 'Content-Security-Policy',
              value: productionCSP
            }
          ])
        ]
      },
      // Static assets caching
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  
  // Configuración de compilación
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Configuración de experimental para máximo rendimiento
  experimental: {
    optimizeCss: true, 
    scrollRestoration: true,
    typedRoutes: true,
    appDir: true,
    serverComponentsExternalPackages: ['sharp'],
    optimizePackageImports: ['@heroicons/react'],
    bundlePagesExternals: false,
  },
  
  // Configuración de webpack para máximo rendimiento
  webpack: (config, { dev, isServer }) => {
    // Performance optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    // Optimizaciones de producción
    if (!dev && !isServer) {
      // Advanced chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // React chunk
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI libraries chunk
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](@heroicons|@headlessui|@radix-ui|framer-motion)[\\/]/,
            priority: 30,
            enforce: true,
          },
          // Common vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            enforce: true,
          },
          // Common app code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          }
        }
      };
      
      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze.html',
          openAnalyzer: true,
        })
      );
    }
    
    return config;
  },
  
  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Configuración de rewrites para API proxy
  // Comentado temporalmente para desarrollo local
  // async rewrites() {
  //   return [
  //     // Excluir rutas de NextAuth y rutas internas de Next.js
  //     {
  //       source: '/api/:path((?!auth|users|audit-logs).*)',
  //       destination: process.env.NEXT_PUBLIC_API_URL 
  //         ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
  //         : 'http://localhost:8000/api/:path*',
  //     },
  //   ];
  // },
  
  // Configuración de entorno
  env: {
    NEXT_PUBLIC_APP_NAME: 'Dafel Technologies',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  
  // Configuración de i18n (preparado para futuro)
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localeDetection: false,
  },
  
  // Output standalone para Docker
  output: 'standalone',
};

module.exports = nextConfig;