import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';

describe('Combat Logic', () => {
    beforeEach(() => {
        // Reset store or state if needed
    });

    it('should handle 1v1 vanilla combat (both die)', () => {

        // Mocking state
        useGameStore.setState({
            players: [
                {
                    id: 'p1', name: 'P1', life: 20, battlefield: [
                        { id: 'c1', name: 'Bear', power: '2', toughness: '2', damageTaken: 0, keywords: [], controllerId: 'p1' } as any
                    ]
                } as any,
                {
                    id: 'p2', name: 'P2', life: 20, battlefield: [
                        { id: 'c2', name: 'Bear', power: '2', toughness: '2', damageTaken: 0, keywords: [], controllerId: 'p2' } as any
                    ]
                } as any
            ],
            activePlayerId: 'p1',
            attackers: ['c1'],
            blockers: { 'c1': ['c2'] }
        });

        const outcome = useGameStore.getState().calculateCombatOutcome();

        expect(outcome.deaths).toContain('c1');
        expect(outcome.deaths).toContain('c2');
        expect(outcome.damageEvents).toHaveLength(2);
    });

    it('should handle trample damage to player', () => {
        useGameStore.setState({
            players: [
                {
                    id: 'p1', name: 'P1', life: 20, battlefield: [
                        { id: 'c1', name: 'Thoctar', power: '5', toughness: '4', damageTaken: 0, keywords: ['Trample'], controllerId: 'p1' } as any
                    ]
                } as any,
                {
                    id: 'p2', name: 'P2', life: 20, battlefield: [
                        { id: 'c2', name: 'Bear', power: '2', toughness: '2', damageTaken: 0, keywords: [], controllerId: 'p2' } as any
                    ]
                } as any
            ],
            activePlayerId: 'p1',
            attackers: ['c1'],
            blockers: { 'c1': ['c2'] }
        });

        const outcome = useGameStore.getState().calculateCombatOutcome();

        // 5 power vs 2 toughness = 3 trample
        const playerDamage = outcome.damageEvents.find(e => e.targetId === 'p2');
        expect(playerDamage?.damage).toBe(3);
        expect(outcome.deaths).toContain('c2');
    });

    it('should handle deathtouch (1 damage is lethal)', () => {
        useGameStore.setState({
            players: [
                {
                    id: 'p1', name: 'P1', life: 20, battlefield: [
                        { id: 'c1', name: 'Squire', power: '1', toughness: '2', damageTaken: 0, keywords: ['Deathtouch'], controllerId: 'p1' } as any
                    ]
                } as any,
                {
                    id: 'p2', name: 'P2', life: 20, battlefield: [
                        { id: 'c2', name: 'Dragon', power: '5', toughness: '5', damageTaken: 0, keywords: [], controllerId: 'p2' } as any
                    ]
                } as any
            ],
            activePlayerId: 'p1',
            attackers: ['c1'],
            blockers: { 'c1': ['c2'] }
        });

        const outcome = useGameStore.getState().calculateCombatOutcome();

        expect(outcome.deaths).toContain('c2'); // Dragon dies to 1 deathtouch damage
        expect(outcome.deaths).toContain('c1'); // Squire dies to 5 normal damage
    });

    it('should handle deathtouch + trample (1 damage to blocker, rest to player)', () => {
        useGameStore.setState({
            players: [
                {
                    id: 'p1', name: 'P1', life: 20, battlefield: [
                        { id: 'c1', name: 'Death Trampler', power: '5', toughness: '5', damageTaken: 0, keywords: ['Deathtouch', 'Trample'], controllerId: 'p1' } as any
                    ]
                } as any,
                {
                    id: 'p2', name: 'P2', life: 20, battlefield: [
                        { id: 'c2', name: 'Big Wall', power: '0', toughness: '8', damageTaken: 0, keywords: [], controllerId: 'p2' } as any
                    ]
                } as any
            ],
            activePlayerId: 'p1',
            attackers: ['c1'],
            blockers: { 'c1': ['c2'] }
        });

        const outcome = useGameStore.getState().calculateCombatOutcome();

        // Lethal to 8 toughness wall is 1 because of deathtouch
        // Remaining 4 should trample
        const playerDamage = outcome.damageEvents.find(e => e.targetId === 'p2');
        expect(playerDamage?.damage).toBe(4);
        expect(outcome.deaths).toContain('c2');
    });

    it('should handle unblocked flying damage', () => {
        useGameStore.setState({
            players: [
                {
                    id: 'p1', name: 'P1', life: 20, battlefield: [
                        { id: 'c1', name: 'Bird', power: '2', toughness: '1', damageTaken: 0, keywords: ['Flying'], controllerId: 'p1' } as any
                    ]
                } as any,
                {
                    id: 'p2', name: 'P2', life: 20, battlefield: [
                        { id: 'c2', name: 'Bear', power: '2', toughness: '2', damageTaken: 0, keywords: [], controllerId: 'p2' } as any
                    ]
                } as any
            ],
            activePlayerId: 'p1',
            attackers: ['c1'],
            blockers: {} // Unblocked
        });

        const outcome = useGameStore.getState().calculateCombatOutcome();

        const playerDamage = outcome.damageEvents.find(e => e.targetId === 'p2');
        expect(playerDamage?.damage).toBe(2);
    });
});
