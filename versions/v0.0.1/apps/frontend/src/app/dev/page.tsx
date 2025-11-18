'use client';

import { motion } from 'framer-motion';
import { CodeBracketIcon, DocumentTextIcon, ServerIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DevIndexPage() {
  const versions = [
    {
      version: 'v0.0.0',
      name: 'Versión Base',
      description: 'Sistema base completo con todas las funcionalidades principales',
      url: '/dev/v00',
      status: 'active',
      features: [
        'Sistema de autenticación NextAuth.js',
        'Base de datos PostgreSQL + Prisma',
        'Interface Hub para gestión de clientes',
        'Página principal profesional',
        'Backup completo disponible'
      ],
      date: '2024-11-18'
    },
    {
      version: 'v0.0.1',
      name: 'Versión Desarrollo',
      description: 'Nueva versión para experimentación y desarrollo iterativo',
      url: '/dev/v01',
      status: 'development',
      features: [
        'Copia exacta de v0.0.0 como base',
        'Lista para modificaciones experimentales',
        'Backup automático incluido',
        'Versión independiente y segura',
        'Sin afectar producción ni v00'
      ],
      date: '2024-11-18'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'development':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                <p className="text-sm text-gray-600">Ambiente de Desarrollo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                ← Página Principal
              </Link>
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
            <ServerIcon className="w-4 h-4 mr-2" />
            Development Environment - dafel.com.mx/dev/
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔧 Versiones de Desarrollo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accede a todas las versiones de desarrollo del sistema Dafel Technologies.
            Cada versión tiene su entorno completo y está disponible públicamente para testing.
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <CodeBracketIcon className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Versiones Activas</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{versions.length}</p>
            <p className="text-sm text-gray-600">Entornos de desarrollo disponibles</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <ServerIcon className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado del Sistema</h3>
            <p className="text-lg font-bold text-green-600 mb-2">Operativo</p>
            <p className="text-sm text-gray-600">Todos los servicios funcionando</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <DocumentTextIcon className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Última Actualización</h3>
            <p className="text-lg font-bold text-purple-600 mb-2">Hoy</p>
            <p className="text-sm text-gray-600">18 de Noviembre, 2024</p>
          </div>
        </motion.div>

        {/* Versions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Versiones Disponibles</h3>
          <div className="space-y-6">
            {versions.map((version, index) => (
              <motion.div
                key={version.version}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <CodeBracketIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-semibold text-gray-900">{version.name}</h4>
                          <span className="text-lg font-mono text-gray-500">{version.version}</span>
                          <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(version.status)}`}>
                            {version.status === 'active' ? '🟢 Activa' : version.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{version.description}</p>
                        <p className="text-sm text-gray-500">Fecha: {version.date}</p>
                      </div>
                    </div>
                    <Link
                      href={version.url}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Ver Versión</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="border-t pt-6">
                    <h5 className="font-medium text-gray-900 mb-3">Características incluidas:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {version.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <strong>URL pública:</strong> 
                        <a 
                          href={`https://dafel.com.mx${version.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 font-mono"
                        >
                          dafel.com.mx{version.url}
                        </a>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`https://dafel.com.mx${version.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Abrir en nueva ventana ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Future Versions Note */}
        <motion.div
          className="mt-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CodeBracketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Nuevas Versiones</h4>
          <p className="text-gray-600 mb-4">
            Las futuras versiones aparecerán aquí automáticamente cuando se creen con el comando <code className="bg-gray-200 px-2 py-1 rounded">/newversion</code>
          </p>
          <p className="text-sm text-gray-500">
            Cada nueva versión tendrá su propia URL: <code>dafel.com.mx/dev/v01</code>, <code>dafel.com.mx/dev/v02</code>, etc.
          </p>
        </motion.div>

        {/* Technical Footer */}
        <motion.div
          className="text-center mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-600">
            <strong>Ambiente de Desarrollo Dafel Technologies</strong> - Todas las versiones son públicamente accesibles
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Sistema de versionado automático • Backups locales completos • URLs permanentes
          </p>
        </motion.div>
      </div>
    </div>
  );
}