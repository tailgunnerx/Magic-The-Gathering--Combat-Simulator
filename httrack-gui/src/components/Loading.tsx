import { motion } from 'framer-motion';

export function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
  const container = fullScreen
    ? 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    : '';

  return (
    <div className={`flex items-center justify-center p-8 ${container}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 border-4 border-slate-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="relative" style={{ width: sizeClasses[size].split(' ')[0].replace('w-', '') }}>
      <motion.div
        className={`${sizeClasses[size]} border-transparent border-t-purple-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
