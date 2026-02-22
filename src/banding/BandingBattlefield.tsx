import type { Player, Card } from "../types";
import { BandingCard } from "./BandingCard";
import { useBandingStore } from "./bandingStore";

interface BandingBattlefieldProps {
    player: Player;
}

export const BandingBattlefield = ({ player }: BandingBattlefieldProps) => {
    const { bands } = useBandingStore();

    // Logic to separate banded cards from solo cards
    const soloCards = player.battlefield.filter((c: Card) => !bands.some((b: string[]) => b.includes(c.id)));

    return (
        <div className="flex flex-col gap-8 items-center w-full">
            {/* Solo Creatures */}
            <div className="flex flex-wrap justify-center gap-4">
                {soloCards.map((card: Card) => (
                    <BandingCard key={card.id} card={card} />
                ))}
            </div>

            {/* Bands */}
            <div className="flex flex-wrap justify-center gap-8">
                {bands.map((band: string[], idx: number) => {
                    // Check if this band belongs to this player (contains at least one of their cards)
                    const bandCards = band.map(id => player.battlefield.find(c => c.id === id)).filter(Boolean) as Card[];
                    if (bandCards.length === 0) return null;

                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="text-[10px] uppercase font-bold text-amber-500 mb-2 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                Band {idx + 1}
                            </div>
                            <div className="flex -space-x-12 hover:space-x-4 transition-all duration-500 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
                                {bandCards.map((card: Card) => (
                                    <BandingCard key={card.id} card={card} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
