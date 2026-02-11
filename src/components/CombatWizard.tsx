import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Skull, CheckCircle, ArrowRight } from 'lucide-react';

export const CombatWizard = () => {
    const { phase, combatStep, activePlayerId, nextPhase, getCombatHints, attackers } = useGameStore();

    // Only show during combat
    if (phase !== 'combat') return null;

    const isPlayerTurn = activePlayerId === 'player1';
    const hints = getCombatHints();

    return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-80 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${combatStep}-${activePlayerId}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-4 pointer-events-auto"
                >
                    {/* Header Step Info */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-1.5 rounded-full ${isPlayerTurn ? 'bg-blue-600' : 'bg-red-600'}`}>
                            {combatStep === 'declareAttackers' && <Sword size={16} className="text-white" />}
                            {combatStep === 'declareBlockers' && <Shield size={16} className="text-white" />}
                            {combatStep === 'combatDamage' && <Skull size={16} className="text-white" />}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight leading-none">
                                {combatStep === 'declareAttackers' ? (isPlayerTurn ? "Your Attack" : "Opponent Attack") :
                                    combatStep === 'declareBlockers' ? (isPlayerTurn ? "Opponent Blocking" : "Your Defense") :
                                        combatStep === 'combatDamage' ? "Damage Resolution" : "Combate Phase"}
                            </h2>
                            <p className="text-slate-400 text-xs mt-0.5">
                                {combatStep === 'declareAttackers' && isPlayerTurn && "Select attackers."}
                                {combatStep === 'declareAttackers' && !isPlayerTurn && "Opponent attacking."}
                                {combatStep === 'declareBlockers' && isPlayerTurn && "Opponent blocking..."}
                                {combatStep === 'declareBlockers' && !isPlayerTurn && "Select attacker then blocker."}
                            </p>
                        </div>
                    </div>

                    {/* Smart Hints Section */}
                    {hints.length > 0 && (
                        <div className="mb-4 bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded">
                            {hints.map((hint, idx) => (
                                <p key={idx} className="text-yellow-200 text-sm flex items-start gap-2">
                                    <span>•</span> {hint}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-2 border-t border-slate-700/50">
                        {combatStep === 'declareAttackers' && isPlayerTurn && (
                            <button
                                onClick={nextPhase}
                                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-red-900/20 active:scale-95 transition-all flex items-center gap-2 group"
                            >
                                <span className="group-hover:translate-x-0.5 transition-transform">
                                    {attackers.length > 0 ? "Confirm Attacks" : "Skip Attacks"}
                                </span>
                                {attackers.length > 0 && <span className="bg-black/30 px-2 py-0.5 rounded text-xs">{attackers.length}</span>}
                                <ArrowRight size={18} />
                            </button>
                        )}

                        {combatStep === 'declareBlockers' && !isPlayerTurn && (
                            <button
                                onClick={nextPhase}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all flex items-center gap-2"
                            >
                                Confirm Blocks <CheckCircle size={18} />
                            </button>
                        )}

                        {/* If it's opponents turn to act, show "Waiting" or "Next" if they are done */}
                        {(combatStep === 'declareAttackers' && !isPlayerTurn) && (
                            <button
                                onClick={nextPhase}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
                            >
                                Proceed to Block <ArrowRight size={18} />
                            </button>
                        )}
                        {(combatStep === 'declareBlockers' && isPlayerTurn) && (
                            <button
                                onClick={nextPhase}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
                            >
                                View Damage <ArrowRight size={18} />
                            </button>
                        )}

                        {combatStep === 'combatDamage' && (
                            <button
                                onClick={nextPhase}
                                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-900/20 active:scale-95 transition-all flex items-center gap-2"
                            >
                                End Combat <CheckCircle size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
