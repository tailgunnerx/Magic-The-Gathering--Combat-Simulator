import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border bg-slate-900/50 px-3 py-2 text-sm',
          'text-white placeholder:text-slate-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-slate-600 focus-visible:ring-purple-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
