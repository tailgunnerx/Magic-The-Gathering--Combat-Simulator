import { motion } from 'framer-motion';
import { Shield, User } from 'lucide-react';
import type { Card as CardType } from '../types';
import { useBandingStore } from './bandingStore';

interface BandingCardProps {
    card: CardType;
}

export const BandingCard = ({ card }: BandingCardProps) => {
    const {
        activePlayerId,
        combatStep,
        attackers,
        bands,
        declareAttacker
    } = useBandingStore();

    const isAttacking = attackers.includes(card.id);
    const band = bands.find(b => b.includes(card.id));
    const isBanded = !!band;
    const bandIndex = bands.indexOf(band || []);

    const canDeclareAttacker =
        activePlayerId === card.controllerId &&
        combatStep === 'declareAttackers' &&
        !card.tapped;

    const currentPower = parseInt(card.power || '0') + card.plusOneCounters - card.minusOneCounters;
    const currentToughness = parseInt(card.toughness || '0') + card.plusOneCounters - card.minusOneCounters;

    return (
        <motion.div
            layout
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative w-40 h-56 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border-2 cursor-pointer
                ${isAttacking ? 'border-red-500 ring-2 ring-red-500/50' : 'border-slate-700 hover:border-slate-500'}
                ${card.tapped ? 'rotate-90 scale-90 -translate-y-4' : ''}
                ${isBanded ? 'ring-2 ring-amber-400' : ''}
            `}
            onClick={() => {
                if (canDeclareAttacker) {
                    declareAttacker(card.id);
                }
            }}
        >
            {/* Band indicator */}
            {isBanded && (
                <div className="absolute top-2 left-2 z-20 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1 border border-black/20">
                    <Shield size={10} /> BAND {bandIndex + 1}
                </div>
            )}

            {/* Keyword badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
                {card.keywords.map(kw => (
                    <div key={kw} className="bg-slate-900/90 text-white text-[8px] px-1.5 py-0.5 rounded border border-slate-700 font-bold uppercase tracking-tighter">
                        {kw}
                    </div>
                ))}
            </div>

            {/* Image area */}
            <div className="h-1/2 w-full bg-slate-800 relative">
                {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User size={40} className="text-slate-600" />
                    </div>
                )}
                {/* Damage tint */}
                {card.damageTaken > 0 && (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center font-black text-white text-2xl shadow-[inset_0_0_20px_rgba(220,38,38,0.5)]">
                        -{card.damageTaken}
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className="h-1/2 bg-slate-900 p-2 flex flex-col justify-between border-t border-slate-800">
                <div>
                    <h3 className="text-xs font-black tracking-tight leading-none text-slate-100 truncate mt-1 uppercase">
                        {card.name}
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5 italic truncate lowercase">
                        {card.typeLine}
                    </p>
                </div>

                <div className="flex justify-between items-end">
                    <div className="bg-black/40 px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-inner">
                        <span className="text-sm font-black text-amber-400 drop-shadow-sm">{currentPower}</span>
                        <div className="w-px h-3 bg-white/20"></div>
                        <span className="text-sm font-black text-blue-400 drop-shadow-sm">{currentToughness}</span>
                    </div>
                </div>
            </div>

            {/* Selection/Action overlay */}
            <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-200 pointer-events-none"></div>
        </motion.div>
    );
};
