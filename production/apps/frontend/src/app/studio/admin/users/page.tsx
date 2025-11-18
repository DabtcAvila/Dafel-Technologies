'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  isActive: boolean;
  loginAttempts: number;
  lockedUntil: string | null;
  lastLogin: string | null;
  createdAt: string;
}

interface AuditLog {
  id: string;
  eventType: string;
  eventDetail: string | null;
  success: boolean;
  createdAt: string;
  user: {
    email: string;
  } | null;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state for new/edit user
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'VIEWER' as 'ADMIN' | 'EDITOR' | 'VIEWER',
  });

  useEffect(() => {
    // Check if user is admin
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/studio');
      return;
    }
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch users
    fetchUsers();
    fetchAuditLogs();
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs');
    }
  };

  const handleCreateUser = async () => {
    const loadingToast = toast.loading('Creating user...');
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success('User created successfully');
        setShowModal(false);
        fetchUsers();
        fetchAuditLogs();
        resetForm();
      } else {
        const error = await res.json();
        toast.dismiss(loadingToast);
        toast.error(error.message || 'Failed to create user');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    const loadingToast = toast.loading('Updating user...');
    
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
        }),
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success('User updated successfully');
        setShowModal(false);
        fetchUsers();
        fetchAuditLogs();
        resetForm();
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const loadingToast = toast.loading('Deleting user...');
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success('User deleted successfully');
        fetchUsers();
        fetchAuditLogs();
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred');
    }
  };

  const handleUnlockUser = async (userId: string) => {
    const loadingToast = toast.loading('Unlocking user...');
    
    try {
      const res = await fetch(`/api/users/${userId}/unlock`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success('User unlocked successfully');
        fetchUsers();
        fetchAuditLogs();
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to unlock user');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'VIEWER',
    });
    setEditingUser(null);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name || '',
      password: '',
      role: user.role,
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

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

  if (status === 'loading' || isLoading) {
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

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/studio')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                  <p className="text-sm text-gray-500">Manage system users and permissions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAuditLogs(!showAuditLogs)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClockIcon className="h-4 w-4 inline mr-2" />
                  {showAuditLogs ? 'Hide' : 'Show'} Audit Logs
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer min-w-[140px]"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {user.lockedUntil && new Date(user.lockedUntil) > new Date() ? (
                          <>
                            <LockClosedIcon className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">Locked</span>
                          </>
                        ) : user.isActive ? (
                          <>
                            <div className="h-2 w-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-600">Active</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 bg-gray-400 rounded-full" />
                            <span className="text-sm text-gray-600">Inactive</span>
                          </>
                        )}
                        {user.loginAttempts > 0 && (
                          <span className="text-xs text-amber-600">
                            ({user.loginAttempts} attempts)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, yyyy HH:mm') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {user.lockedUntil && new Date(user.lockedUntil) > new Date() && (
                          <button
                            onClick={() => handleUnlockUser(user.id)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Unlock user"
                          >
                            <LockOpenIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit user"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        {user.email !== session?.user?.email && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <AnimatePresence>
          {showAuditLogs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Audit Logs</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs.slice(0, 20).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded">
                      <div className={`mt-1 ${log.success ? 'text-green-500' : 'text-red-500'}`}>
                        {log.success ? (
                          <ShieldCheckIcon className="h-4 w-4" />
                        ) : (
                          <ExclamationTriangleIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-medium">{log.eventType.replace(/_/g, ' ')}</span>
                          {log.user && (
                            <span className="text-gray-500"> by {log.user.email}</span>
                          )}
                        </div>
                        {log.eventDetail && (
                          <div className="text-xs text-gray-500">{log.eventDetail}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create/Edit User Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!!editingUser}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}