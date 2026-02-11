import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, ShieldAlert, Heart, Skull, X } from 'lucide-react';

export const CombatSummaryModal = () => {
    const { lastCombatSummary, showSummary, closeSummary } = useGameStore();

    if (!showSummary || !lastCombatSummary) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Battle Summary</h2>
                        <button
                            onClick={closeSummary}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingDown className="text-emerald-400" size={24} />
                                <span className="text-slate-300 font-bold">Damage Mitigated</span>
                            </div>
                            <span className="text-2xl font-black text-emerald-400">{lastCombatSummary.reductionPercent}%</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 mb-1 text-slate-500 font-bold text-xs uppercase">
                                    <ShieldAlert size={14} /> Blocked
                                </div>
                                <div className="text-xl font-bold text-white">{lastCombatSummary.blockedDamage} <span className="text-slate-500 text-sm">/ {lastCombatSummary.totalIncoming}</span></div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 mb-1 text-slate-500 font-bold text-xs uppercase">
                                    <Heart size={14} /> {lastCombatSummary.defenderId === 'player1' ? 'Your' : lastCombatSummary.defenderId === 'player2' ? "Opponent's" : lastCombatSummary.defenderName} Life
                                </div>
                                <div className={`text-xl font-bold ${lastCombatSummary.defenderId === 'player1' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    -{lastCombatSummary.lifeLost}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-red-950/20 p-4 rounded-xl border border-red-900/30">
                                <div className="flex items-center gap-3">
                                    <Skull className="text-red-500" size={20} />
                                    <span className="text-red-200 font-bold text-sm italic">Your Casualties</span>
                                </div>
                                <span className="text-lg font-black text-red-500">{lastCombatSummary.playerCreaturesLost}</span>
                            </div>

                            <div className="flex items-center justify-between bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
                                <div className="flex items-center gap-3">
                                    <Skull className="text-emerald-500" size={20} />
                                    <span className="text-emerald-200 font-bold text-sm italic">Opponent Casualties</span>
                                </div>
                                <span className="text-lg font-black text-emerald-500">{lastCombatSummary.opponentCreaturesLost}</span>
                            </div>
                        </div>

                        {/* Kill Feed */}
                        {lastCombatSummary.killLog.length > 0 && (
                            <div className="space-y-2 pr-2">
                                <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <TrendingDown size={12} className="rotate-90" /> Battle Record
                                </h3>
                                <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                                    {lastCombatSummary.killLog.map((entry, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg border border-slate-700/30 flex items-center gap-3"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0" />
                                            <span className="leading-tight">{entry}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / CTA */}
                    <div className="p-6 pt-0">
                        <button
                            onClick={closeSummary}
                            className="w-full bg-white hover:bg-slate-200 text-black font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg uppercase tracking-tight"
                        >
                            Back to Battlefield
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
