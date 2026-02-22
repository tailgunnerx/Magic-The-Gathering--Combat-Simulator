import { create } from 'zustand';
import type { Player, Card, Phase, CombatPhaseStep, DamageEvent } from '../types';
import { BANDING_CARD_POOL } from './bandingCards';
import { calculateBandingCombatOutcome } from './BandingLogic';

const INITIAL_LIFE = 40;

const createPlayer = (id: string, name: string): Player => ({
    id,
    name,
    life: INITIAL_LIFE,
    commander: null as any,
    colorIdentity: [],
    commanderDamage: {},
    poisonCounters: 0,
    library: [],
    hand: [],
    graveyard: [],
    exile: [],
    commandZone: [],
    battlefield: [],
    gold: 0,
});

interface BandingStore {
    players: Player[];
    activePlayerId: string;
    phase: Phase;
    combatStep: CombatPhaseStep | undefined;
    attackers: string[];
    bands: string[][];
    blockers: Record<string, string[]>;
    log: string[];

    startGame: (startingPlayerId: string) => void;
    nextPhase: () => void;
    shuffleBoard: () => void;
    declareAttacker: (cardId: string) => void;
    addToBand: (cardId: string, targetCardId: string) => void;
    declareBlocker: (attackerId: string, blockerId: string) => void;
    resolveCombat: () => void;
    addLog: (msg: string) => void;
}

