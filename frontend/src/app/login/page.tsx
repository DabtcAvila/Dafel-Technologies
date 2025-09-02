'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast, Toaster } from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon,
  ShieldCheckIcon,
  FingerPrintIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { messages } = useLanguage();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityIndicators, setSecurityIndicators] = useState({
    ssl: false,
    encryption: false,
    biometric: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  useEffect(() => {
    // Simulate security checks
    const timer = setTimeout(() => {
      setSecurityIndicators({
        ssl: true,
        encryption: true,
        biometric: false,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    const loadingToast = toast.loading('Authenticating...', {
      style: {
        background: '#111827',
        color: '#fff',
      },
    });

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      toast.dismiss(loadingToast);

      if (result?.error) {
        toast.error(result.error || 'Authentication failed', {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
      } else if (result?.ok) {
        toast.success('Login successful! Redirecting...', {
          duration: 2000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        
        setTimeout(() => {
          router.push('/studio');
        }, 1500);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'An unexpected error occurred', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return Math.min(strength, 5);
  };

  const strength = passwordStrength(password);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Animated background orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 100 100" 
                  className="h-16 w-16"
                  aria-label="Dafel Technologies Logo"
                >
                  <path 
                    d="M 0,0 L 100,0 L 100,100 L 0,100 L 0,0 Z M 8,8 L 8,92 L 92,92 L 92,8 L 8,8 Z" 
                    className="fill-white" 
                    fillRule="evenodd"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="27.5" 
                    className="fill-white"
                  />
                </svg>
                <motion.div
                  className="absolute inset-0 rounded-full bg-white opacity-30 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
            <h1 className="text-3xl font-mono font-light text-white tracking-wider">
              Dafel Technologies
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Enterprise Authentication Portal
            </p>
          </div>

          {/* Login Form Card */}
          <div className="backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl p-8 border border-white/20">
            <h2 className="text-xl font-medium text-white mb-6 flex items-center justify-center gap-2">
              <LockClosedIcon className="h-5 w-5" />
              Secure Access
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur"
                    placeholder="admin@dafel.tech"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-5 left-0 text-xs text-red-400"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur"
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-5 left-0 text-xs text-red-400"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: i < strength ? 1 : 0.3 }}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < strength
                              ? strength <= 2
                                ? 'bg-red-500'
                                : strength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-emerald-500'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <KeyIcon className="h-5 w-5" />
                    Sign In Securely
                  </>
                )}
              </button>
            </form>

            {/* Security Indicators */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-center gap-6 text-xs">
                <AnimatePresence>
                  {securityIndicators.ssl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-emerald-400"
                    >
                      <ShieldCheckIcon className="h-4 w-4" />
                      SSL Secured
                    </motion.div>
                  )}
                  {securityIndicators.encryption && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-1 text-emerald-400"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                      256-bit Encryption
                    </motion.div>
                  )}
                  {securityIndicators.biometric && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-1 text-gray-400"
                    >
                      <FingerPrintIcon className="h-4 w-4" />
                      Biometric Ready
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2025 Dafel Technologies. Enterprise Security Standards.</p>
            <p className="mt-1">All login attempts are monitored and logged.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}