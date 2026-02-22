import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Skull, CheckCircle, ArrowRight, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export const CombatWizard = () => {
    const { phase, combatStep, activePlayerId, nextPhase, getCombatHints, attackers, blockers, players, setShowSkipCombatConfirmation, resetBlockers, reorderBlockers } = useGameStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Only show during combat
    if (phase !== 'combat') return null;

    const isPlayerTurn = activePlayerId === 'player1';
    const hints = getCombatHints();

    const handleAttackConfirm = () => {
        if (attackers.length === 0) {
            // Check if there are any creatures that WOULD have been able to attack
            const myBattlefield = players.find(p => p.id === 'player1')?.battlefield || [];
            const hasPotentialAttackers = myBattlefield.some(c =>
                !c.tapped && (!c.summoningSickness || c.keywords?.includes('Haste'))
            );

            if (hasPotentialAttackers) {
                setShowSkipCombatConfirmation(true);
                return;
            }
        }
        nextPhase();
    };

    return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-80 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${combatStep}-${activePlayerId}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{
                        x: 0,
                        opacity: 1,
                        height: isCollapsed ? 'auto' : 'auto' // Heights are auto, but we'll use overflow hidden
                    }}
                    exit={{ x: 100, opacity: 0 }}
                    className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
                >
                    {/* Header Step Info */}
                    <div
                        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-white/5 transition-colors"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl shadow-inner ${isPlayerTurn ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'}`}>
                                {combatStep === 'declareAttackers' && <Sword size={20} />}
                                {combatStep === 'declareBlockers' && <Shield size={20} />}
                                {combatStep === 'combatDamage' && <Skull size={20} />}
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white tracking-tight uppercase leading-none">
                                    {combatStep === 'declareAttackers' ? (isPlayerTurn ? "Your Attack" : "Opponent Attack") :
                                        combatStep === 'declareBlockers' ? (isPlayerTurn ? "Opponent Blocking" : "Your Defense") :
                                            "Combat Finish"}
                                </h2>
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                                    Step: {combatStep?.replace(/([A-Z])/g, ' $1')}
                                </p>
                            </div>
                        </div>
                        <div className="text-slate-500">
                            {isCollapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>

                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 pb-4"
                            >
                                <p className="text-slate-400 text-xs mb-4">
                                    {combatStep === 'declareAttackers' && isPlayerTurn && "Select attackers from your battlefield."}
                                    {combatStep === 'declareAttackers' && !isPlayerTurn && "Opponent is deciding their strike..."}
                                    {combatStep === 'declareBlockers' && isPlayerTurn && "Opponent is setting up defenses."}
                                    {combatStep === 'declareBlockers' && !isPlayerTurn && (
                                        <span>
                                            Pick your blocker first, then pick the attacker to intercept.
                                            <span className="block mt-2 text-amber-400 font-bold">💡 Tip: Creatures with Summoning Sickness CAN still block!</span>
                                        </span>
                                    )}
                                </p>

                                {/* Smart Hints Section */}
                                {hints.length > 0 && (
                                    <div className="mb-4 bg-amber-500/10 border-l-2 border-amber-500 p-3 rounded-r-lg">
                                        {hints.map((hint, idx) => (
                                            <p key={idx} className="text-amber-200/90 text-[11px] leading-relaxed flex items-start gap-2 mb-1 last:mb-0">
                                                <span className="text-amber-500 font-bold">•</span> {hint}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Blocker Reordering UI */}
                                {combatStep === 'declareBlockers' && !isPlayerTurn && Object.keys(blockers).length > 0 && (
                                    <div className="mt-4 space-y-4 max-h-68 overflow-y-auto custom-scrollbar pr-2 pb-2">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                                            <Shield size={10} /> Defense Queue
                                        </h3>
                                        {Object.entries(blockers).map(([attId, bIds]) => {
                                            if (bIds.length < 1) return null;
                                            const p2 = players.find(p => p.id === 'player2');
                                            const p1 = players.find(p => p.id === 'player1');
                                            const attacker = p2?.battlefield.find(c => c.id === attId);

                                            return (
                                                <div key={attId} className="space-y-2 bg-slate-800/30 rounded-lg p-2 border border-slate-700/30">
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-1 italic">
                                                        <Sword size={10} className="text-red-500" /> vs {attacker?.name}
                                                    </div>
                                                    {bIds.map((blkId, idx) => {
                                                        const blocker = p1?.battlefield.find(c => c.id === blkId);
                                                        return (
                                                            <div key={blkId} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-md border border-slate-700/50 group">
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="flex-shrink-0 w-5 h-5 rounded bg-blue-600/20 border border-blue-500/30 text-[10px] flex items-center justify-center font-black text-blue-400">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <span className="text-xs text-slate-200 font-bold truncate">{blocker?.name}</span>
                                                                </div>
                                                                <div className="flex gap-0.5 ml-2">
                                                                    <button
                                                                        disabled={idx === 0}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            reorderBlockers(attId, blkId, 'up');
                                                                        }}
                                                                        className="p-1 hover:bg-blue-600 hover:text-white disabled:opacity-20 rounded transition-all text-slate-500"
                                                                        title="Move Up"
                                                                    >
                                                                        <ChevronUp size={14} />
                                                                    </button>
                                                                    <button
                                                                        disabled={idx === bIds.length - 1}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            reorderBlockers(attId, blkId, 'down');
                                                                        }}
                                                                        className="p-1 hover:bg-blue-600 hover:text-white disabled:opacity-20 rounded transition-all text-slate-500"
                                                                        title="Move Down"
                                                                    >
                                                                        <ChevronDown size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                                    {combatStep === 'declareAttackers' && isPlayerTurn && (
                                        <button
                                            onClick={handleAttackConfirm}
                                            className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-900/40 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <span className="group-hover:translate-x-0.5 transition-transform">
                                                {attackers.length > 0 ? "Confirm Combat" : "Skip Combat"}
                                            </span>
                                            {attackers.length > 0 && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{attackers.length}</span>}
                                            <ArrowRight size={16} />
                                        </button>
                                    )}

                                    {combatStep === 'declareBlockers' && !isPlayerTurn && (
                                        <div className="w-full space-y-2">
                                            <button
                                                onClick={resetBlockers}
                                                className="w-full border border-slate-700 hover:bg-slate-800 text-slate-400 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                                            >
                                                <RotateCcw size={14} /> Reset Blockers
                                            </button>
                                            <button
                                                onClick={nextPhase}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                Lock Defenses <CheckCircle size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* If it's opponents turn to act, show "Waiting" or "Next" if they are done */}
                                    {(combatStep === 'declareAttackers' && !isPlayerTurn) && (
                                        <button
                                            onClick={nextPhase}
                                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            Move to Blocks <ArrowRight size={16} />
                                        </button>
                                    )}
                                    {(combatStep === 'declareBlockers' && isPlayerTurn) && (
                                        <button
                                            onClick={nextPhase}
                                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            Resolve Damage <ArrowRight size={16} />
                                        </button>
                                    )}

                                    {combatStep === 'combatDamage' && (
                                        <button
                                            onClick={nextPhase}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            End Turn <CheckCircle size={16} />
                                        </button>
                                    )}

                                    {combatStep === 'end' && (
                                        <button
                                            onClick={nextPhase}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            End Combat <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
