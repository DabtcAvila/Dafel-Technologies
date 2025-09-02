'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const { messages } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate against hardcoded credentials
    if (username === 'admin' && password === 'admin') {
      // Set session in sessionStorage
      sessionStorage.setItem('isAuthenticated', 'true');
      // Also set a cookie for middleware
      document.cookie = 'isAuthenticated=true; path=/';
      // Redirect to studio
      router.push('/studio');
    } else {
      setError(messages.login?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            className="h-12 w-12"
            aria-label="Dafel Technologies Logo"
          >
            <path 
              d="M 0,0 L 100,0 L 100,100 L 0,100 L 0,0 Z M 8,8 L 8,92 L 92,92 L 92,8 L 8,8 Z" 
              className="fill-gray-900" 
              fillRule="evenodd"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="27.5" 
              className="fill-gray-900"
            />
          </svg>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-mono font-light text-center text-gray-900 mb-8">
            {messages.login?.title || 'Access Studio'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {messages.login?.username || 'Username'}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                required
                autoFocus
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {messages.login?.password || 'Password'}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              {messages.login?.submit || 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {messages.login?.back || 'Back to Home'}
            </button>
          </div>
        </div>

        {/* Development Note */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Development access only
        </div>
      </motion.div>
    </div>
  );
}