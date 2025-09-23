'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define the button variants
const buttonVariants = {
  // Variants
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  destructive: 'btn-destructive',
  // Sizes
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(
      // Base styles
      'btn',
      buttonVariants[variant],
      buttonVariants[size],
      {
        'w-full': fullWidth,
        'opacity-70 cursor-not-allowed': loading || disabled,
      },
      className
    );

    const iconElement = icon && (
      <span className={cn('flex-shrink-0', size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base')}>
        {icon}
      </span>
    );

    const loadingElement = loading && (
      <motion.div
        className={cn(
          'border-2 border-current border-t-transparent rounded-full',
          size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    );

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        whileTap={disabled || loading ? {} : { scale: 0.98 }}
        whileHover={disabled || loading ? {} : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        {...props}
      >
        {loading && loadingElement}
        {!loading && icon && iconPosition === 'left' && iconElement}
        {children && (
          <span className={cn(loading ? 'opacity-0' : 'opacity-100', 'transition-opacity duration-200')}>
            {children}
          </span>
        )}
        {!loading && icon && iconPosition === 'right' && iconElement}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };