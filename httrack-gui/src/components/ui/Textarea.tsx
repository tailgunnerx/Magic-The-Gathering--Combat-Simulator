import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border bg-slate-900/50 px-3 py-2 text-sm',
          'text-white placeholder:text-slate-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y',
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-slate-600 focus-visible:ring-purple-500',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
