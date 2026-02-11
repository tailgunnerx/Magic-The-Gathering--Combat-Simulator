import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Card } from '../types';
import { motion } from 'framer-motion';
import { Sword, CheckCircle, XCircle, ChevronRight, Info, RotateCcw } from 'lucide-react';
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
        cancelQuiz
    } = useGameStore();

    const [predictions, setPredictions] = useState<Record<string, 'Survives' | 'Dies'>>({});
    const [trampleGuesses, setTrampleGuesses] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        submitQuiz(predictions, trampleGuesses);
        setIsSubmitted(false);
        setPredictions({});
        setTrampleGuesses({});
    };

    const togglePrediction = (cardId: string, outcome: 'Survives' | 'Dies') => {
        if (isSubmitted) return;
        setPredictions(prev => ({ ...prev, [cardId]: outcome }));
    };

    // Participants: Only show creatures that are actually involved in the combat
    // (Attacking, Blocking, or being Blocked)
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
                        <div className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold flex items-center gap-2">
                            <Info size={18} /> Reviewing Results
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    {combatPairs.map((pair, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                            {/* Attacker Header */}
                            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                                            <img src={pair.attacker.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-red-600 text-[10px] font-bold px-1 rounded text-white border border-white/20">
                                            {pair.attacker.power}/{pair.attacker.toughness}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{pair.attacker.name}</h3>
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

                                <QuizToggle
                                    cardId={pair.attacker.id}
                                    prediction={predictions[pair.attacker.id]}
                                    onSelect={togglePrediction}
                                    isSubmitted={isSubmitted}
                                    actual={pendingOutcome.deaths.includes(pair.attacker.id) ? 'Dies' : 'Survives'}
                                />
                            </div>

                            {/* Blockers */}
                            <div className="p-4 space-y-4">
                                {pair.blockers.length === 0 ? (
                                    <div className="flex items-center justify-center p-4 bg-red-900/10 border border-red-500/20 rounded-lg text-red-400 font-medium italic">
                                        No Blockers - Direct Damage to {defenderPlayer.name}
                                    </div>
                                ) : (
                                    pair.blockers.map(blocker => (
                                        <div key={blocker.id} className="flex items-center justify-between pl-8 border-l-2 border-slate-700 py-2">
                                            <div className="flex items-center gap-3">
                                                <ChevronRight className="text-slate-600" />
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                                                        <img src={blocker.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-[10px] font-bold px-1 rounded text-white border border-white/20">
                                                        {blocker.power}/{blocker.toughness}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-200">{blocker.name}</h4>
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

                                            <QuizToggle
                                                cardId={blocker.id}
                                                prediction={predictions[blocker.id]}
                                                onSelect={togglePrediction}
                                                isSubmitted={isSubmitted}
                                                actual={pendingOutcome.deaths.includes(blocker.id) ? 'Dies' : 'Survives'}
                                            />
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
