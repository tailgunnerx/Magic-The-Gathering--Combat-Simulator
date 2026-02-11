import type { Player } from '../types';
import { Card } from './Card';
import { useGameStore } from '../store/gameStore';
import { AnimatePresence } from 'framer-motion';

interface BattlefieldProps {
    player: Player;
}

export const Battlefield = ({ player }: BattlefieldProps) => {
    const { phase, combatStep, activePlayerId, attackers, blockers, declareAttacker, declareBlocker, selectCard, selectedCardId, addLog } = useGameStore();

    const BLOCK_COLORS = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-cyan-500',
        'bg-orange-500',
        'bg-pink-500',
        'bg-lime-500',
        'bg-teal-500',
    ];

    const handleCardClick = (cardId: string) => {
        const isAttacker = activePlayerId === player.id;

        if (phase === 'combat' && combatStep === 'declareAttackers') {
            // ONLY the active player can declare/deselect attackers, 
            // and we only allow manual control for Player 1 (Human).
            if (isAttacker && activePlayerId === 'player1') {
                declareAttacker(cardId);
            }
        }

        if (phase === 'combat' && combatStep === 'declareBlockers') {
            // New Intuitive Flow: Select Attacker (Opponent Card) then Blocker (My Card)
            if (isAttacker) {
                // I clicked the active player's card (The Attacker)
                selectCard(cardId);
            }
            else {
                // I clicked my card (The Blocker)
                if (selectedCardId) {
                    declareBlocker(selectedCardId, cardId);
                } else {
                    addLog("Select an attacker first, then click your creature to block it.");
                }
            }
        }
    };

    return (
        // Changed to simple flex row, no wrapping, focused on "line" layout
        <div className="flex gap-6 items-center justify-center min-h-[300px] px-8 w-full max-w-7xl mx-auto">
            <AnimatePresence>
                {player.battlefield.length === 0 ? (
                    <div className="text-slate-600 font-mono text-sm border-2 border-dashed border-slate-800 rounded-lg p-6 opacity-50">
                        Empty Battlefield
                    </div>
                ) : (
                    player.battlefield.map((card) => {
                        const isAttacking = attackers.includes(card.id);

                        let isBlocking = false;
                        Object.values(blockers).forEach(blockerList => {
                            if (blockerList.includes(card.id)) isBlocking = true;
                        });

                        const isSelected = selectedCardId === card.id;
                        const isLocked = isBlocking; // One blocker -> one attacker, so if it's blocking, it's locked.

                        // Calculate block color
                        let blockIndicatorColor = undefined;

                        // If I am an attacker, am I blocked?
                        const blockedBy = blockers[card.id] || [];
                        if (isAttacking && blockedBy.length > 0) {
                            const attackerIndex = attackers.filter(id => (blockers[id] || []).length > 0).indexOf(card.id);
                            blockIndicatorColor = BLOCK_COLORS[attackerIndex % BLOCK_COLORS.length];
                        }

                        // If I am a blocker, who am I blocking?
                        if (isBlocking) {
                            const attackerId = Object.keys(blockers).find(attId => blockers[attId].includes(card.id));
                            if (attackerId) {
                                const attackerIndex = attackers.filter(id => (blockers[id] || []).length > 0).indexOf(attackerId);
                                blockIndicatorColor = BLOCK_COLORS[attackerIndex % BLOCK_COLORS.length];
                            }
                        }

                        let extraClass = "";
                        if (isSelected) extraClass = "ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900";

                        return (
                            <div key={card.id} className="relative">
                                <Card
                                    card={card}
                                    onClick={() => handleCardClick(card.id)}
                                    isAttacking={isAttacking}
                                    isBlocking={isBlocking}
                                    isLocked={isLocked}
                                    blockIndicatorColor={blockIndicatorColor}
                                    className={extraClass}
                                />
                            </div>
                        );
                    })
                )}
            </AnimatePresence>
        </div>
    );
};
