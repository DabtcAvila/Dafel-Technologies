'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import { 
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CreditCardIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  FolderIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function ClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Enable auto logout functionality
  useAutoLogout();

  useEffect(() => {
    // Allow some time for NextAuth to establish session after login
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000); // Wait 1 second before checking authentication

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only redirect to login if definitively unauthenticated and not on initial load
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

  const clientSections = [
    { id: 'dashboard', name: 'Inicio', icon: ChartBarIcon },
    { id: 'documents', name: 'Mis Documentos', icon: DocumentTextIcon },
    { id: 'reports', name: 'Reportes', icon: FolderIcon },
    { id: 'billing', name: 'Facturación', icon: CreditCardIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'profile', name: 'Mi Perfil', icon: UserIcon },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center"
                >
                  <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-900">Portal del Cliente</h1>
                </motion.div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-2">
                  {clientSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <section.icon className="h-5 w-5 mr-3" />
                      {section.name}
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                {activeSection === 'dashboard' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido a tu Portal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <DocumentTextIcon className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-semibold">Documentos</h3>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm opacity-90">Disponibles</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <ChartBarIcon className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-semibold">Reportes</h3>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-sm opacity-90">Este mes</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <CreditCardIcon className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-semibold">Estado Cuenta</h3>
                        <p className="text-sm">Al día</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Nuevo documento disponible</p>
                          <p className="text-xs text-gray-500">Hace 2 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Reporte mensual generado</p>
                          <p className="text-xs text-gray-500">Ayer</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Perfil actualizado</p>
                          <p className="text-xs text-gray-500">Hace 3 días</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'documents' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Documentos</h2>
                    <p className="text-gray-600 mb-4">Accede a todos tus documentos y archivos.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((doc) => (
                        <div key={doc} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="text-sm font-medium text-gray-900">Documento {doc}</h4>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">Actualizado hace 2 días</p>
                          <button className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                            Descargar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'reports' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h2>
                    <p className="text-gray-600 mb-4">Consulta tus reportes actuariales y financieros.</p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-gray-500">Sistema de reportes en desarrollo</p>
                    </div>
                  </div>
                )}

                {activeSection === 'billing' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Facturación</h2>
                    <p className="text-gray-600 mb-4">Gestiona tus pagos y facturas.</p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-gray-500">Estado de cuenta: Al día</p>
                    </div>
                  </div>
                )}

                {activeSection === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>
                    <p className="text-gray-600 mb-4">Centro de notificaciones y alertas.</p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-gray-500">No hay notificaciones nuevas</p>
                    </div>
                  </div>
                )}

                {activeSection === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
                    <p className="text-gray-600 mb-4">Actualiza tu información personal.</p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input 
                            type="text" 
                            value={session.user?.name || ''}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            value={session.user?.email || ''}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}