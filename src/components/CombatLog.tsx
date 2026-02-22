import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ScrollText } from 'lucide-react';

export const CombatLog = () => {
    const log = useGameStore(state => state.log);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [log]);

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full shrink-0">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 shadow-sm">
                <ScrollText size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Combat Log</h3>
            </div>

            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-3 space-y-2 font-mono text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
                {log.length === 0 && (
                    <div className="text-slate-600 italic text-center mt-4">No actions yet.</div>
                )}

                {log.map((entry, index) => {
                    const isAI = entry.startsWith('🤖');
                    return (
                        <div
                            key={index}
                            className={`pb-1 last:border-0 animate-in fade-in slide-in-from-left-2 duration-300 rounded px-1.5 py-0.5 ${isAI
                                    ? 'bg-gradient-to-r from-red-900/80 to-orange-900/60 border-l-4 border-l-red-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)] my-1'
                                    : 'border-b border-slate-800/50'
                                }`}
                        >
                            <span className={`mr-2 ${isAI ? 'text-red-300' : 'text-blue-400'}`}>[{index + 1}]</span>
                            {entry}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
