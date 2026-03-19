import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-red text-white hover:bg-brand-red/90 shadow-md',
      secondary: 'bg-brand-terracotta text-white hover:bg-brand-terracotta/90 shadow-md',
      outline: 'border-2 border-brand-sand text-brand-charcoal hover:bg-brand-sand/10',
      ghost: 'text-brand-charcoal hover:bg-brand-sand/10',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg font-medium',
      xl: 'px-8 py-4 text-xl font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'tactile-button inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-sand disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-semibold text-brand-graphite">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl border-2 border-brand-sand/30 bg-white px-4 py-2.5 text-brand-charcoal transition-all focus:border-brand-terracotta focus:outline-none focus:ring-1 focus:ring-brand-terracotta placeholder:text-brand-sand/60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);

export const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('premium-shadow rounded-2xl bg-white p-6', className)} {...props}>
    {children}
  </div>
);

export const StatusChip = ({ label, active }: { label: string; active: boolean }) => (
  <div className={cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
    active ? 'bg-green-100 text-green-700' : 'bg-brand-sand/20 text-brand-sand'
  )}>
    <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', active ? 'bg-green-500 animate-pulse' : 'bg-brand-sand')} />
    {label}
  </div>
);
