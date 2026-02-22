import { useBandingStore } from './bandingStore';
import { useModeStore } from '../store/modeStore';
import { BandingBattlefield } from './BandingBattlefield';
import { Shield, Sword, RefreshCcw, ArrowLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BandingInterface = () => {
    const { setMode } = useModeStore();
    const {
        players,
        activePlayerId,
        phase,
        combatStep,
        nextPhase,
        shuffleBoard,
        log,
        attackers,
        bands,
        addToBand
    } = useBandingStore();

    const p1 = players[0];
    const p2 = players[1];

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
            {/* Top Navigation */}
            <div className="bg-slate-900/80 backdrop-blur-md p-3 border-b border-slate-800 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setMode('normal')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft size={18} /> Exit Mode
                    </button>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Shield className="text-amber-500" size={20} />
                        <h1 className="font-black tracking-tighter uppercase text-lg text-slate-100">Banding Lab</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700 flex items-center gap-4 shadow-inner">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] uppercase font-bold text-slate-500 italic">Phase</span>
                            <span className="text-sm font-black uppercase text-amber-400">{phase}</span>
                        </div>
                        <div className="w-px h-6 bg-slate-700"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] uppercase font-bold text-slate-500 italic">Step</span>
                            <span className="text-sm font-black uppercase text-red-400">{combatStep || 'N/A'}</span>
                        </div>
                    </div>

                    <button
                        onClick={nextPhase}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-black uppercase tracking-tight shadow-lg active:scale-95 transition-all text-sm border-b-4 border-blue-800"
                    >
                        Advance Phase
                    </button>
                </div>

                <button
                    onClick={shuffleBoard}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl font-bold transition-all border border-slate-700 text-sm"
                >
                    <RefreshCcw size={16} /> Respawn Cards
                </button>
            </div>

            {/* Main Lab Area */}
            <div className="flex-grow flex relative overflow-hidden">

                {/* Left Sidebar: Banding Logic Console */}
                <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/30">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                        <h2 className="flex items-center gap-2 font-black uppercase tracking-tighter text-slate-300">
                            <Info size={16} className="text-blue-400" /> Interaction Log
                        </h2>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-2 font-mono text-[11px]">
                        <AnimatePresence>
                            {log.slice().reverse().map((m: string, i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className="p-2 bg-white/5 rounded border-l-2 border-slate-700 text-slate-400 leading-tight"
                                >
                                    <span className="text-slate-600 mr-2">[{log.length - i}]</span> {m}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Band Formation Helper */}
                    {phase === 'combat' && combatStep === 'declareAttackers' && attackers.length > 0 && (
                        <div className="p-4 bg-amber-500/10 border-t border-amber-500/20">
                            <h3 className="text-xs font-bold text-amber-500 uppercase mb-3 flex items-center gap-2">
                                <Sword size={14} /> Form a Band
                            </h3>
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-400 leading-tight mb-2">
                                    Click an attacking creature to make it the leader, then click others to join its band.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {attackers.map((id: string) => {
                                        const card = p1.battlefield.find(c => c.id === id);
                                        if (!card) return null;
                                        const isInBand = bands.some(b => b.includes(id));

                                        return (
                                            <button
                                                key={id}
                                                onClick={() => {
                                                    if (!isInBand) {
                                                        if (bands.length > 0) {
                                                            addToBand(id, bands[0][0]);
                                                        } else {
                                                            const otherAttacker = attackers.find(oid => oid !== id);
                                                            if (otherAttacker) addToBand(id, otherAttacker);
                                                        }
                                                    }
                                                }}
                                                className={`text-[9px] px-2 py-1 rounded border transition-all ${isInBand
                                                        ? 'bg-amber-500 border-amber-400 text-black font-black'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400'
                                                    }`}
                                            >
                                                {card.name.split(' ')[0]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Battle Plane */}
                <div className="flex-grow flex flex-col relative bg-[#08080c]">
                    {/* Playmat Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 via-transparent to-blue-900/5 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

                    {/* Opponent Zone */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 border-b border-slate-800/50">
                        <div className="mb-4 flex flex-col items-center">
                            <div className="bg-red-900/20 px-4 py-1 rounded-full border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase mb-2">
                                Opponent Field
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="text-2xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                    {p2.life} ❤️
                                </div>
                            </div>
                        </div>
                        <BandingBattlefield player={p2} />
                    </div>

                    {/* Player Zone */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <BandingBattlefield player={p1} />
                        <div className="mt-8 flex flex-col items-center">
                            <div className="flex gap-4 items-center mb-2">
                                <div className="text-2xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                    {p1.life} ❤️
                                </div>
                            </div>
                            <div className="bg-blue-900/20 px-4 py-1 rounded-full border border-blue-500/20 text-blue-500 text-[10px] font-black tracking-widest uppercase">
                                Your Field
                            </div>
                        </div>
                    </div>

                    {/* Active Turn Indicator Float */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 pointer-events-none transition-all duration-700 ${activePlayerId === 'player1' ? 'rotate-0' : 'rotate-180'}`}>
                        <Sword size={400} className={activePlayerId === 'player1' ? 'text-blue-500' : 'text-red-500'} />
                    </div>
                </div>
            </div>
        </div>
    );
};
