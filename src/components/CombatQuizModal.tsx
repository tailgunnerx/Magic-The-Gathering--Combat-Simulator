import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Card } from '../types';
import { motion } from 'framer-motion';
import { Sword, CheckCircle, XCircle, ChevronRight, Info, RotateCcw, Coins, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const KEYWORD_COLORS: Record<string, string> = {
    'Flying': 'bg-sky-500 text-white',
    'Trample': 'bg-green-600 text-white',
    'Deathtouch': 'bg-purple-600 text-white',
    'First Strike': 'bg-slate-100 text-black border border-slate-300',
    'Double Strike': 'bg-amber-400 text-black',
    'Vigilance': 'bg-slate-200 text-black',
    'Haste': 'bg-red-500 text-white',
    'Reach': 'bg-emerald-700 text-white',
    'Lifelink': 'bg-pink-500 text-white',
    'Protection': 'bg-indigo-500 text-white',
};

export const CombatQuizModal = () => {
    const {
        showQuiz,
        pendingOutcome,
        submitQuiz,
        players,
        activePlayerId,
        attackers,
        blockers,
        reorderBlockers,
        cancelQuiz
    } = useGameStore();

    const [predictions, setPredictions] = useState<Record<string, 'Survives' | 'Dies'>>({});
    const [trampleGuesses, setTrampleGuesses] = useState<Record<string, number>>({});
    const [damageGuesses, setDamageGuesses] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const goldEarned = useMemo(() => {
        if (!isSubmitted || !pendingOutcome) return 0;
        let correctCount = 0;
        Object.entries(predictions).forEach(([cardId, prediction]) => {
            const isDead = pendingOutcome.deaths.includes(cardId);
            const actualOutcome = isDead ? 'Dies' : 'Survives';
            if (prediction === actualOutcome) {
                correctCount++;
            }
        });

        let damageGold = 0;
        Object.entries(damageGuesses).forEach(([cardId, guess]) => {
            const actualDamage = pendingOutcome.damageEvents
                .filter(e => e.targetId === cardId)
                .reduce((sum, e) => sum + e.damage, 0);
            if (guess === actualDamage) {
                damageGold += 1;
            }
        });

        return (correctCount * 10) + damageGold;
    }, [isSubmitted, pendingOutcome, predictions, damageGuesses]);

    if (!showQuiz || !pendingOutcome) return null;

    const attackerPlayer = players.find(p => p.id === activePlayerId)!;
    const defenderPlayer = players.find(p => p.id !== activePlayerId)!;

    const getCard = (id: string) =>
        attackerPlayer.battlefield.find(c => c.id === id) ||
        defenderPlayer.battlefield.find(c => c.id === id);

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const handleContinue = () => {
        submitQuiz(predictions, trampleGuesses, damageGuesses);
        setIsSubmitted(false);
        setPredictions({});
        setTrampleGuesses({});
        setDamageGuesses({});
    };

    const togglePrediction = (cardId: string, outcome: 'Survives' | 'Dies') => {
        if (isSubmitted) return;
        setPredictions(prev => ({ ...prev, [cardId]: outcome }));
    };

    const adjustDamageGuess = (cardId: string, delta: number) => {
        if (isSubmitted) return;
        setDamageGuesses(prev => ({
            ...prev,
            [cardId]: Math.max(0, (prev[cardId] || 0) + delta)
        }));
    };

    const combatPairs = attackers
        .map(attId => {
            const attacker = getCard(attId);
            if (!attacker) return null;

            const blockerIds = blockers[attId] || [];
            const blockersList = blockerIds.map(id => getCard(id)).filter(Boolean) as Card[];

            return {
                attacker,
                blockers: blockersList
            };
        })
        .filter(Boolean) as { attacker: Card, blockers: Card[] }[];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Sword className="text-red-500" />
                            COMBAT SURVIVAL QUIZ
                        </h2>
                        <p className="text-slate-400 text-sm">Predict the outcomes of this combat damage step.</p>
                    </div>
                    {isSubmitted && (
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold flex items-center gap-2">
                                <Info size={18} /> Reviewing Results
                            </div>
                            {goldEarned > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-4 py-2 bg-yellow-600 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg shadow-yellow-900/50"
                                >
                                    <Coins size={18} fill="currentColor" /> +{goldEarned} Gold!
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    {/* Rules Tip */}
                    <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4 flex gap-4">
                        <div className="p-2 bg-amber-500/20 rounded-lg h-fit">
                            <Info className="text-amber-500" size={20} />
                        </div>
                        <div className="text-sm">
                            <h4 className="text-amber-400 font-bold mb-1">Multi-Blocking Rule</h4>
                            <p className="text-slate-400 leading-relaxed text-xs">
                                The <span className="text-red-400 font-bold">Attacker</span> deals damage to blockers in order. You must assign enough damage to destroy the <span className="text-white font-medium">1st Blocker</span> before any damage carries over to the <span className="text-white font-medium">2nd</span>, and so on.
                                <br />
                                <span className="text-blue-400 font-bold mt-1 block italic">Note: All blockers still deal their total damage to the attacker simultaneously!</span>
                            </p>
                        </div>
                    </div>

                    {combatPairs.map((pair, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                            {/* Attacker Header */}
                            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                                            <img src={pair.attacker.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        {(pair.attacker.plusOneCounters || 0) > 0 && (
                                            <div className="absolute -top-1 -left-1 bg-emerald-600 text-[8px] font-bold px-1 rounded text-white border border-white/20">
                                                +{pair.attacker.plusOneCounters}/+{pair.attacker.plusOneCounters}
                                            </div>
                                        )}
                                        {(pair.attacker.minusOneCounters || 0) > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-purple-600 text-[8px] font-bold px-1 rounded text-white border border-white/20">
                                                -{pair.attacker.minusOneCounters}/-{pair.attacker.minusOneCounters}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 bg-red-600 text-[9px] font-black px-1.5 py-0.5 rounded text-white border border-white/20 shadow-lg flex items-center gap-1">
                                            <span className="text-[7px] opacity-70">TOTAL</span>
                                            {parseInt(pair.attacker.power || '0') + (pair.attacker.plusOneCounters || 0) - (pair.attacker.minusOneCounters || 0)}/{parseInt(pair.attacker.toughness || '0') + (pair.attacker.plusOneCounters || 0) - (pair.attacker.minusOneCounters || 0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter border border-red-500/30 px-1 rounded bg-red-500/10">Attacker</span>
                                            <h3 className="font-bold text-white text-lg">{pair.attacker.name}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {pair.attacker.keywords?.map(k => (
                                                <span key={k} className={clsx(
                                                    "text-[8px] px-1 rounded font-bold uppercase tracking-wider",
                                                    KEYWORD_COLORS[k] || 'bg-slate-700 text-white'
                                                )}>
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <DamageAssessment
                                        cardId={pair.attacker.id}
                                        guess={damageGuesses[pair.attacker.id] || 0}
                                        onAdjust={adjustDamageGuess}
                                        isSubmitted={isSubmitted}
                                        actual={pendingOutcome.damageEvents
                                            .filter(e => e.targetId === pair.attacker.id)
                                            .reduce((sum, e) => sum + e.damage, 0)}
                                    />
                                    <QuizToggle
                                        cardId={pair.attacker.id}
                                        prediction={predictions[pair.attacker.id]}
                                        onSelect={togglePrediction}
                                        isSubmitted={isSubmitted}
                                        actual={pendingOutcome.deaths.includes(pair.attacker.id) ? 'Dies' : 'Survives'}
                                    />
                                </div>
                            </div>

                            {/* Blockers */}
                            <div className="p-4 space-y-4">
                                {pair.blockers.length === 0 ? (
                                    <div className="flex items-center justify-center p-4 bg-red-900/10 border border-red-500/20 rounded-lg text-red-400 font-medium italic">
                                        No Blockers - Direct Damage to {defenderPlayer.name}
                                    </div>
                                ) : (
                                    pair.blockers.map((blocker, bIdx) => (
                                        <div key={blocker.id} className="flex items-center justify-between pl-8 border-l-2 border-slate-700 py-2">
                                            <div className="flex items-center gap-3">
                                                <ChevronRight className="text-slate-600" />
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                                                        <img src={blocker.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    {(blocker.plusOneCounters || 0) > 0 && (
                                                        <div className="absolute -top-1 -left-1 bg-emerald-600 text-[8px] font-bold px-1 rounded text-white border border-white/20">
                                                            +{blocker.plusOneCounters}/+{blocker.plusOneCounters}
                                                        </div>
                                                    )}
                                                    {(blocker.minusOneCounters || 0) > 0 && (
                                                        <div className="absolute -top-1 -right-1 bg-purple-600 text-[8px] font-bold px-1 rounded text-white border border-white/20">
                                                            -{blocker.minusOneCounters}/-{blocker.minusOneCounters}
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded text-white border border-white/20 shadow-lg flex items-center gap-1">
                                                        <span className="text-[7px] opacity-70">TOTAL</span>
                                                        {parseInt(blocker.power || '0') + (blocker.plusOneCounters || 0) - (blocker.minusOneCounters || 0)}/{parseInt(blocker.toughness || '0') + (blocker.plusOneCounters || 0) - (blocker.minusOneCounters || 0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter border border-blue-500/30 px-1 rounded bg-blue-500/10">
                                                            {bIdx + 1}{bIdx === 0 ? 'st' : bIdx === 1 ? 'nd' : bIdx === 2 ? 'rd' : 'th'} Blocker
                                                        </span>
                                                        <h4 className="font-bold text-slate-200">{blocker.name}</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {blocker.keywords?.map(k => (
                                                            <span key={k} className={clsx(
                                                                "text-[8px] px-1 rounded font-bold uppercase tracking-wider",
                                                                KEYWORD_COLORS[k] || 'bg-slate-700 text-white'
                                                            )}>
                                                                {k}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {!isSubmitted && pair.blockers.length > 1 && (
                                                    <div className="flex flex-col border border-slate-700 rounded overflow-hidden">
                                                        <button
                                                            disabled={bIdx === 0}
                                                            onClick={() => reorderBlockers(pair.attacker.id, blocker.id, 'up')}
                                                            className="p-1 hover:bg-slate-700 disabled:opacity-20 text-slate-400"
                                                        >
                                                            <ChevronUp size={14} />
                                                        </button>
                                                        <button
                                                            disabled={bIdx === pair.blockers.length - 1}
                                                            onClick={() => reorderBlockers(pair.attacker.id, blocker.id, 'down')}
                                                            className="p-1 hover:bg-slate-700 disabled:opacity-20 text-slate-400 border-t border-slate-700"
                                                        >
                                                            <ChevronDown size={14} />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-6">
                                                    <DamageAssessment
                                                        cardId={blocker.id}
                                                        guess={damageGuesses[blocker.id] || 0}
                                                        onAdjust={adjustDamageGuess}
                                                        isSubmitted={isSubmitted}
                                                        actual={pendingOutcome.damageEvents
                                                            .filter(e => e.targetId === blocker.id)
                                                            .reduce((sum, e) => sum + e.damage, 0)}
                                                    />
                                                    <QuizToggle
                                                        cardId={blocker.id}
                                                        prediction={predictions[blocker.id]}
                                                        onSelect={togglePrediction}
                                                        isSubmitted={isSubmitted}
                                                        actual={pendingOutcome.deaths.includes(blocker.id) ? 'Dies' : 'Survives'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Explanations Section */}
                    {isSubmitted && pendingOutcome.explanation.length > 0 && (
                        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                            <h3 className="text-blue-400 font-black mb-4 flex items-center gap-2">
                                <Info size={18} /> COMBAT ACTION BREAKDOWN
                            </h3>
                            <div className="space-y-2">
                                {pendingOutcome.explanation.map((line, i) => (
                                    <div key={i} className="text-slate-300 text-sm flex gap-3">
                                        <span className="text-blue-500 font-bold">•</span>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Submit */}
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
                    <div className="text-slate-500 text-sm">
                        {isSubmitted ?
                            "Review why each creature survived or died based on MTG rules." :
                            "Select 'Survives' or 'Dies' for every creature."}
                    </div>

                    {!isSubmitted ? (
                        <div className="flex gap-3">
                            <button
                                onClick={cancelQuiz}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-700"
                            >
                                <RotateCcw size={18} /> REVISE BLOCKS
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(predictions).length < (attackers.length + Object.values(blockers).flat().length)}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
                            >
                                SUBMIT PREDICTIONS <CheckCircle size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleContinue}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ring-4 ring-green-900/30"
                        >
                            CONTINUE SIMULATION <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const QuizToggle = ({
    cardId,
    prediction,
    onSelect,
    isSubmitted,
    actual
}: {
    cardId: string,
    prediction?: 'Survives' | 'Dies',
    onSelect: (id: string, out: 'Survives' | 'Dies') => void,
    isSubmitted: boolean,
    actual: 'Survives' | 'Dies'
}) => {
    const isCorrect = prediction === actual;

    if (isSubmitted) {
        return (
            <div className="flex items-center gap-3">
                <div className={clsx(
                    "flex flex-col items-end",
                    isCorrect ? "text-green-400" : "text-red-400"
                )}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{isCorrect ? 'Correct' : 'Incorrect'}</span>
                    <span className="font-black">Actual: {actual}</span>
                </div>
                {isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
            </div>
        );
    }

    return (
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button
                onClick={() => onSelect(cardId, 'Survives')}
                className={clsx(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                    prediction === 'Survives' ? "bg-green-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
            >
                Survives
            </button>
            <button
                onClick={() => onSelect(cardId, 'Dies')}
                className={clsx(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                    prediction === 'Dies' ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
            >
                Dies
            </button>
        </div>
    );
};

const DamageAssessment = ({
    cardId,
    guess,
    onAdjust,
    isSubmitted,
    actual
}: {
    cardId: string,
    guess: number,
    onAdjust: (id: string, delta: number) => void,
    isSubmitted: boolean,
    actual: number
}) => {
    const isCorrect = guess === actual;

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Damage Taken</span>
                <div className={clsx(
                    "px-3 py-1 rounded-lg border font-black text-sm flex items-center gap-2",
                    isCorrect ? "bg-emerald-950/30 border-emerald-500 text-emerald-400" : "bg-red-950/30 border-red-500 text-red-400"
                )}>
                    <span>{guess}</span>
                    <span className="text-[10px] opacity-60">Actual: {actual}</span>
                    {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Damage Taken <span className="text-blue-400 font-bold">(Optional)</span></span>
            <div className="flex items-center gap-2 py-1">
                <button
                    onClick={() => onAdjust(cardId, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg active:scale-90 transition-all font-black text-lg"
                >
                    -
                </button>
                <div className="w-10 h-8 flex items-center justify-center bg-slate-900 border border-slate-700 rounded-lg text-white font-black text-sm shadow-inner">
                    {guess}
                </div>
                <button
                    onClick={() => onAdjust(cardId, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg active:scale-90 transition-all font-black text-lg"
                >
                    +
                </button>
            </div>
        </div>
    );
};
