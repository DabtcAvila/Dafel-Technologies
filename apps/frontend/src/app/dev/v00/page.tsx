'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CodeBracketIcon, ServerIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DevV00Page() {
  const [buildTime] = useState(new Date().toLocaleString());
  const [systemInfo, setSystemInfo] = useState({
    version: '0.0.0',
    environment: 'development',
    status: 'active'
  });

  useEffect(() => {
    // Simular carga de información del sistema
    const timer = setTimeout(() => {
      setSystemInfo({
        version: '0.0.0',
        environment: 'development',
        status: 'active'
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      name: 'Sistema de Autenticación',
      description: 'NextAuth.js configurado con login/logout funcional',
      status: 'completed',
      icon: CheckCircleIcon
    },
    {
      name: 'Base de Datos',
      description: 'PostgreSQL + Prisma ORM con esquemas completos',
      status: 'completed',
      icon: ServerIcon
    },
    {
      name: 'Interface Hub',
      description: 'Sistema de gestión de clientes operativo',
      status: 'completed',
      icon: CodeBracketIcon
    },
    {
      name: 'Página Principal',
      description: 'Landing page profesional con diseño responsivo',
      status: 'completed',
      icon: GlobeAltIcon
    }
  ];

  const urls = [
    {
      name: 'Página Principal',
      url: 'https://dafel.com.mx',
      description: 'Landing page principal'
    },
    {
      name: 'Sistema Hub',
      url: 'https://app.dafel.com.mx/hub',
      description: 'Gestión de clientes'
    },
    {
      name: 'Login',
      url: 'https://dafel.com.mx/login',
      description: 'Autenticación de usuarios'
    },
    {
      name: 'Desarrollo Local',
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src="/dafel-logo-optimized.svg"
                alt="Dafel Technologies"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dafel Technologies</h1>
                <p className="text-sm text-gray-600">Versión de Desarrollo v{systemInfo.version}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <CodeBracketIcon className="w-4 h-4 mr-2" />
            Versión Base v0.0.0 - Development Environment
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Sistema Base Operativo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Versión base del sistema Dafel Technologies completamente funcional y lista para desarrollo.
            Todas las funcionalidades principales están implementadas y operativas.
          </p>
        </motion.div>

        {/* System Status */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">Operativo</p>
            <p className="text-sm text-gray-600">Todos los servicios funcionando correctamente</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Versión</h3>
              <CodeBracketIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">v{systemInfo.version}</p>
            <p className="text-sm text-gray-600">Versión base estable</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Último Build</h3>
              <ServerIcon className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-purple-600 mb-2">{buildTime.split(',')[1]}</p>
            <p className="text-sm text-gray-600">{buildTime.split(',')[0]}</p>
          </div>
        </motion.div>

        {/* Features Status */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Estado de Funcionalidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="bg-white rounded-lg p-6 shadow-sm border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{feature.name}</h4>
                      {feature.status === 'completed' && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          ✅ Completo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* URLs Available */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">URLs Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urls.map((url, index) => (
              <motion.div
                key={url.name}
                className="bg-white rounded-lg p-4 shadow-sm border hover:border-blue-300 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{url.name}</h4>
                    <p className="text-sm text-gray-600">{url.description}</p>
                    <a 
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-mono break-all"
                    >
                      {url.url}
                    </a>
                  </div>
                  <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Info */}
        <motion.div
          className="bg-gray-900 rounded-lg p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-6">Información Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Framework</p>
              <p className="font-mono text-green-400">Next.js 14.2.32</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Lenguaje</p>
              <p className="font-mono text-blue-400">TypeScript 5.5.4</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Base de Datos</p>
              <p className="font-mono text-purple-400">PostgreSQL + Prisma</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Estilos</p>
              <p className="font-mono text-pink-400">TailwindCSS 3.4.7</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold mb-2">🎯 Esta versión incluye:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Sistema de autenticación completo</li>
                  <li>• Interface de gestión Hub operativa</li>
                  <li>• Base de datos configurada</li>
                  <li>• Página principal profesional</li>
                  <li>• Sistema de versionado automático</li>
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-colors"
                >
                  ← Volver a la página principal
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <p className="text-gray-600">
            <strong>Versión Base v0.0.0</strong> - Sistema completamente operativo y listo para desarrollo
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Backup completo disponible en <code className="bg-gray-100 px-2 py-1 rounded">versions/v0.0.0/</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}