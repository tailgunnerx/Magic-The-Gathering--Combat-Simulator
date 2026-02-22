import { useState } from 'react';
import type { Player } from '../types';
import { Heart, Skull, Shield, Coins, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerHUDProps {
    player: Player;
    isActive: boolean;
}

export const PlayerHUD = ({ player, isActive }: PlayerHUDProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getColorInfo = (c: string) => {
        switch (c) {
            case 'W': return { class: "bg-[#f9faf1] border-yellow-200/50 shadow-[0_0_5px_rgba(249,250,241,0.5)]", icon: "☀️" };
            case 'U': return { class: "bg-[#0e68ab] border-blue-300/50 shadow-[0_0_5px_rgba(14,104,171,0.5)]", icon: "💧" };
            case 'B': return { class: "bg-[#2b2b2b] border-purple-900/50 shadow-[0_0_5px_rgba(0,0,0,0.5)]", icon: "💀" };
            case 'R': return { class: "bg-[#d3202a] border-red-400/50 shadow-[0_0_5px_rgba(211,32,42,0.5)]", icon: "⛰️" };
            case 'G': return { class: "bg-[#00733e] border-emerald-400/50 shadow-[0_0_5px_rgba(0,115,62,0.5)]", icon: "🍃" };
            default: return { class: "bg-slate-400", icon: "?" };
        }
    };

    const isLowLife = player.life < 15;

    // Shared heartbeat animation for low-life state
    const lowLifeAnimation = isLowLife ? {
        animate: {
            boxShadow: [
                '0 0 10px rgba(220, 38, 38, 0.2), inset 0 0 20px rgba(220, 38, 38, 0.05)',
                '0 0 25px rgba(220, 38, 38, 0.6), inset 0 0 40px rgba(220, 38, 38, 0.15)',
                '0 0 10px rgba(220, 38, 38, 0.2), inset 0 0 20px rgba(220, 38, 38, 0.05)'
            ],
            borderColor: [
                'rgba(220, 38, 38, 0.3)',
                'rgba(220, 38, 38, 0.8)',
                'rgba(220, 38, 38, 0.3)'
            ]
        },
        transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const }
    } : {};

    if (isCollapsed) {
        return (
            <motion.div
                {...lowLifeAnimation}
                className={`p-2 px-3 rounded-2xl border-2 transition-all duration-500 shadow-2xl backdrop-blur-md cursor-pointer select-none hover:bg-white/5 ${isLowLife ? 'border-red-600/50 bg-red-950/40' : isActive ? 'border-yellow-500 bg-slate-800/90' : 'border-slate-700 bg-slate-900/80'}`}
                onClick={() => setIsCollapsed(false)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white uppercase italic">{player.name}</span>
                    <div className="flex items-center gap-1 text-red-500">
                        <Heart size={14} fill="currentColor" />
                        <span className="text-lg font-black">{player.life}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Coins size={14} fill="currentColor" />
                        <span className="text-lg font-black">{player.gold}</span>
                    </div>
                    <ChevronUp size={14} className="text-slate-500 ml-1" />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            {...lowLifeAnimation}
            className={`p-4 rounded-2xl border-2 transition-all duration-500 shadow-2xl backdrop-blur-md ${isLowLife ? 'border-red-600/50 bg-red-950/40' : isActive ? 'border-yellow-500 bg-slate-800/90' : 'border-slate-700 bg-slate-900/80'}`}
        >
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{player.name}</h2>
                <div className="flex items-center gap-2">
                    <div className="flex gap-2 p-1.5 bg-black/40 rounded-full border border-white/5 shadow-inner">
                        {player.colorIdentity.map(c => {
                            const info = getColorInfo(c);
                            return (
                                <div
                                    key={c}
                                    className={`w-6 h-6 rounded-full border ${info.class} transition-transform hover:scale-125 cursor-help flex items-center justify-center text-[10px] shadow-lg`}
                                    title={c}
                                >
                                    {info.icon}
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                        title="Collapse"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2.5 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20 shadow-lg">
                        <Heart size={20} fill="currentColor" className="drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                        <span className="text-2xl font-black tracking-tighter">{player.life}</span>
                    </div>

                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            filter: ['drop-shadow(0 0 2px rgba(234, 179, 8, 0.4))', 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.8))', 'drop-shadow(0 0 2px rgba(234, 179, 8, 0.4))']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2.5 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20 shadow-lg"
                    >
                        <Coins size={20} fill="currentColor" className="drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                        <span className="text-2xl font-black tracking-tighter">{player.gold}</span>
                    </motion.div>
                </div>

                {/* Commander Info Bar */}
                {player.commander && (
                    <div className="relative group overflow-hidden bg-slate-950/60 rounded-xl border border-white/10 p-2 pl-3 flex items-center justify-between gap-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Commander</span>
                            <span className="text-[11px] font-bold text-indigo-300 truncate max-w-[140px] drop-shadow-[0_0_3px_rgba(129,140,248,0.4)]">
                                {player.commander.name}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-lg transition-transform group-hover:scale-110">
                            <img
                                src={player.commander.imageUrl}
                                alt={player.commander.name}
                                className="w-full h-full object-cover scale-150"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2 text-blue-400/80">
                        <Shield size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{player.library.length} Cards Library</span>
                    </div>
                    {player.poisonCounters > 0 && (
                        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                            <Skull size={12} />
                            <span className="text-xs font-black">{player.poisonCounters}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
