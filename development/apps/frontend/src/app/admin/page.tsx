'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { 
  CogIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  WrenchScrewdriverIcon,
  ServerIcon,
  KeyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Estados para la gestión de clientes
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    grupo: '',
    empresa: '',
    cliente: '',
    cuenta: '',
    password: '',
    years: {}
  });
  
  // Datos de ejemplo de clientes
  const [clients, setClients] = useState([
    {
      id: 1,
      grupo: 'Grupo Industrial A',
      empresa: 'Empresa ABC S.A.',
      cliente: 'Juan Pérez',
      cuenta: 'abc@dafel.com',
      password: 'password123',
      years: {
        2016: { status: 'available', files: ['documento_2016.pdf'] },
        2017: { status: 'available', files: ['reporte_2017.pdf'] },
        2018: { status: 'available', files: ['valuacion_2018.pdf'] },
        2019: { status: 'available', files: [] },
        2020: { status: 'available', files: ['informe_2020.pdf', 'anexo_2020.xlsx'] },
        2021: { status: 'available', files: [] },
        2022: { status: 'available', files: [] },
        2023: { status: 'available', files: [] },
        2024: { status: 'available', files: [] },
        2025: { status: 'unavailable', files: [] }
      }
    },
    {
      id: 2,
      grupo: 'Grupo Casa Lumbre',
      empresa: 'Mezcal Casa Lumbre',
      cliente: 'María González',
      cuenta: 'casalumbre@dafel.com',
      password: 'lumbre2024',
      years: {
        2016: { status: 'unavailable', files: [] },
        2017: { status: 'unavailable', files: [] },
        2018: { status: 'available', files: ['casa_lumbre_2018.pdf'] },
        2019: { status: 'available', files: [] },
        2020: { status: 'available', files: [] },
        2021: { status: 'available', files: [] },
        2022: { status: 'available', files: [] },
        2023: { status: 'available', files: [] },
        2024: { status: 'available', files: [] },
        2025: { status: 'progress', files: [] }
      }
    },
    {
      id: 3,
      grupo: 'Grupo Aerzen',
      empresa: 'Aerzen Mexicana',
      cliente: 'Carlos Rodríguez',
      cuenta: 'aerzen@dafel.com',
      password: 'aerzen123',
      years: {
        2016: { status: 'available', files: ['aerzen_2016_v1.pdf', 'aerzen_2016_v2.pdf'] },
        2017: { status: 'available', files: [] },
        2018: { status: 'available', files: [] },
        2019: { status: 'available', files: [] },
        2020: { status: 'available', files: [] },
        2021: { status: 'available', files: [] },
        2022: { status: 'available', files: [] },
        2023: { status: 'available', files: [] },
        2024: { status: 'available', files: [] },
        2025: { status: 'unavailable', files: [] }
      }
    },
    {
      id: 4,
      grupo: 'Sistema',
      empresa: 'Dafel Technologies',
      cliente: 'System Client',
      cuenta: 'system@client.com',
      password: 'system123',
      years: {
        2016: { status: 'not-applicable', files: [] },
        2017: { status: 'not-applicable', files: [] },
        2018: { status: 'not-applicable', files: [] },
        2019: { status: 'not-applicable', files: [] },
        2020: { status: 'not-applicable', files: [] },
        2021: { status: 'not-applicable', files: [] },
        2022: { status: 'not-applicable', files: [] },
        2023: { status: 'not-applicable', files: [] },
        2024: { status: 'available', files: [] },
        2025: { status: 'progress', files: [] }
      }
    }
  ]);

  // Funciones para manejar la edición
  const handleEditClient = (client) => {
    setEditingClient({...client});
    setShowEditModal(true);
  };

  const handleSaveClient = () => {
    setClients(clients.map(client => 
      client.id === editingClient.id ? editingClient : client
    ));
    setShowEditModal(false);
    setEditingClient(null);
    toast.success('Cliente actualizado correctamente');
  };

  const handleYearClick = (client, year) => {
    setEditingClient(client);
    setSelectedYear(year);
    setShowFileModal(true);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const clientId = editingClient.id;
    const year = selectedYear;
    
    // Actualizar cliente con nuevos archivos
    const updatedClient = { ...editingClient };
    updatedClient.years[year].files = [...updatedClient.years[year].files, ...files.map(f => f.name)];
    
    setClients(clients.map(client => 
      client.id === clientId ? updatedClient : client
    ));
    setEditingClient(updatedClient);
    
    toast.success(`${files.length} archivo(s) agregado(s) para ${year}`);
  };

  const handleDeleteFile = (fileName) => {
    const clientId = editingClient.id;
    const year = selectedYear;
    
    const updatedClient = { ...editingClient };
    updatedClient.years[year].files = updatedClient.years[year].files.filter(file => file !== fileName);
    
    setClients(clients.map(client => 
      client.id === clientId ? updatedClient : client
    ));
    setEditingClient(updatedClient);
    
    toast.success(`Archivo eliminado: ${fileName}`);
  };

  const handleDeleteClient = () => {
    if (deleteConfirmText === 'ELIMINAR') {
      setClients(clients.filter(client => client.id !== editingClient.id));
      setShowEditModal(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      setEditingClient(null);
      toast.success(`Cliente ${editingClient.empresa} eliminado correctamente`);
    } else {
      toast.error('Debe escribir exactamente "ELIMINAR" para confirmar');
    }
  };

  const handleAddClient = () => {
    // Validaciones básicas
    if (!newClient.grupo || !newClient.empresa || !newClient.cliente || !newClient.cuenta || !newClient.password) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Verificar email único
    if (clients.some(client => client.cuenta === newClient.cuenta)) {
      toast.error('Ya existe un cliente con ese email');
      return;
    }

    // Crear nuevo cliente con ID único y años por defecto
    const clientWithDefaults = {
      ...newClient,
      id: Math.max(...clients.map(c => c.id)) + 1,
      years: {}
    };

    // Inicializar todos los años como "no disponible"
    [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].forEach(year => {
      clientWithDefaults.years[year] = { status: 'unavailable', files: [] };
    });

    setClients([...clients, clientWithDefaults]);
    setShowAddModal(false);
    setNewClient({
      grupo: '',
      empresa: '',
      cliente: '',
      cuenta: '',
      password: '',
      years: {}
    });
    toast.success(`Cliente ${newClient.empresa} agregado correctamente`);
  };

  const handleExportCSV = () => {
    // Crear headers del CSV
    const headers = ['Grupo', 'Empresa', 'Cliente', 'Cuenta', 'Contraseña', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', 'Total Archivos'];
    
    // Crear filas de datos
    const rows = clients.map(client => {
      const totalFiles = Object.values(client.years).reduce((total, yearData) => total + (yearData.files?.length || 0), 0);
      
      return [
        client.grupo,
        client.empresa,
        client.cliente,
        client.cuenta,
        client.password,
        client.years[2016]?.status || 'unavailable',
        client.years[2017]?.status || 'unavailable',
        client.years[2018]?.status || 'unavailable',
        client.years[2019]?.status || 'unavailable',
        client.years[2020]?.status || 'unavailable',
        client.years[2021]?.status || 'unavailable',
        client.years[2022]?.status || 'unavailable',
        client.years[2023]?.status || 'unavailable',
        client.years[2024]?.status || 'unavailable',
        client.years[2025]?.status || 'unavailable',
        totalFiles
      ];
    });

    // Combinar headers y rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_dafel_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Archivo CSV descargado correctamente');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓</span>;
      case 'unavailable':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">✗</span>;
      case 'progress':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">◌</span>;
      case 'not-applicable':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">—</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">?</span>;
    }
  };

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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

  const adminSections = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'users', name: 'Usuarios', icon: UsersIcon },
    { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'system', name: 'Sistema', icon: ServerIcon },
    { id: 'reports', name: 'Reportes', icon: DocumentTextIcon },
    { id: 'tools', name: 'Herramientas', icon: WrenchScrewdriverIcon },
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
                  <ShieldCheckIcon className="h-8 w-8 text-red-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
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
                  {adminSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-red-50 text-red-700 border border-red-200'
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Administrativo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <UsersIcon className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-semibold">Total Usuarios</h3>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <ChartBarIcon className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-semibold">Sesiones Activas</h3>
                        <p className="text-2xl font-bold">89</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <ShieldCheckIcon className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-semibold">Sistema Seguro</h3>
                        <p className="text-sm">Estado: Activo</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Clientes y Usuarios</h2>
                    <p className="text-gray-600 mb-6">Administra los clientes, sus credenciales y años disponibles.</p>
                    
                    {/* Controles de la tabla */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex space-x-4">
                        <button 
                          onClick={() => setShowAddModal(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          👤➕ Agregar Cliente
                        </button>
                        <button 
                          onClick={handleExportCSV}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          📊 Exportar CSV
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          placeholder="Buscar..."
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                          🔍
                        </button>
                      </div>
                    </div>

                    {/* Tabla de clientes */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-red-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Grupo</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Empresa</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Cliente</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Cuenta</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Contraseña</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2016</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2017</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2018</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2019</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2020</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2021</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2022</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2023</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2024</th>
                              <th className="px-2 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">2025</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                              <tr key={client.id} className={`hover:bg-gray-50 ${client.id === 4 ? 'bg-blue-50' : ''}`}>
                                <td className="px-3 py-4 text-sm text-gray-900">{client.grupo}</td>
                                <td className="px-3 py-4 text-sm text-gray-900">{client.empresa}</td>
                                <td className="px-3 py-4 text-sm text-gray-900">{client.cliente}</td>
                                <td className="px-3 py-4 text-sm font-mono text-blue-600">{client.cuenta}</td>
                                <td className="px-3 py-4 text-sm font-mono text-gray-500">••••••••</td>
                                
                                {/* Celdas de años - clickeables para gestión de archivos */}
                                {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                                  <td key={year} className="px-2 py-4 text-center">
                                    <button 
                                      onClick={() => handleYearClick(client, year)}
                                      className="relative group"
                                    >
                                      {getStatusBadge(client.years[year]?.status)}
                                      {/* Indicador de archivos */}
                                      {client.years[year]?.files?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                                          {client.years[year].files.length}
                                        </span>
                                      )}
                                      {/* Tooltip */}
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {client.years[year]?.files?.length > 0 
                                          ? `${client.years[year].files.length} archivos` 
                                          : 'Click para gestionar archivos'
                                        }
                                      </div>
                                    </button>
                                  </td>
                                ))}
                                
                                <td className="px-3 py-4 text-sm">
                                  <div className="flex justify-center">
                                    <button 
                                      onClick={() => handleEditClient(client)}
                                      className="text-blue-600 hover:text-blue-800 transition-colors"
                                      title="Editar cliente"
                                    >
                                      📝
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Leyenda */}
                    <div className="mt-6 flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓</span>
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">✗</span>
                        <span>No disponible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">◌</span>
                        <span>En progreso</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">—</span>
                        <span>No aplica</span>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <UsersIcon className="h-8 w-8 text-blue-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-8 w-8 text-green-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Archivos</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {clients.reduce((total, client) => {
                                return total + Object.values(client.years).reduce((yearTotal, yearData) => {
                                  return yearTotal + (yearData.files?.length || 0);
                                }, 0);
                              }, 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <ClockIcon className="h-8 w-8 text-yellow-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">En Progreso</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {clients.reduce((total, client) => {
                                return total + Object.values(client.years).filter(year => year.status === 'progress').length;
                              }, 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-8 w-8 text-red-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Disponibles</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {clients.reduce((total, client) => {
                                return total + Object.values(client.years).filter(year => year.status === 'available').length;
                              }, 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Seguridad</h2>
                    <p className="text-gray-600 mb-4">Configura los aspectos de seguridad del sistema.</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Panel de seguridad avanzada</p>
                    </div>
                  </div>
                )}

                {activeSection === 'system' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sistema</h2>
                    <p className="text-gray-600 mb-4">Administra la configuración general del sistema.</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Configuraciones del sistema</p>
                    </div>
                  </div>
                )}

                {activeSection === 'reports' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reportes del Sistema</h2>
                    <p className="text-gray-600 mb-4">Genera y consulta reportes detallados.</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Generador de reportes</p>
                    </div>
                  </div>
                )}

                {activeSection === 'tools' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Herramientas Administrativas</h2>
                    <p className="text-gray-600 mb-4">Utilidades y herramientas del sistema.</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Suite de herramientas</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Cliente */}
      {showEditModal && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Editar Cliente</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
                <input
                  type="text"
                  value={editingClient.grupo}
                  onChange={(e) => setEditingClient({...editingClient, grupo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <input
                  type="text"
                  value={editingClient.empresa}
                  onChange={(e) => setEditingClient({...editingClient, empresa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <input
                  type="text"
                  value={editingClient.cliente}
                  onChange={(e) => setEditingClient({...editingClient, cliente: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta (Email)</label>
                <input
                  type="email"
                  value={editingClient.cuenta}
                  onChange={(e) => setEditingClient({...editingClient, cuenta: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="text"
                  value={editingClient.password}
                  onChange={(e) => setEditingClient({...editingClient, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Estado de años */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Estado de Años</h4>
              <div className="grid grid-cols-5 gap-4">
                {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                  <div key={year} className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{year}</label>
                    <select
                      value={editingClient.years[year]?.status || 'unavailable'}
                      onChange={(e) => {
                        const updatedClient = {...editingClient};
                        if (!updatedClient.years[year]) {
                          updatedClient.years[year] = { status: e.target.value, files: [] };
                        } else {
                          updatedClient.years[year].status = e.target.value;
                        }
                        setEditingClient(updatedClient);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="available">Disponible</option>
                      <option value="unavailable">No disponible</option>
                      <option value="progress">En progreso</option>
                      <option value="not-applicable">No aplica</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              {/* Botón eliminar a la izquierda */}
              <div>
                {editingClient.id !== 4 ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🗑️ Eliminar Cliente
                  </button>
                ) : (
                  <div className="text-gray-400 text-sm">
                    🔒 Usuario del sistema protegido
                  </div>
                )}
              </div>

              {/* Botones principales a la derecha */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveClient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💾 Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Archivos */}
      {showFileModal && editingClient && selectedYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Gestionar Archivos - {editingClient.empresa} ({selectedYear})
              </h3>
              <button
                onClick={() => setShowFileModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Información del cliente */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Grupo:</strong> {editingClient.grupo}</div>
                <div><strong>Empresa:</strong> {editingClient.empresa}</div>
                <div><strong>Cliente:</strong> {editingClient.cliente}</div>
                <div><strong>Año:</strong> {selectedYear}</div>
              </div>
            </div>

            {/* Upload de archivos */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.xlsx,.xls,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Arrastra archivos aquí o haz click para seleccionar
                </p>
                <p className="text-sm text-gray-500">
                  Formatos admitidos: PDF, Excel, Word
                </p>
              </label>
            </div>

            {/* Lista de archivos */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Archivos Actuales ({editingClient.years[selectedYear]?.files?.length || 0})
              </h4>
              
              {editingClient.years[selectedYear]?.files?.length > 0 ? (
                <div className="space-y-3">
                  {editingClient.years[selectedYear].files.map((fileName, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{fileName}</p>
                          <p className="text-sm text-gray-500">Subido recientemente</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            // Simular descarga
                            toast.success(`Descargando: ${fileName}`);
                          }}
                          className="text-green-600 hover:text-green-800 px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition-colors text-sm"
                        >
                          📥 Descargar
                        </button>
                        <button
                          onClick={() => handleDeleteFile(fileName)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay archivos para este año</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowFileModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.268 16.5c-.77.833-.228 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ⚠️ Confirmar Eliminación
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                Esta acción <strong>eliminará permanentemente</strong> el cliente <strong>{editingClient.empresa}</strong> y todos sus archivos.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para confirmar, escriba exactamente: <code className="bg-gray-100 px-2 py-1 rounded">ELIMINAR</code>
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center font-mono"
                  placeholder="Escriba ELIMINAR"
                />
              </div>

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteClient}
                  disabled={deleteConfirmText !== 'ELIMINAR'}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    deleteConfirmText === 'ELIMINAR'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🗑️ Eliminar Definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Cliente */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">➕ Agregar Nuevo Cliente</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewClient({
                    grupo: '',
                    empresa: '',
                    cliente: '',
                    cuenta: '',
                    password: '',
                    years: {}
                  });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grupo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClient.grupo}
                  onChange={(e) => setNewClient({...newClient, grupo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: Grupo Industrial ABC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClient.empresa}
                  onChange={(e) => setNewClient({...newClient, empresa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: ABC Corporación S.A."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente (Contacto) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClient.cliente}
                  onChange={(e) => setNewClient({...newClient, cliente: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez López"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Cuenta) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newClient.cuenta}
                  onChange={(e) => setNewClient({...newClient, cuenta: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: cliente@empresa.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClient.password}
                  onChange={(e) => setNewClient({...newClient, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: contraseña123"
                />
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña será visible para efectos administrativos
                </p>
              </div>
            </div>

            {/* Nota informativa */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Información importante:</p>
                  <p className="text-blue-700 mt-1">
                    • Todos los años (2016-2025) se inicializarán como "No disponible"<br/>
                    • Después de crear el cliente, puede editar el estado de cada año<br/>
                    • El email debe ser único en el sistema
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewClient({
                    grupo: '',
                    empresa: '',
                    cliente: '',
                    cuenta: '',
                    password: '',
                    years: {}
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddClient}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                ➕ Crear Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}