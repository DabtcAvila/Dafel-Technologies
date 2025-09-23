'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      size = 'md',
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'input-sm',
      md: 'input',
      lg: 'input-lg',
    };

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              iconSizeClasses[size]
            )}>
              {leftIcon}
            </div>
          )}
          
          <motion.input
            type={type}
            className={cn(
              sizeClasses[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-destructive focus:border-destructive focus:ring-destructive',
              loading && 'opacity-50 cursor-not-allowed',
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            {...props}
          />
          
          {rightIcon && !loading && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              iconSizeClasses[size]
            )}>
              {rightIcon}
            </div>
          )}
          
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <motion.div
                className={cn('border-2 border-primary border-t-transparent rounded-full', iconSizeClasses[size])}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}
        </div>
        
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            {hint && !error && (
              <p className="text-sm text-muted-foreground">{hint}</p>
            )}
          </motion.div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };