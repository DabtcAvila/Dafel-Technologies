'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { 
  CalendarIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function ClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' && !isInitialLoad) {
      router.push('/login');
    }
  }, [status, router, isInitialLoad]);

  if (status === 'loading' || isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img 
                  src="/dafel-logo-optimized.svg" 
                  alt="DAFEL Consulting" 
                  className="h-12 w-auto mr-4"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">Portal del Cliente</h1>
                  <p className="text-sm text-gray-600 leading-tight">DAFEL Consulting Services</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.user?.email}</p>
                  <p className="text-xs text-gray-500">{session.user?.role}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Pasivos Laborales
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Accede a tus valuaciones actuariales y documentos relacionados con pasivos laborales
            </p>
          </motion.div>

          {/* Main Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Valuación 2025 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer"
              onClick={() => toast.info('Próximamente: Valuación 2025')}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Valuación 2025</h3>
                  <p className="text-gray-600 mb-6">
                    Consulta la valuación actuarial más reciente para el año 2025
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    Acceder
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Último cálculo:</span>
                    <span className="font-medium">Enero 2025</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>Estado:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Actualizado
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Valuaciones Anteriores */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group cursor-pointer"
              onClick={() => toast.info('Próximamente: Valuaciones Anteriores')}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ArchiveBoxIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Valuaciones Anteriores</h3>
                  <p className="text-gray-600 mb-6">
                    Historial completo de valuaciones de años anteriores
                  </p>
                  <div className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                    Explorar Archivo
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Años disponibles:</span>
                    <span className="font-medium">2020 - 2024</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>Total documentos:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      24 archivos
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <ClipboardDocumentListIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Qué incluyen las valuaciones?</h3>
                <p className="text-gray-600">Cada valuación actuarial contiene información completa sobre tus pasivos laborales</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reporte Técnico</h4>
                  <p className="text-sm text-gray-600">Análisis detallado de la metodología y resultados</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Gráficos y Análisis</h4>
                  <p className="text-sm text-gray-600">Visualizaciones de tendencias y proyecciones</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CogIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Datos Técnicos</h4>
                  <p className="text-sm text-gray-600">Tablas de valores y cálculos actuariales</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <div className="text-sm font-medium text-gray-900">Valuación Actual</div>
              <div className="text-xs text-gray-500">2025</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm font-medium text-gray-900">Años Históricos</div>
              <div className="text-xs text-gray-500">2020-2024</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm font-medium text-gray-900">Acceso Disponible</div>
              <div className="text-xs text-gray-500">Siempre activo</div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}