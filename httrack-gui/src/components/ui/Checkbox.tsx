import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'w-4 h-4 rounded border-slate-600 bg-slate-900/50',
            'text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
            'transition-colors cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
