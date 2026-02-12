import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastStore, Toast as ToastType } from '../../stores/toast';
import { cn } from '../../lib/utils';

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'border-green-500/50 bg-green-950/50',
  error: 'border-red-500/50 bg-red-950/50',
  info: 'border-blue-500/50 bg-blue-950/50',
  warning: 'border-yellow-500/50 bg-yellow-950/50',
};

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  warning: 'text-yellow-400',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-lg shadow-xl min-w-[320px] max-w-md',
        toastStyles[toast.type]
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[toast.type])} />
      <div className="flex-1">
        <p className="font-semibold text-white">{toast.title}</p>
        {toast.message && <p className="text-sm text-slate-300 mt-1">{toast.message}</p>}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
