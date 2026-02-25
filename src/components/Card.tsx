import type { Card as CardType } from '../types';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    className?: string;
    isAttacking?: boolean;
    isBlocking?: boolean;
    isLocked?: boolean;
    blockIndicatorColor?: string; // CSS class for indicator color
    blockOrder?: number; // The order in which this blocker intercepts
}

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

export const Card = ({ card, onClick, className, isAttacking, isBlocking, isLocked, blockIndicatorColor, blockOrder }: CardProps) => {
    const isTapped = card.tapped;
    const basePower = parseInt(card.power || '0');
    const baseToughness = parseInt(card.toughness || '0');
    const power = basePower + (card.plusOneCounters || 0) - (card.minusOneCounters || 0);
    const toughness = baseToughness + (card.plusOneCounters || 0) - (card.minusOneCounters || 0);
    const currentToughness = toughness - card.damageTaken;

    return (
        <motion.div
            className={clsx(
                "relative w-56 h-80 rounded-[18px] cursor-pointer overflow-hidden select-none border-2 border-slate-800 hover:border-slate-600",
                isAttacking ? "ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]" :
                    isBlocking ? "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]" :
                        "hover:shadow-2xl",
                isLocked && "opacity-70 scale-95 border-2 border-slate-700",
                className
            )}
            onClick={onClick}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: isAttacking ? 1.1 : isLocked ? 0.95 : 1,
                opacity: isLocked ? 0.6 : 1,
                rotate: isTapped ? 90 : 0,
                y: isAttacking ? -100 : isBlocking ? 40 : 0,
                zIndex: isAttacking ? 50 : isBlocking ? 45 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
                mass: 1
            }}
        >
            {/* Image Area - Full Card */}
            <div className="relative h-full w-full bg-black">
                {card.imageUrl ? (
                    <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-contain rounded-[18px]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs bg-slate-200">
                        {card.name} (No Image)
                    </div>
                )}

                {/* Visual Keyword Tags */}
                {card.keywords && card.keywords.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                        {card.keywords.map(keyword => (
                            <span
                                key={keyword}
                                className={clsx(
                                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded shadow-md backdrop-blur-sm border border-black/10",
                                    KEYWORD_COLORS[keyword] || 'bg-slate-500 text-white'
                                )}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                )}

                {/* Summoning Sickness Indicator */}
                {card.summoningSickness && !card.keywords?.includes('Haste') && (
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{
                            scale: 1,
                            rotate: isTapped ? -90 : 0
                        }}
                        className={clsx(
                            "absolute bg-yellow-500 border-2 border-yellow-300 text-black font-black px-2 py-1 rounded-lg shadow-lg z-30 text-[10px] uppercase tracking-wide",
                            isTapped ? "left-1 top-1/2 -translate-y-1/2" : "top-2 right-2"
                        )}
                    >
                        😴 Summoning Sickness
                    </motion.div>
                )}

                {/* +1/+1 Counter Indicator */}
                {(card.plusOneCounters || 0) > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            rotate: isTapped ? -90 : 0
                        }}
                        className={clsx(
                            "absolute bg-emerald-600 border-2 border-white text-white font-bold px-2 py-1 rounded-lg shadow-lg z-30",
                            isTapped ? "bottom-2 right-2" : "bottom-2 left-2"
                        )}
                    >
                        <span className="text-sm">+{card.plusOneCounters}/+{card.plusOneCounters}</span>
                    </motion.div>
                )}

                {/* -1/-1 Counter Indicator */}
                {(card.minusOneCounters || 0) > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            rotate: isTapped ? -90 : 0
                        }}
                        className={clsx(
                            "absolute bg-red-700 border-2 border-white text-white font-bold px-2 py-1 rounded-lg shadow-lg z-30",
                            isTapped ? "bottom-2 left-2" : "bottom-12 left-2"
                        )}
                    >
                        <span className="text-sm">-{card.minusOneCounters}/-{card.minusOneCounters}</span>
                    </motion.div>
                )}

                {/* Shield Counter Indicator */}
                {(card.shieldCounters || 0) > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            rotate: isTapped ? -90 : 0,
                            x: isTapped ? -4 : 0,
                            y: isTapped ? 10 : 0
                        }}
                        className={clsx(
                            "absolute bg-cyan-500 border-2 border-white text-white font-bold px-2 py-1 rounded-full shadow-lg z-30 flex items-center gap-1",
                            isTapped ? "left-1 top-1/2 -translate-y-1/2" : "top-2 right-2"
                        )}
                    >
                        <span className="text-xs">🛡️</span>
                        <span className="text-sm">{card.shieldCounters}</span>
                    </motion.div>
                )}

                {/* Damage / Health Indicator */}
                {card.damageTaken > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            rotate: isTapped ? -90 : 0
                        }}
                        className={clsx(
                            "absolute bg-red-600 border-2 border-white text-white font-bold px-2 py-1 rounded-lg shadow-lg z-30 flex items-center gap-1",
                            isTapped ? "bottom-2 left-2" : "bottom-2 right-2"
                        )}
                    >
                        <span className="text-xs opacity-80">{power}/</span>
                        <span className="text-base">{currentToughness}</span>
                    </motion.div>
                )}

                {/* Overlay Badges for Status */}
                <AnimatePresence>
                    {isAttacking && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/90 text-white text-xl font-black px-4 py-1 rounded border-2 border-white/50 shadow-xl backdrop-blur-sm z-20 pointer-events-none"
                        >
                            ATTACKING
                        </motion.div>
                    )}
                    {isBlocking && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600/90 text-white text-xl font-black px-4 py-1 rounded border-2 border-white/50 shadow-xl backdrop-blur-sm z-20 pointer-events-none"
                        >
                            BLOCKING
                        </motion.div>
                    )}

                    {/* Blocker Group Indicator (Matching Shield Counters) */}
                    {blockIndicatorColor && (
                        <motion.div
                            initial={{ scale: 0, y: 10 }}
                            animate={{
                                scale: 1,
                                y: 0,
                                rotate: isTapped ? -90 : 0
                            }}
                            className={clsx(
                                "absolute w-10 h-10 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] z-40 flex items-center justify-center backdrop-blur-md",
                                isTapped ? "left-1 top-1/2 -translate-y-1/2" : "top-2 right-2",
                                blockIndicatorColor
                            )}
                        >
                            <Shield className="text-white fill-white/20" size={20} strokeWidth={2.5} />
                        </motion.div>
                    )}

                    {/* Block Order Badge */}
                    {isBlocking && blockOrder !== undefined && (
                        <motion.div
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 border-2 border-white text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs z-50 shadow-lg"
                        >
                            {blockOrder}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
