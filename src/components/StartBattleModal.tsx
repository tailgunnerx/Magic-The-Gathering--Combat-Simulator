import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, User, Bot, Dices } from 'lucide-react';

export const StartBattleModal = () => {
    const { showStartPrompt, startGame } = useGameStore();

    if (!showStartPrompt) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_0_50px_rgba(30,41,59,0.5)] w-full max-w-lg overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
                        <div className="inline-flex p-3 bg-emerald-500/20 rounded-2xl mb-4 border border-emerald-500/30">
                            <Swords className="text-emerald-400 w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
                            Battle Ready
                        </h2>
                        <p className="text-slate-400 text-lg">
                            An army has been summoned. Who shall lead the first charge?
                        </p>
                    </div>

                    {/* Options */}
                    <div className="p-8 grid grid-cols-1 gap-4">
                        <button
                            onClick={() => startGame('player1')}
                            className="group relative flex items-center gap-6 p-6 bg-slate-800/50 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all active:scale-[0.98]"
                        >
                            <div className="p-4 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/40 transition-colors">
                                <User className="text-blue-400 w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-white text-xl">Player 1 (You)</h3>
                                <p className="text-slate-500 group-hover:text-blue-300/70 text-sm">Take the initiative and attack first.</p>
                            </div>
                        </button>

                        <button
                            onClick={() => startGame('player2')}
                            className="group relative flex items-center gap-6 p-6 bg-slate-800/50 hover:bg-red-600/20 border border-slate-700 hover:border-red-500/50 rounded-2xl transition-all active:scale-[0.98]"
                        >
                            <div className="p-4 bg-red-500/20 rounded-xl group-hover:bg-red-500/40 transition-colors">
                                <Bot className="text-red-400 w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-white text-xl">Player 2 (AI)</h3>
                                <p className="text-slate-500 group-hover:text-red-300/70 text-sm">Let the adversary make the first move.</p>
                            </div>
                        </button>

                        <button
                            onClick={() => startGame('random')}
                            className="group relative flex items-center gap-6 p-6 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-500 rounded-2xl transition-all active:scale-[0.98]"
                        >
                            <div className="p-4 bg-slate-700/50 rounded-xl group-hover:bg-slate-600/50 transition-colors">
                                <Dices className="text-slate-300 w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-slate-200 text-xl">Decide by Fate</h3>
                                <p className="text-slate-500 text-sm">Roll the dice to determine the starter.</p>
                            </div>
                        </button>
                    </div>

                    {/* Tooltip/Footer */}
                    <div className="px-8 pb-8 text-center">
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                            Training Simulator &bull; Standard MTG Combat Rules Apply
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
