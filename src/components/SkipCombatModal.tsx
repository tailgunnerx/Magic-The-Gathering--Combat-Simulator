import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Sword } from 'lucide-react';

export const SkipCombatModal = () => {
    const { showSkipCombatConfirmation, setShowSkipCombatConfirmation, nextPhase } = useGameStore();

    if (!showSkipCombatConfirmation) return null;

    const handleConfirm = () => {
        setShowSkipCombatConfirmation(false);
        nextPhase();
    };

    const handleCancel = () => {
        setShowSkipCombatConfirmation(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-slate-900 border-2 border-slate-700 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 pb-4 text-center">
                        <div className="inline-flex p-4 bg-amber-500/20 rounded-2xl mb-6 border border-amber-500/30">
                            <AlertTriangle className="text-amber-400 w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                            Hold Your Ground?
                        </h2>
                        <p className="text-slate-400">
                            You have creatures ready to strike. Are you sure you do not want to attack this turn?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="p-8 pt-4 flex flex-col gap-3">
                        <button
                            onClick={handleCancel}
                            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-blue-900/40"
                        >
                            <X size={18} /> No, Go Back
                        </button>

                        <button
                            onClick={handleConfirm}
                            className="w-full flex items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-red-600/20 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all active:scale-[0.98]"
                        >
                            <Sword size={16} /> Yes, Skip Combat
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
