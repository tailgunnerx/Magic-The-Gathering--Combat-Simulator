import { useState } from 'react';
import type { Player } from '../types';
import { Heart, Skull, Shield, Coins, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

    return (
        <div className={`rounded-2xl border-2 transition-all duration-500 shadow-2xl backdrop-blur-md ${isActive ? 'border-yellow-500 bg-slate-800/90' : 'border-slate-700 bg-slate-900/80'}`}>
            {/* Clickable Header - Always Visible */}
            <div
                className="p-3 flex items-center gap-3 cursor-pointer select-none hover:bg-white/5 transition-colors rounded-2xl"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <h2 className="text-lg font-black text-white tracking-tight uppercase italic">{player.name}</h2>

                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-2.5 py-1 rounded-xl border border-red-500/20">
                    <Heart size={16} fill="currentColor" className="drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <span className="text-xl font-black tracking-tighter">{player.life}</span>
                </div>

                {player.id === 'player1' && (
                    <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                        <Coins size={16} fill="currentColor" />
                        <span className="text-xl font-black tracking-tighter">{player.gold}</span>
                    </div>
                )}

                <div className="flex gap-1.5 p-1 bg-black/40 rounded-full border border-white/5">
                    {player.colorIdentity.map(c => {
                        const info = getColorInfo(c);
                        return (
                            <div
                                key={c}
                                className={`w-5 h-5 rounded-full border ${info.class} flex items-center justify-center text-[9px]`}
                                title={c}
                            >
                                {info.icon}
                            </div>
                        );
                    })}
                </div>

                <div className="ml-auto text-slate-500">
                    {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {/* Collapsible Details */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 flex flex-col gap-2">
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
                )}
            </AnimatePresence>
        </div>
    );
};
