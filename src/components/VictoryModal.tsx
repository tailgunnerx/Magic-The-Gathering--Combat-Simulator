import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, RotateCcw, PartyPopper, Coins } from 'lucide-react';
import { clsx } from 'clsx';

export const VictoryModal = () => {
    const { winner, shuffleBoard } = useGameStore();

    if (!winner) return null;

    const isPlayerWin = winner === 'player1';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop with extreme blur and dark tint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={clsx(
                        "relative w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-2",
                        isPlayerWin ? "bg-slate-900 border-emerald-500/50 shadow-emerald-500/20" : "bg-slate-900 border-red-500/50 shadow-red-500/20"
                    )}
                >
                    {/* Decorative Background Glow */}
                    <div className={clsx(
                        "absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-20",
                        isPlayerWin ? "bg-emerald-400" : "bg-red-400"
                    )} />
                    <div className={clsx(
                        "absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20",
                        isPlayerWin ? "bg-emerald-400" : "bg-red-400"
                    )} />

                    <div className="relative p-10 flex flex-col items-center text-center">
                        {/* Hero Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className={clsx(
                                "w-24 h-24 rounded-2xl flex items-center justify-center mb-8 shadow-2xl rotate-3",
                                isPlayerWin ? "bg-emerald-600 shadow-emerald-900/40" : "bg-red-800 shadow-red-950/40"
                            )}
                        >
                            {isPlayerWin ? (
                                <Trophy className="text-white" size={48} />
                            ) : (
                                <Skull className="text-white" size={48} />
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className={clsx(
                                "text-6xl font-black italic tracking-tighter mb-2 uppercase",
                                isPlayerWin ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            )}>
                                {isPlayerWin ? "Victory!" : "Defeat"}
                            </h2>
                            <p className="text-slate-400 text-lg font-medium mb-10 max-w-sm">
                                {isPlayerWin
                                    ? "You have successfully defended your realm and crushed the opposing army."
                                    : "Your defenses have crumbled. The opposing army has claimed the battlefield."}
                            </p>
                        </motion.div>

                        {/* Player Stats / Summary Mini */}
                        <div className="grid grid-cols-3 gap-4 w-full mb-10">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Status</span>
                                <span className={clsx("font-bold text-xl", isPlayerWin ? "text-emerald-400" : "text-red-400")}>
                                    {isPlayerWin ? "SURVIVED" : "WIPED OUT"}
                                </span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Combat Result</span>
                                <span className="text-white font-bold text-xl">
                                    {isPlayerWin ? <PartyPopper className="inline mr-2" size={20} /> : null}
                                    CONCLUDED
                                </span>
                            </div>
                            <div className={clsx(
                                "rounded-xl p-4 border",
                                isPlayerWin
                                    ? "bg-yellow-500/10 border-yellow-500/30"
                                    : "bg-white/5 border-white/10"
                            )}>
                                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Gold Reward</span>
                                <span className={clsx("font-bold text-xl flex items-center gap-1.5", isPlayerWin ? "text-yellow-400" : "text-slate-500")}>
                                    <Coins size={20} className={isPlayerWin ? "text-yellow-400" : "text-slate-600"} />
                                    {isPlayerWin ? "+50" : "0"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={shuffleBoard}
                            className={clsx(
                                "group relative w-full py-4 rounded-xl font-black text-xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 overflow-hidden",
                                isPlayerWin
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"
                                    : "bg-slate-700 hover:bg-slate-600 text-white shadow-black/40"
                            )}
                        >
                            <RotateCcw className="group-hover:rotate-180 transition-transform duration-500" />
                            REMATCH

                            {/* Shiny Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </div>
                </motion.div>

                {/* Particle / Celebration Effects for Victory */}
                {isPlayerWin && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    x: '50%',
                                    y: '50%',
                                    scale: 0
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    x: `${Math.random() * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    scale: Math.random() * 2 + 1,
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: Math.random() * 2 + 1,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                                className="absolute w-2 h-2 bg-emerald-400/30 rounded-full blur-[1px]"
                            />
                        ))}
                    </div>
                )}
            </div>
        </AnimatePresence>
    );
};
