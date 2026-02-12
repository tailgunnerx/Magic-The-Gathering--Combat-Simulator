import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl':
              variant === 'primary',
            'bg-slate-700 text-white hover:bg-slate-600': variant === 'secondary',
            'border-2 border-slate-600 text-slate-200 hover:bg-slate-800': variant === 'outline',
            'text-slate-300 hover:bg-slate-800': variant === 'ghost',
            'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700':
              variant === 'danger',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
