import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { clsx } from 'clsx';
import { Swords, Zap, Clock, Moon } from 'lucide-react';

const TURN_PHASES = [
    { id: 'beginning', label: 'Beginning Phase', icon: Clock },
    { id: 'main1', label: 'Pre-Combat Main', icon: Zap },
    { id: 'combat', label: 'Combat Phase', icon: Swords },
    { id: 'main2', label: 'Post-Combat Main', icon: Zap },
    { id: 'end', label: 'Ending Phase', icon: Moon }
];

export const CombatTimeline = () => {
    const { phase } = useGameStore();

    const currentIndex = TURN_PHASES.findIndex(s => s.id === phase);
    if (currentIndex === -1) return null;

    return (
        <div className="flex flex-col items-center gap-2 px-8 py-1 min-w-[500px]">
            {/* Path & Dots */}
            <div className="relative w-full h-[2px] bg-slate-800/50 rounded-full mt-4">
                {/* Progress bar background track */}
                <div className="absolute inset-0 h-[2px] bg-slate-800/40 rounded-full" />

                {/* Active Progress Overlay */}
                <motion.div
                    className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-amber-500 rounded-full z-10 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                    initial={false}
                    animate={{ width: `${(Math.max(0, currentIndex) / (TURN_PHASES.length - 1)) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />

                <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center -translate-y-1/2">
                    {TURN_PHASES.map((step, idx) => {
                        const isPast = idx < currentIndex;
                        const isCurrent = idx === currentIndex;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.id} className="relative group flex flex-col items-center">
                                {/* Label (Above) */}
                                <span
                                    className={clsx(
                                        "absolute -top-5 whitespace-nowrap text-[7px] font-black uppercase tracking-[0.1em] transition-all duration-500",
                                        isCurrent ? "text-red-400 scale-110" :
                                            isPast ? "text-slate-400" : "text-slate-600 opacity-40"
                                    )}
                                >
                                    {step.label}
                                </span>

                                {/* Checkpoint Dot */}
                                <motion.div
                                    animate={isCurrent ? {
                                        scale: [1, 1.25, 1],
                                    } : { scale: 1 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className={clsx(
                                        "w-2 h-2 rounded-full border transition-all duration-700 z-20 flex items-center justify-center",
                                        isCurrent ? "bg-red-500 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)]" :
                                            isPast ? "bg-red-900 border-red-500" : "bg-slate-950 border-slate-800"
                                    )}
                                >
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="active-dot-radiation"
                                            className="absolute -inset-2 bg-red-500/10 rounded-full blur-sm"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                </motion.div>

                                {/* Tooltip Icon - Floating below */}
                                <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-1 pointer-events-none">
                                    <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-1 rounded shadow-2xl">
                                        <StepIcon size={10} className={isCurrent ? "text-red-400" : "text-slate-500"} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
