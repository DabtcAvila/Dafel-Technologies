'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast, Toaster } from 'react-hot-toast';
import { 
  CubeIcon,
  CircleStackIcon,
  CpuChipIcon,
  BeakerIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function StudioPage() {
  const { messages } = useLanguage();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeIcon, setActiveIcon] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    const loadingToast = toast.loading('Signing out...', {
      style: {
        background: '#111827',
        color: '#fff',
      },
    });

    try {
      await signOut({ redirect: false });
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully', {
        duration: 2000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
      
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to logout', {
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
      router.push('/studio/admin/users');
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

  const sidebarIcons = [
    { Icon: CubeIcon, id: 0, tooltip: 'Components' },
    { Icon: CircleStackIcon, id: 1, tooltip: 'Data Sources' },
    { Icon: CpuChipIcon, id: 2, tooltip: 'Processing' },
    { Icon: BeakerIcon, id: 3, tooltip: 'Testing' },
    { Icon: ChartBarIcon, id: 4, tooltip: 'Analytics' },
    { Icon: Cog6ToothIcon, id: 5, tooltip: 'Settings' }
  ];

  const workflowNodes = [
    { id: 'data', label: messages.studio?.data || 'Data', x: 100, y: 250 },
    { id: 'process', label: messages.studio?.process || 'Process', x: 300, y: 250 },
    { id: 'ai', label: messages.studio?.ai || 'AI', x: 500, y: 250 },
    { id: 'output', label: messages.studio?.output || 'Output', x: 700, y: 250 }
  ];

  // Show loading state while session is being fetched
  if (status === 'loading') {
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
        <div className="w-[60px] bg-gray-900 flex flex-col items-center py-6">
          <div className="flex-1 space-y-6">
            {sidebarIcons.map(({ Icon, id, tooltip }) => (
              <div key={id} className="relative group">
                <button
                  onClick={() => setActiveIcon(id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    activeIcon === id 
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </button>
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {tooltip}
                </div>
              </div>
            ))}
          </div>
          
          {/* Admin Access Button (only for admins) */}
          {session?.user?.role === 'ADMIN' && (
            <div className="relative group mb-4">
              <button
                onClick={navigateToAdmin}
                className="p-2 rounded-lg transition-all duration-200 text-amber-400 hover:bg-gray-800"
              >
                <UsersIcon className="h-6 w-6" />
              </button>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Admin Panel
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <h1 className="text-3xl font-mono font-light tracking-wider text-gray-900">
                  Dafel Studio
                </h1>
                {/* User Role Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(session?.user?.role || '')}`}>
                  {session?.user?.role}
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className="relative">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    {session?.user?.role === 'ADMIN' && (
                      <ShieldCheckIcon className="h-4 w-4 text-amber-500 absolute -bottom-1 -right-1" />
                    )}
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>{messages.studio?.logout || 'Logout'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-8 relative">
            <div className="h-full bg-white rounded-lg border border-gray-200 relative overflow-hidden">
              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill="#9ca3af"
                    />
                  </marker>
                </defs>
                {/* Connection lines */}
                <line
                  x1="180"
                  y1="250"
                  x2="220"
                  y2="250"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line
                  x1="380"
                  y1="250"
                  x2="420"
                  y2="250"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <line
                  x1="580"
                  y1="250"
                  x2="620"
                  y2="250"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              </svg>

              {/* Workflow Nodes */}
              {workflowNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  className="absolute"
                  style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="bg-white border-2 border-gray-900 rounded-lg px-6 py-4 cursor-move hover:shadow-lg transition-shadow">
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Instruction text */}
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <p className="text-sm font-sans text-gray-500">
                  {messages.studio?.dragPrompt || 'Drag components to build your workflow'}
                </p>
              </motion.div>

              {/* Security Status Indicator */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-2 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                <span>Secure Session Active</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}