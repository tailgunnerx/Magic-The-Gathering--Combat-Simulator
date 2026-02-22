import type { Card, DamageEvent, CombatOutcome } from '../types';

/**
 * Calculates combat outcome specifically for Banding mode.
 * In Banding, the player controlling the Banded group decides damage distribution.
 */

export const calculateBandingCombatOutcome = (
    attackers: Card[],
    blockers: Record<string, Card[]>,
    bands: string[][],
    activePlayerId: string
): CombatOutcome => {
    const damageEvents: DamageEvent[] = [];
    const deaths: string[] = [];
    const deathDescriptions: string[] = [];
    const explanation: string[] = ["Banding Damage Resolution:"];

    // 1. Attacker Damage assigned to Blockers/Defender
    attackers.forEach(att => {
        const attPowerTotal = parseInt(att.power || '0') + att.plusOneCounters - att.minusOneCounters;
        const curBlockers = blockers[att.id] || [];

        if (curBlockers.length === 0) {
            // Unblocked
            damageEvents.push({
                sourceId: att.id,
                targetId: activePlayerId === 'player1' ? 'player2' : 'player1',
                damage: attPowerTotal,
                type: 'toPlayer'
            });
            explanation.push(`${att.name} deals ${attPowerTotal} to Player.`);
        } else {
            // Blocked. Check for banding in blockers.
            const hasBandingBlocker = curBlockers.some(b => b.keywords.includes('Banding'));

            if (hasBandingBlocker) {
                explanation.push(`🛡️ ${att.name} blocked by a band! Defending player distributes ${attPowerTotal} damage.`);
                let remaining = attPowerTotal;
                curBlockers.forEach((blk, idx) => {
                    const dmg = idx === curBlockers.length - 1 ? remaining : Math.floor(attPowerTotal / curBlockers.length);
                    damageEvents.push({ sourceId: att.id, targetId: blk.id, damage: dmg, type: 'toCreature' });
                    remaining -= dmg;
                });
            } else {
                // Normal combat: Damage assigned to first blocker, then carry over if trample
                let remaining = attPowerTotal;
                for (const blk of curBlockers) {
                    const toughnessValue = parseInt(blk.toughness || '0') + blk.plusOneCounters - blk.minusOneCounters - blk.damageTaken;
                    const deal = Math.min(remaining, toughnessValue);
                    damageEvents.push({ sourceId: att.id, targetId: blk.id, damage: deal, type: 'toCreature' });
                    remaining -= deal;
                    if (remaining <= 0) break;
                }
            }
        }
    });

    // 2. Blocker Damage assigned to Attackers
    Object.entries(blockers).forEach(([attId, curBlockers]) => {
        const attacker = attackers.find(a => a.id === attId);
        if (!attacker) return;

        const isAttackerBanded = bands.some(b => b.includes(attId));
        const band = bands.find(b => b.includes(attId)) || [attId];
        const bandCreatures = attackers.filter(a => band.includes(a.id));
        const totalBlockerDamage = curBlockers.reduce((s, b) => s + (parseInt(b.power || '0') + b.plusOneCounters - b.minusOneCounters), 0);

        if (isAttackerBanded && totalBlockerDamage > 0) {
            explanation.push(`⚔️ Band led by ${attacker.name} distributes ${totalBlockerDamage} incoming damage.`);
            let remaining = totalBlockerDamage;
            const sortedBand = [...bandCreatures].sort((a, b) => {
                const tA = parseInt(a.toughness || '0') + a.plusOneCounters - a.minusOneCounters;
                const tB = parseInt(b.toughness || '0') + b.plusOneCounters - b.minusOneCounters;
                return tB - tA;
            });

            for (const member of sortedBand) {
                const toughnessValue = parseInt(member.toughness || '0') + member.plusOneCounters - member.minusOneCounters - member.damageTaken;
                const deal = Math.min(remaining, toughnessValue);
                damageEvents.push({ sourceId: 'blocker_group', targetId: member.id, damage: deal, type: 'toCreature' });
                remaining -= deal;
                if (remaining <= 0) break;
            }
            if (remaining > 0) {
                const first = damageEvents.find(e => e.targetId === sortedBand[0].id);
                if (first) first.damage += remaining;
            }
        } else {
            // Normal blocker damage
            curBlockers.forEach(blk => {
                const blkPowerTotal = parseInt(blk.power || '0') + blk.plusOneCounters - blk.minusOneCounters;
                damageEvents.push({ sourceId: blk.id, targetId: attId, damage: blkPowerTotal, type: 'toCreature' });
            });
        }
    });

    return {
        damageEvents,
        deaths,
        deathDescriptions,
        attackerLifeGained: 0,
        defenderLifeGained: 0,
        explanation
    };
};
