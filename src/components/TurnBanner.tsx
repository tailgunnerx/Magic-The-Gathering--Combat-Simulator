import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const TurnBanner = () => {
    const { showTurnBanner } = useGameStore();

    return (
        <AnimatePresence>
            {showTurnBanner && (
                <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.5, y: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative"
                    >
                        {/* Dramatic Background Glow */}
                        <div className="absolute inset-0 bg-blue-500/30 blur-[100px] rounded-full"></div>

                        <div className="relative bg-slate-900/90 border-y-4 border-blue-500 backdrop-blur-xl px-20 py-10 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                            <div className="flex flex-col items-center">
                                <motion.span
                                    initial={{ letterSpacing: "0.5em", opacity: 0 }}
                                    animate={{ letterSpacing: "0.2em", opacity: 1 }}
                                    className="text-blue-400 font-black text-sm uppercase mb-2"
                                >
                                    BEGINNING PHASE
                                </motion.span>
                                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase">
                                    {showTurnBanner}'s Turn
                                </h2>
                                <div className="mt-4 flex gap-4">
                                    <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                                    <div className="h-1 w-1 bg-white rounded-full"></div>
                                    <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