export const useBandingStore = create<BandingStore>((set, get) => ({
    players: [
        createPlayer('player1', 'Player 1'),
        createPlayer('player2', 'Player 2'),
    ],
    activePlayerId: 'player1',
    phase: 'beginning',
    combatStep: undefined,
    attackers: [],
    bands: [],
    blockers: {},
    log: ["Welcome to Banding Mode!", "This mode is designed for testing complex combat logic."],

    addLog: (msg: string) => set(state => ({ log: [...state.log, msg] })),

    startGame: (startingPlayerId: string) => {
        set({
            activePlayerId: startingPlayerId,
            phase: 'main1',
            combatStep: undefined
        });
        get().addLog(`Battle starts! ${startingPlayerId === 'player1' ? 'You' : 'Opponent'} go first.`);
    },

    shuffleBoard: () => {
        const p1Cards = [...BANDING_CARD_POOL].sort(() => 0.5 - Math.random()).slice(0, 4);
        const p2Cards = [...BANDING_CARD_POOL].sort(() => 0.5 - Math.random()).slice(0, 4);

        const newPlayers = get().players.map((p: Player) => {
            const cards = p.id === 'player1' ? p1Cards : p2Cards;
            return {
                ...p,
                life: INITIAL_LIFE,
                battlefield: cards.map((c, i) => ({
                    ...c,
                    id: `${p.id}-creature-${i}-${Date.now()}`,
                    controllerId: p.id,
                    ownerId: p.id,
                    tapped: false,
                    damageTaken: 0,
                    plusOneCounters: 0,
                    minusOneCounters: 0,
                    summoningSickness: false,
                    shieldCounters: 0
                })) as Card[]
            };
        });

        set({
            players: newPlayers,
            phase: 'beginning',
            combatStep: undefined,
            attackers: [],
            bands: [],
            blockers: {},
            log: ["--- NEW BANDING BATTLE ---"]
        });
    },

    declareAttacker: (cardId: string) => {
        const { combatStep, attackers, bands } = get();
        if (combatStep !== 'declareAttackers') return;

        if (attackers.includes(cardId)) {
            set({
                attackers: attackers.filter(id => id !== cardId),
                bands: bands.map(b => b.filter(id => id !== cardId)).filter(b => b.length > 0)
            });
        } else {
            set({ attackers: [...attackers, cardId] });
        }
    },

    addToBand: (cardId: string, targetCardId: string) => {
        const { bands, players, activePlayerId } = get();
        const player = players.find(p => p.id === activePlayerId);
        const card = player?.battlefield.find(c => c.id === cardId);
        const target = player?.battlefield.find(c => c.id === targetCardId);

        if (!card || !target) return;

        const hasBanding = (c: Card | undefined) => c?.keywords?.includes('Banding');
        let bandIndex = bands.findIndex(b => b.includes(targetCardId));

        set(state => {
            let newBands = [...state.bands];
            if (bandIndex === -1) {
                newBands.push([targetCardId, cardId]);
            } else {
                const currentBand = newBands[bandIndex];
                const nonBandingCount = currentBand.filter(id => !hasBanding(player?.battlefield.find(c => c.id === id))).length;

                if (!hasBanding(card) && nonBandingCount >= 1) {
                    get().addLog("A band can only have one creature without banding.");
                    return state;
                }

                newBands[bandIndex] = [...currentBand, cardId];
            }
            return { bands: newBands };
        });
    },

    declareBlocker: (attackerId: string, blockerId: string) => {
        const { activePlayerId, players } = get();
        const defenderId = activePlayerId === 'player1' ? 'player2' : 'player1';
        const defender = players.find(p => p.id === defenderId);
        const blocker = defender?.battlefield.find(c => c.id === blockerId);

        if (!blocker || blocker.tapped) return;

        set(state => ({
            blockers: {
                ...state.blockers,
                [attackerId]: [...(state.blockers[attackerId] || []), blockerId]
            }
        }));
    },

    nextPhase: () => {
        const { phase, combatStep } = get();
        if (phase === 'beginning') set({ phase: 'main1' });
        else if (phase === 'main1') set({ phase: 'combat', combatStep: 'begin' });
        else if (phase === 'combat') {
            if (combatStep === 'begin') set({ combatStep: 'declareAttackers' });
            else if (combatStep === 'declareAttackers') set({ combatStep: 'declareBlockers' });
            else if (combatStep === 'declareBlockers') set({ combatStep: 'combatDamage' });
            else if (combatStep === 'combatDamage') set({ combatStep: 'end' });
            else set({ phase: 'main2', combatStep: undefined });
        }
        else if (phase === 'main2') set({ phase: 'end' });
        else {
            set(state => ({
                phase: 'beginning',
                activePlayerId: state.activePlayerId === 'player1' ? 'player2' : 'player1'
            }));
        }
    },

    resolveCombat: () => {
        const { attackers, blockers, bands, players, activePlayerId } = get();

        const attackerPlayer = players.find(p => p.id === activePlayerId);
        const defenderPlayer = players.find(p => p.id !== activePlayerId);

        if (!attackerPlayer || !defenderPlayer) return;

        const attackerCards = attackerPlayer.battlefield.filter(c => attackers.includes(c.id));
        const blockerMap: Record<string, Card[]> = {};

        Object.entries(blockers).forEach(([attId, blkIds]) => {
            blockerMap[attId] = defenderPlayer.battlefield.filter(c => (blkIds as string[]).includes(c.id));
        });

        const outcome = calculateBandingCombatOutcome(
            attackerCards,
            blockerMap,
            bands,
            activePlayerId
        );

        set(state => {
            const newPlayers = state.players.map(p => {
                let newLife = p.life;

                outcome.damageEvents.forEach(e => {
                    if (e.type === 'toPlayer' && e.targetId === p.id) {
                        newLife -= e.damage;
                    }
                });

                const newBattlefield = p.battlefield.map(card => {
                    const damage = outcome.damageEvents
                        .filter(e => e.targetId === card.id)
                        .reduce((sum, e) => sum + e.damage, 0);

                    return { ...card, damageTaken: card.damageTaken + damage };
                });

                const graveyard = [...p.graveyard];
                const survivingBattlefield = newBattlefield.filter(card => {
                    const toughness = parseInt(card.toughness || '0') + card.plusOneCounters - card.minusOneCounters;

                    if (card.damageTaken >= toughness) {
                        graveyard.push(card);
                        get().addLog(`💀 ${card.name} died.`);
                        return false;
                    }
                    return true;
                });

                return { ...p, life: newLife, battlefield: survivingBattlefield, graveyard };
            });

            return { players: newPlayers };
        });

        outcome.explanation.forEach(msg => get().addLog(msg));
        get().nextPhase();
    }
}));
