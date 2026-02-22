import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, User, Bot, Dices } from 'lucide-react';
import { useState, useEffect } from 'react';

type RollStage = 'init' | 'npcRolling' | 'userTurn' | 'userRolling' | 'result';

export const StartBattleModal = () => {
    const { showStartPrompt, startGame } = useGameStore();
    const [rollStage, setRollStage] = useState<RollStage>('init');
    const [npcRoll, setNpcRoll] = useState(0);
    const [userRoll, setUserRoll] = useState(0);
    const [tempRoll, setTempRoll] = useState(1);

    // Dice animation interval
    useEffect(() => {
        let interval: any;
        if (rollStage === 'npcRolling' || rollStage === 'userRolling') {
            interval = setInterval(() => {
                setTempRoll(Math.floor(Math.random() * 20) + 1);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [rollStage]);

    // NPC Roll sequence
    const startNpcRoll = () => {
        setRollStage('npcRolling');
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 20) + 1;
            setNpcRoll(roll);
            setRollStage('userTurn');
        }, 1500);
    };

    // User Roll sequence
    const startUserRoll = () => {
        setRollStage('userRolling');
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 20) + 1;
            // Ensure no ties for simplicity or just handle them
            const finalRoll = roll === npcRoll ? (roll === 20 ? 19 : roll + 1) : roll;
            setUserRoll(finalRoll);
            setRollStage('result');

            // Auto start game after result
            setTimeout(() => {
                startGame(finalRoll > npcRoll ? 'player1' : 'player2');
                // Reset for next time if modal ever re-opens
                setRollStage('init');
                setNpcRoll(0);
                setUserRoll(0);
            }, 2000);
        }, 1500);
    };

    if (!showStartPrompt) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
            <AnimatePresence mode="wait">
                {rollStage === 'init' ? (
                    <motion.div
                        key="init"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
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
                                onClick={startNpcRoll}
                                className="group relative flex items-center gap-6 p-6 bg-slate-800/30 hover:bg-amber-600/20 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                <div className="p-4 bg-amber-500/20 rounded-xl group-hover:bg-amber-500/40 transition-colors">
                                    <Dices className="text-amber-400 w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black text-amber-200 text-xl">Decide by Fate</h3>
                                    <p className="text-slate-500 text-sm">Roll the dice to determine the starter.</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="rolling"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="bg-slate-950 border-2 border-slate-800 rounded-[50px] shadow-[0_0_100px_rgba(0,0,0,0.8)] p-12 w-full max-w-2xl text-center relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none opacity-50" />

                        <h2 className="text-3xl font-black text-slate-100 uppercase tracking-[0.3em] mb-16 relative z-10">
                            The Council of Fate
                        </h2>

                        <div className="flex justify-around items-end mb-16 relative z-10">
                            {/* NPC D20 - Blood Crimson */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-red-500/80 font-black uppercase text-xs tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">The Adversary</div>
                                <motion.div
                                    className="relative w-32 h-32 flex items-center justify-center drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    animate={rollStage === 'npcRolling' ? {
                                        rotate: [0, 90, 180, 270, 360],
                                        scale: [1, 1.1, 1]
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: rollStage === 'npcRolling' ? Infinity : 0 }}
                                >
                                    <D20Icon className="text-red-600 fill-red-950/80 stroke-red-400" />
                                    <span className={`absolute inset-0 flex items-center justify-center text-4xl font-black text-red-50 transition-all duration-300 ${rollStage === 'npcRolling' ? 'blur-[1px] opacity-70' : ''}`}>
                                        {rollStage === 'npcRolling' ? tempRoll : (npcRoll || '?')}
                                    </span>
                                </motion.div>
                            </div>

                            <div className="text-slate-700 font-black text-4xl self-center mb-8 italic">VS</div>

                            {/* User D20 - Heroic Gold */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-amber-400 font-black uppercase text-xs tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Thy Fortune</div>
                                <motion.button
                                    disabled={rollStage !== 'userTurn'}
                                    onClick={startUserRoll}
                                    whileHover={rollStage === 'userTurn' ? { scale: 1.1, filter: 'brightness(1.2)' } : {}}
                                    whileTap={rollStage === 'userTurn' ? { scale: 0.9 } : {}}
                                    className={`relative w-32 h-32 flex items-center justify-center transition-all duration-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.3)] ${rollStage === 'userTurn' ? 'cursor-pointer active:scale-90' : ''
                                        }`}
                                >
                                    <motion.div
                                        animate={rollStage === 'userRolling' ? {
                                            rotate: [0, -90, -180, -270, -360],
                                            scale: [1, 1.1, 1]
                                        } : {}}
                                        transition={{ duration: 0.5, repeat: rollStage === 'userRolling' ? Infinity : 0 }}
                                    >
                                        <D20Icon className={
                                            rollStage === 'userTurn' ? "text-amber-400 fill-amber-500/20 stroke-white animate-pulse" :
                                                rollStage === 'userRolling' ? "text-amber-500 fill-amber-900/40 stroke-amber-200" :
                                                    "text-amber-600 fill-amber-950/80 stroke-amber-400"
                                        } />
                                    </motion.div>
                                    <span className={`absolute inset-0 flex items-center justify-center text-4xl font-black text-amber-50 transition-all duration-300 ${rollStage === 'userRolling' ? 'blur-[1px] opacity-70' : ''}`}>
                                        {rollStage === 'userRolling' ? tempRoll : (userRoll || '?')}
                                    </span>

                                    {rollStage === 'userTurn' && (
                                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-amber-400 font-black text-sm uppercase animate-bounce tracking-widest">
                                            Roll the Die
                                        </div>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Results Message */}
                        <div className="h-16 flex items-center justify-center">
                            {rollStage === 'result' && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`text-2xl font-black uppercase tracking-widest flex items-center gap-4 ${userRoll > npcRoll ? 'text-amber-400' : 'text-red-500'}`}
                                >
                                    <Swords size={32} />
                                    {userRoll > npcRoll ? "Glory Awaits! You lead." : "Hold Fast! Enemy strikes."}
                                    <Swords size={32} className="rotate-180" />
                                </motion.div>
                            )}
                            {rollStage === 'userTurn' && (
                                <p className="text-slate-500 text-sm font-bold tracking-wider uppercase">Enemy has cast {npcRoll}. Strike now to seize momentum!</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Custom D20 Icon Component for realism
const D20Icon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full transition-colors duration-500 ${className}`}>
        <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="currentColor" stroke="none" opacity="0.1" />
        <path d="M50 5 L90 25 L50 45 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 25 L10 75 L50 45 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M90 25 L90 75 L50 45 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 75 L50 95 L50 45 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M90 75 L50 95 L50 45 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M50 5 L50 45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
