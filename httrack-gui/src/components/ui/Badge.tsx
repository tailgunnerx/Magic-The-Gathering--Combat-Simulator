import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            'bg-slate-700 text-slate-200': variant === 'default',
            'bg-gradient-to-r from-blue-500 to-purple-600 text-white': variant === 'primary',
            'bg-green-500/20 text-green-400 border border-green-500/30': variant === 'success',
            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': variant === 'warning',
            'bg-red-500/20 text-red-400 border border-red-500/30': variant === 'danger',
            'border border-slate-600 text-slate-300': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
