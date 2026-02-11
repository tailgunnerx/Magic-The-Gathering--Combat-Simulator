import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Dices } from 'lucide-react';

interface TurnOrderModalProps {
    isOpen: boolean;
    onSelect: (startingPlayer: 'player1' | 'player2' | 'roll') => void;
}

export const TurnOrderModal = ({ isOpen, onSelect }: TurnOrderModalProps) => {
    const [rolling, setRolling] = useState(false);
    const [rollResult, setRollResult] = useState<{ player1: number; player2: number } | null>(null);

    const handleRoll = () => {
        setRolling(true);
        setRollResult(null);

        setTimeout(() => {
            const p1Roll = Math.floor(Math.random() * 20) + 1;
            const p2Roll = Math.floor(Math.random() * 20) + 1;
            setRollResult({ player1: p1Roll, player2: p2Roll });
            setRolling(false);

            setTimeout(() => {
                const winner = p1Roll >= p2Roll ? 'player1' : 'player2';
                onSelect(winner);
            }, 3000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-purple-500 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 border-b-4 border-purple-500 relative overflow-hidden">
                        <motion.div
                            animate={{
                                background: [
                                    'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
                                    'radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
                                    'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)'
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0"
                        />
                        <h2 className="text-4xl font-black text-white text-center relative z-10 tracking-tight uppercase">
                            Who Goes First?
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {!rolling && !rollResult && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Player 1 First */}
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onSelect('player1')}
                                    className="group relative bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 p-8 rounded-2xl border-4 border-green-400 hover:border-green-300 shadow-lg transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <User size={48} className="text-white" strokeWidth={2.5} />
                                        <span className="text-white font-black text-xl uppercase tracking-tight">You Start</span>
                                    </div>
                                </motion.button>

                                {/* Player 2 First */}
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onSelect('player2')}
                                    className="group relative bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 p-8 rounded-2xl border-4 border-red-400 hover:border-red-300 shadow-lg transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <Users size={48} className="text-white" strokeWidth={2.5} />
                                        <span className="text-white font-black text-xl uppercase tracking-tight">Opponent Starts</span>
                                    </div>
                                </motion.button>

                                {/* D20 Roll */}
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRoll}
                                    className="group relative bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 p-8 rounded-2xl border-4 border-purple-400 hover:border-purple-300 shadow-lg transition-all overflow-hidden"
                                >
                                    <motion.div
                                        animate={{
                                            background: [
                                                'conic-gradient(from 0deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))',
                                                'conic-gradient(from 360deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))'
                                            ]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute inset-0"
                                    />
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <Dices size={48} className="text-white" strokeWidth={2.5} />
                                        <span className="text-white font-black text-xl uppercase tracking-tight">Roll D20</span>
                                    </div>
                                </motion.button>
                            </div>
                        )}

                        {/* Rolling Animation */}
                        {rolling && (
                            <div className="relative h-96 flex items-center justify-center">
                                {/* RGB Fairy Dust Explosion */}
                                {[...Array(50)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ 
                                            x: 0, 
                                            y: 0, 
                                            scale: 0,
                                            opacity: 1
                                        }}
                                        animate={{ 
                                            x: Math.cos(i * 7.2 * Math.PI / 180) * (100 + Math.random() * 200),
                                            y: Math.sin(i * 7.2 * Math.PI / 180) * (100 + Math.random() * 200),
                                            scale: [0, 1, 0],
                                            opacity: [1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: Math.random() * 0.5
                                        }}
                                        className="absolute w-3 h-3 rounded-full"
                                        style={{
                                            background: `hsl(${(i * 7.2) % 360}, 100%, 60%)`,
                                            boxShadow: `0 0 20px hsl(${(i * 7.2) % 360}, 100%, 60%)`
                                        }}
                                    />
                                ))}

                                {/* Spinning Dice */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }}
                                    className="z-10"
                                >
                                    <Dices size={120} className="text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]" strokeWidth={2} />
                                </motion.div>
                            </div>
                        )}

                        {/* Roll Results */}
                        {rollResult && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Player 1 Roll */}
                                    <motion.div
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`p-8 rounded-2xl border-4 ${
                                            rollResult.player1 > rollResult.player2
                                                ? 'bg-gradient-to-br from-green-600 to-emerald-700 border-green-300'
                                                : rollResult.player1 === rollResult.player2
                                                ? 'bg-gradient-to-br from-yellow-600 to-amber-700 border-yellow-300'
                                                : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-white/80 text-sm font-bold uppercase mb-2">You Rolled</div>
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 0.5, repeat: 2 }}
                                                className="text-8xl font-black text-white"
                                            >
                                                {rollResult.player1}
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Player 2 Roll */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`p-8 rounded-2xl border-4 ${
                                            rollResult.player2 > rollResult.player1
                                                ? 'bg-gradient-to-br from-green-600 to-emerald-700 border-green-300'
                                                : rollResult.player1 === rollResult.player2
                                                ? 'bg-gradient-to-br from-yellow-600 to-amber-700 border-yellow-300'
                                                : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-white/80 text-sm font-bold uppercase mb-2">Opponent Rolled</div>
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 0.5, repeat: 2 }}
                                                className="text-8xl font-black text-white"
                                            >
                                                {rollResult.player2}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Winner Announcement */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl font-black text-white uppercase">
                                        {rollResult.player1 > rollResult.player2 && '🎉 You Go First!'}
                                        {rollResult.player2 > rollResult.player1 && '⚔️ Opponent Goes First!'}
                                        {rollResult.player1 === rollResult.player2 && '🔄 Tie! Rolling Again...'}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
