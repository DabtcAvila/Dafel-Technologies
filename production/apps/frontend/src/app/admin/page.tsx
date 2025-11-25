'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import { 
  ArrowRightOnRectangleIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  CloudArrowUpIcon,
  FolderIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  UserPlusIcon,
  DocumentChartBarIcon,
  CheckIcon,
  PlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  password: string;
  companyName: string | null;
  groupName: string | null;
  role: 'CLIENT' | 'GROUP' | 'ADMIN' | 'VIEWER' | 'EDITOR';
  isActive: boolean;
  year2016: boolean;
  year2017: boolean;
  year2018: boolean;
  year2019: boolean;
  year2020: boolean;
  year2021: boolean;
  year2022: boolean;
  year2023: boolean;
  year2024: boolean;
  year2025: boolean;
  layoutDownloads: number;
  createdAt: string;
}

interface UserFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  year: number;
  filePath: string;
  isActive: boolean;
  userId: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    companyName: string | null;
  };
  uploadedBy: {
    email: string;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Enable auto logout functionality
  useAutoLogout();

  // States for user management
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Password visibility states
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [showPasswordAdd, setShowPasswordAdd] = useState(false);
  
  // File management states
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [uploading, setUploading] = useState(false);
  const [fileCounts, setFileCounts] = useState<{[key: string]: number}>({});
  
  // Form data for editing/adding
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    groupName: '',
    role: 'CLIENT' as 'CLIENT' | 'GROUP' | 'ADMIN' | 'VIEWER' | 'EDITOR',
    password: '',
    years: [] as string[],
    isActive: true
  });

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('Error loading users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch file counts for all users and years
  const fetchFileCounts = async () => {
    try {
      const response = await fetch('/api/admin/files');
      if (response.ok) {
        const data = await response.json();
        const counts: {[key: string]: number} = {};
        
        // Count files per user per year
        data.files.forEach((file: UserFile) => {
          const key = `${file.userId}-${file.year}`;
          counts[key] = (counts[key] || 0) + 1;
        });
        
        setFileCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching file counts:', error);
    }
  };

  useEffect(() => {
    // TEMPORARY: Always fetch for testing
    fetchUsers();
    fetchFileCounts();
    // if (session?.user?.role === 'ADMIN') {
    //   fetchUsers();
    //   fetchFileCounts();
    // }
  }, []);

  // Fetch user files
  const fetchUserFiles = async (userId?: string, year?: number) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (year) params.append('year', year.toString());
      
      const response = await fetch(`/api/admin/files?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUserFiles(data.files);
      } else {
        toast.error('Error loading files');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Error loading files');
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedUserId) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', selectedUserId);
        formData.append('year', selectedYear.toString());

        const response = await fetch('/api/admin/files', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(`File ${file.name} uploaded successfully`);
        } else {
          const error = await response.json();
          toast.error(`Error uploading ${file.name}: ${error.error}`);
        }
      }
      
      // Refresh file list and counts
      await fetchUserFiles(selectedUserId, selectedYear);
      await fetchFileCounts();
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  // Handle file download
  const handleFileDownload = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/admin/files/download/${fileId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('File downloaded');
      } else {
        const error = await response.json();
        toast.error(`Error downloading file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file');
    }
  };

  // Handle file delete
  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('File deleted successfully');
        await fetchUserFiles(selectedUserId, selectedYear);
        await fetchFileCounts();
      } else {
        const error = await response.json();
        toast.error(`Error deleting file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  // Open file management modal
  const openFileModal = (userId: string, year: number) => {
    setSelectedUserId(userId);
    setSelectedYear(year);
    setShowFileModal(true);
    fetchUserFiles(userId, year);
  };

  // Get icon and title for year cell based on file count
  const getYearCellIcon = (userId: string, year: number) => {
    const key = `${userId}-${year}`;
    const count = fileCounts[key] || 0;
    
    if (count > 0) {
      return {
        icon: <FolderIcon className="h-5 w-5 text-blue-600" />,
        title: `Click to view ${count} file${count > 1 ? 's' : ''} for ${year}`
      };
    } else {
      return {
        icon: <ArrowUpTrayIcon className="h-5 w-5 text-gray-400" />,
        title: `Click to upload files for ${year}`
      };
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    
    // Convert boolean year columns to array of year strings
    const years: string[] = [];
    if (user.year2016) years.push('2016');
    if (user.year2017) years.push('2017');
    if (user.year2018) years.push('2018');
    if (user.year2019) years.push('2019');
    if (user.year2020) years.push('2020');
    if (user.year2021) years.push('2021');
    if (user.year2022) years.push('2022');
    if (user.year2023) years.push('2023');
    if (user.year2024) years.push('2024');
    if (user.year2025) years.push('2025');
    
    setFormData({
      email: user.email,
      companyName: user.companyName || '',
      groupName: user.groupName || '',
      role: user.role,
      password: '',
      years: years,
      isActive: user.isActive
    });
    setDeleteConfirmation('');
    setShowPasswordEdit(false);
    setShowEditModal(true);
  };

  const handleAddUser = () => {
    setFormData({
      email: '',
      companyName: '',
      groupName: '',
      role: 'CLIENT',
      password: '',
      years: [],
      isActive: true
    });
    setShowPasswordAdd(false);
    setShowAddModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!formData.email || (!editingUser && !formData.password)) {
        toast.error('Por favor complete todos los campos requeridos');
        return;
      }

      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        setShowAddModal(false);
        setShowPasswordEdit(false);
        setShowPasswordAdd(false);
        setEditingUser(null);
        toast.success(editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al guardar usuario');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error al guardar usuario');
    }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirmation === 'ELIMINAR' && editingUser) {
      try {
        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchUsers();
          setShowEditModal(false);
          setEditingUser(null);
          setDeleteConfirmation('');
          toast.success('Usuario eliminado correctamente');
        } else {
          toast.error('Error al eliminar usuario');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Grupo', 'Empresa', 'Cliente', 'Cuenta', 'Rol', 'Estado', 'Años Archivo'];
    
    const csvData = users.map(user => [
      user.groupName || '',
      user.companyName || '',
      user.name,
      user.email,
      user.role,
      user.isActive ? 'Activo' : 'Inactivo',
      user.yearsArchive?.join(', ') || ''
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'usuarios_dafel.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exportado correctamente');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">ADMIN</span>;
      case 'EDITOR':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">EDITOR</span>;
      case 'VIEWER':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">VIEWER</span>;
      case 'CLIENT':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">CLIENT</span>;
      case 'GROUP':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">GROUP</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Activo</span>
      : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">✗ Inactivo</span>;
  };

  useEffect(() => {
    // Allow some time for NextAuth to establish session after login
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000); // Wait 1 second before checking authentication

    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  // TEMPORARY: Authentication disabled for testing
  // useEffect(() => {
  //   // Only redirect to login if definitively unauthenticated and not on initial load
  //   if (status === 'unauthenticated' && !isInitialLoad) {
  //     router.push('/login');
  //   }
  // }, [status, router, isInitialLoad]);

  // if (status === 'loading' || isInitialLoad) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

  // if (!session) {
  //   return null;
  // }


  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Title */}
              <div className="flex items-center">
                <img 
                  src="/dafel-logo-optimized.svg" 
                  alt="DAFEL Consulting" 
                  className="h-10 w-auto mr-4"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">Gestión de Usuarios</h1>
                  <p className="text-sm text-gray-600 leading-tight">DAFEL Consulting Services</p>
                </div>
              </div>
              
              {/* User Info and Logout */}
              <div className="flex items-center space-x-4">
                <div className="text-right flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-900 leading-tight">Admin Test</p>
                  <p className="text-xs text-gray-500 leading-tight">admin@dafel.com</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors h-9"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h2>
                    <p className="text-gray-600 mb-6">Administra los usuarios, sus roles y configuraciones.</p>
                    
                    {/* Controls */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex space-x-4">
                        <button 
                          onClick={handleAddUser}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                        >
                          <UserPlusIcon className="h-4 w-4 mr-2" />
                          Agregar Usuario
                        </button>
                        <button 
                          onClick={handleExportCSV}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
                        >
                          <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                          Exportar CSV
                        </button>
                      </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      {loading ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                          <p className="mt-2 text-gray-500">Cargando usuarios...</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-primary-50">
                              <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Grupo</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Empresa</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Email</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Contraseña</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Rol</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Estado</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2016</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2017</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2018</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2019</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2020</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2021</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2022</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2023</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2024</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">2025</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                  <td className="px-3 py-4 text-sm text-gray-900">{user.groupName || '-'}</td>
                                  <td className="px-3 py-4 text-sm text-gray-900">{user.companyName || '-'}</td>
                                  <td className="px-3 py-4 text-sm font-mono text-blue-600">{user.email}</td>
                                  <td className="px-3 py-4 text-sm font-mono text-gray-500">
                                    {user.password ? user.password.substring(0, 20) + '...' : 'Sin contraseña'}
                                  </td>
                                  <td className="px-3 py-4">{getRoleBadge(user.role)}</td>
                                  <td className="px-3 py-4">{getStatusBadge(user.isActive)}</td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2016)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2016).title}
                                    >
                                      {getYearCellIcon(user.id, 2016).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2017)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2017).title}
                                    >
                                      {getYearCellIcon(user.id, 2017).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2018)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2018).title}
                                    >
                                      {getYearCellIcon(user.id, 2018).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2019)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2019).title}
                                    >
                                      {getYearCellIcon(user.id, 2019).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2020)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2020).title}
                                    >
                                      {getYearCellIcon(user.id, 2020).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2021)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2021).title}
                                    >
                                      {getYearCellIcon(user.id, 2021).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2022)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2022).title}
                                    >
                                      {getYearCellIcon(user.id, 2022).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2023)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2023).title}
                                    >
                                      {getYearCellIcon(user.id, 2023).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2024)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2024).title}
                                    >
                                      {getYearCellIcon(user.id, 2024).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-center">
                                    <button 
                                      onClick={() => openFileModal(user.id, 2025)}
                                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                      title={getYearCellIcon(user.id, 2025).title}
                                    >
                                      {getYearCellIcon(user.id, 2025).icon}
                                    </button>
                                  </td>
                                  <td className="px-3 py-4 text-sm">
                                    <div className="flex justify-center">
                                      <button 
                                        onClick={() => handleEditUser(user)}
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar usuario"
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Statistics */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <UsersIcon className="h-8 w-8 text-blue-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <KeyIcon className="h-8 w-8 text-primary-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Clientes</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'CLIENT').length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <CogIcon className="h-8 w-8 text-yellow-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'ADMIN').length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Editar Usuario</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowPasswordEdit(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Años de archivo disponibles</label>
                <div className="grid grid-cols-5 gap-2">
                  {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                    <label key={year} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.years.includes(year.toString())}
                        onChange={(e) => {
                          const yearStr = year.toString();
                          if (e.target.checked) {
                            setFormData({...formData, years: [...formData.years, yearStr]});
                          } else {
                            setFormData({...formData, years: formData.years.filter(y => y !== yearStr)});
                          }
                        }}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{year}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="GROUP">Grupo</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña (opcional)
                </label>
                <div className="relative">
                  <input
                    type={showPasswordEdit ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordEdit(!showPasswordEdit)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswordEdit ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              {/* Delete button */}
              <div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowPasswordEdit(false);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm underline mr-4"
                >
                  Eliminar Usuario
                </button>
                
                {deleteConfirmation !== 'ELIMINAR' && (
                  <input
                    type="text"
                    placeholder="Escriba ELIMINAR para confirmar"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                  />
                )}
                
                {deleteConfirmation === 'ELIMINAR' && (
                  <button
                    onClick={handleDeleteUser}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    ELIMINAR
                  </button>
                )}
              </div>

              {/* Save/Cancel buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowPasswordEdit(false);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserPlusIcon className="h-6 w-6 mr-2" />
                Agregar Nuevo Usuario
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowPasswordAdd(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-primary-600">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="usuario@empresa.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Años de archivo disponibles</label>
                <div className="grid grid-cols-5 gap-2">
                  {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                    <label key={year} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.years.includes(year.toString())}
                        onChange={(e) => {
                          const yearStr = year.toString();
                          if (e.target.checked) {
                            setFormData({...formData, years: [...formData.years, yearStr]});
                          } else {
                            setFormData({...formData, years: formData.years.filter(y => y !== yearStr)});
                          }
                        }}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{year}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Empresa S.A."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Grupo Industrial"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-primary-600">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="GROUP">Grupo</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-primary-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswordAdd ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Contraseña segura"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordAdd(!showPasswordAdd)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswordAdd ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Información importante:</p>
                  <p className="text-blue-700 mt-1">
                    • El rol determina qué página se carga después del login<br/>
                    • CLIENT/GROUP → /client, ADMIN → /admin, VIEWER/EDITOR → /hub<br/>
                    • El email debe ser único en el sistema
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowPasswordAdd(false);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Management Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                <FolderIcon className="h-6 w-6 mr-2 inline" />
                Gestión de Archivos - Año {selectedYear}
              </h3>
              <button
                onClick={() => setShowFileModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* File Upload Section */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">
                <CloudArrowUpIcon className="h-5 w-5 inline mr-2" />
                Subir Archivos
              </h4>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Año seleccionado: {selectedYear}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      const newYear = parseInt(e.target.value);
                      setSelectedYear(newYear);
                      fetchUserFiles(selectedUserId, newYear);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.csv,.txt"
                  />
                  {uploading && (
                    <div className="text-blue-600 text-sm">Subiendo...</div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Formatos aceptados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, CSV, TXT (máximo 10MB cada uno)
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800">
                  Archivos del Año {selectedYear}
                </h4>
              </div>
              
              {userFiles.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay archivos para este año.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Archivo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Tamaño
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {file.originalName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {file.mimetype.split('/')[1].toUpperCase()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(file.createdAt).toLocaleDateString('es-MX')}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleFileDownload(file.id, file.originalName)}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Descargar archivo"
                              >
                                <DocumentArrowDownIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleFileDelete(file.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Eliminar archivo"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowFileModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}