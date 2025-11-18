'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types/components';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-dafel-blue-500 text-white hover:bg-dafel-blue-600 focus-visible:ring-dafel-blue-500 shadow-md hover:shadow-lg',
        secondary:
          'bg-dafel-slate-100 text-dafel-slate-900 hover:bg-dafel-slate-200 focus-visible:ring-dafel-slate-500',
        outline:
          'border-2 border-dafel-blue-500 text-dafel-blue-500 bg-transparent hover:bg-dafel-blue-50 focus-visible:ring-dafel-blue-500',
        ghost:
          'text-dafel-slate-700 hover:bg-dafel-slate-100 focus-visible:ring-dafel-slate-500',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps & VariantProps<typeof buttonVariants>>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      onClick,
      href,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    const motionProps = {
      whileHover: { scale: 1.02, y: -2 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 }
    };

    if (href) {
      return (
        <motion.a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...motionProps}
          {...props}
        >
          {buttonContent}
        </motion.a>
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        {...motionProps}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;