'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast, Toaster } from 'react-hot-toast';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import { 
  CubeIcon,
  CircleStackIcon,
  CpuChipIcon,
  BeakerIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  BellIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';

// Import view components
import EstudiosView from '@/components/hub/views/EstudiosView';
import ReportesView from '@/components/hub/views/ReportesView';
import DocumentosView from '@/components/hub/views/DocumentosView';
import EstadoCuentaView from '@/components/hub/views/EstadoCuentaView';
import MensajesView from '@/components/hub/views/MensajesView';
import SettingsView from '@/components/hub/views/SettingsView';

export default function HubPage() {
  const { messages } = useLanguage();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeView, setActiveView] = useState('estudios');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Enable auto logout functionality
  useAutoLogout();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);


  // Add timeout for loading state to prevent infinite spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        setLoadingTimeout(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [status]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    const loadingToast = toast.loading('Cerrando sesión...', {
      style: {
        background: '#111827',
        color: '#fff',
      },
    });

    try {
      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Use redirect: false to handle redirect manually
      await signOut({ 
        redirect: false 
      });
      
      toast.dismiss(loadingToast);
      toast.success('Sesión cerrada correctamente', {
        duration: 2000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
      
      // Manual redirect to home page
      window.location.href = '/';
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al cerrar sesión', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      setIsLoggingOut(false);
    }
  };

  const navigateToAdmin = () => {
    if (session?.user?.role === 'ADMIN') {
      router.push('/hub/admin/users');
    } else {
      toast.error('Admin access required', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const sidebarItems = [
    { Icon: CubeIcon, id: 'estudios', label: 'Mis Estudios' },
    { Icon: ChartBarIcon, id: 'reportes', label: 'Reportes' },
    { Icon: CircleStackIcon, id: 'documentos', label: 'Documentos' },
    { Icon: CpuChipIcon, id: 'estado-cuenta', label: 'Estado de Cuenta' },
    { Icon: BeakerIcon, id: 'mensajes', label: 'Mensajes' },
    { Icon: Cog6ToothIcon, id: 'settings', label: 'Settings' }
  ];

  // Show loading state while session is being fetched (with timeout)
  if (status === 'loading' && !loadingTimeout) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="h-12 w-12 border-4 border-gray-300 border-t-gray-900 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[60px] bg-gray-900 flex flex-col items-center justify-center relative z-10">
          <div className="space-y-6">
            {sidebarItems.map(({ Icon, id, label }) => (
              <div key={id} className="relative group">
                <button
                  onClick={() => setActiveView(id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    activeView === id 
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </button>
                {/* Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="relative bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {label}
                    {/* Arrow pointing to the icon */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Admin Access Button (only for admins) */}
            {session?.user?.role === 'ADMIN' && (
              <div className="relative group mt-8">
                <button
                  onClick={navigateToAdmin}
                  className="p-2 rounded-lg transition-all duration-200 text-amber-400 hover:bg-gray-800"
                >
                  <UsersIcon className="h-6 w-6" />
                </button>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="relative bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    Admin Panel
                    {/* Arrow pointing to the icon */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Header - Compact Design */}
          <div className="bg-white border-b border-gray-200 h-[60px] px-6">
            <div className="flex justify-between items-center h-full">
              {/* Left side */}
              <div className="flex items-center gap-3">
                <img
                  src="/dafel-logo-optimized.svg"
                  alt="Dafel Hub Portal"
                  className="h-16 w-auto"
                />
                
                {/* Status Pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f9fafb] rounded-[20px]">
                  {/* Online indicator */}
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  
                  <span className="text-sm text-gray-700">{(session?.user?.role || 'VIEWER').toLowerCase()}</span>
                </div>
              </div>
              
              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[#f3f4f6]"
                  title="Notifications"
                >
                  <BellIcon className="h-5 w-5 text-[#6b7280] hover:text-gray-900" />
                </button>
                
                {/* Settings */}
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[#f3f4f6]"
                  title="Settings"
                >
                  <Cog8ToothIcon className="h-5 w-5 text-[#6b7280] hover:text-gray-900" />
                </button>
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[#f3f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#6b7280] hover:text-gray-900" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 relative ${activeView === 'estudios' ? 'p-8' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeView === 'estudios' && <EstudiosView />}
                {activeView === 'reportes' && <ReportesView />}
                {activeView === 'documentos' && <DocumentosView />}
                {activeView === 'estado-cuenta' && <EstadoCuentaView />}
                {activeView === 'mensajes' && <MensajesView />}
                {activeView === 'settings' && <SettingsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}