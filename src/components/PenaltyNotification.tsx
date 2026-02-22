import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';

export const PenaltyNotification = () => {
    const { penaltyNotice, closePenaltyNotice, showSummary } = useGameStore();

    if (!penaltyNotice?.visible || showSummary) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    className="bg-red-950/90 backdrop-blur-xl border-2 border-red-500 rounded-[32px] shadow-[0_0_100px_rgba(220,38,38,0.3)] p-8 max-w-sm w-full text-center pointer-events-auto"
                >
                    <div className="inline-flex p-4 bg-red-500/20 rounded-2xl mb-6 border border-red-500/30">
                        <ShieldAlert className="text-red-400 w-12 h-12" />
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                        Strategic Error!
                    </h2>

                    <p className="text-red-200 font-medium mb-8">
                        {penaltyNotice.message}
                    </p>

                    <button
                        onClick={closePenaltyNotice}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-red-900/40 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        I Understand <X size={20} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    <div className="mt-4 text-[10px] text-red-400/50 uppercase font-black tracking-[0.2em]">
                        Enemies Grow Stronger From Your Mistakes
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
