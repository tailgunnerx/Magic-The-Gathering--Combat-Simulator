import { create } from 'zustand';
import type { GameState, Player, Phase, CombatPhaseStep, Card, CombatOutcome, DamageEvent } from '../types';

const INITIAL_LIFE = 40;

// Card Pool - ~20 varied creatures
const CARD_POOL: Omit<Card, 'id' | 'controllerId' | 'ownerId' | 'tapped' | 'damageTaken' | 'plusOneCounters' | 'minusOneCounters' | 'summoningSickness' | 'shieldCounters'>[] = [
    { name: "Serra Angel", manaCost: "{3}{W}{W}", typeLine: "Creature — Angel", oracleText: "Flying, Vigilance", power: "4", toughness: "4", colors: ["W"], keywords: ["Flying", "Vigilance"], imageUrl: "https://api.scryfall.com/cards/named?exact=Serra+Angel&format=image&version=normal" },
    { name: "Shivan Dragon", manaCost: "{4}{R}{R}", typeLine: "Creature — Dragon", oracleText: "Flying", power: "5", toughness: "5", colors: ["R"], keywords: ["Flying"], imageUrl: "https://api.scryfall.com/cards/named?exact=Shivan+Dragon&format=image&version=normal" },
    { name: "Elite Vanguard", manaCost: "{W}", typeLine: "Creature — Human Soldier", oracleText: "", power: "2", toughness: "1", colors: ["W"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Elite+Vanguard&format=image&version=normal" },
    { name: "Goblin Piker", manaCost: "{1}{R}", typeLine: "Creature — Goblin", oracleText: "", power: "2", toughness: "1", colors: ["R"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Goblin+Piker&format=image&version=normal" },
    { name: "Garruk's Companion", manaCost: "{G}{G}", typeLine: "Creature — Beast", oracleText: "Trample", power: "3", toughness: "2", colors: ["G"], keywords: ["Trample"], imageUrl: "https://api.scryfall.com/cards/named?exact=Garruk%27s+Companion&format=image&version=normal" },
    { name: "Vampire Nighthawk", manaCost: "{1}{B}{B}", typeLine: "Creature — Vampire Shaman", oracleText: "Flying, Deathtouch, Lifelink", power: "2", toughness: "3", colors: ["B"], keywords: ["Flying", "Deathtouch", "Lifelink"], imageUrl: "https://api.scryfall.com/cards/named?exact=Vampire+Nighthawk&format=image&version=normal" },
    { name: "Giant Spider", manaCost: "{3}{G}", typeLine: "Creature — Spider", oracleText: "Reach", power: "2", toughness: "4", colors: ["G"], keywords: ["Reach"], imageUrl: "https://api.scryfall.com/cards/named?exact=Giant+Spider&format=image&version=normal" },
    { name: "Llanowar Elves", manaCost: "{G}", typeLine: "Creature — Elf Druid", oracleText: "", power: "1", toughness: "1", colors: ["G"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Llanowar+Elves&format=image&version=normal" },
    { name: "Air Elemental", manaCost: "{3}{U}{U}", typeLine: "Creature — Elemental", oracleText: "Flying", power: "4", toughness: "4", colors: ["U"], keywords: ["Flying"], imageUrl: "https://api.scryfall.com/cards/named?exact=Air+Elemental&format=image&version=normal" },
    { name: "Hypnotic Specter", manaCost: "{1}{B}{B}", typeLine: "Creature — Specter", oracleText: "Flying", power: "2", toughness: "2", colors: ["B"], keywords: ["Flying"], imageUrl: "https://api.scryfall.com/cards/named?exact=Hypnotic+Specter&format=image&version=normal" },
    { name: "Craw Wurm", manaCost: "{4}{G}{G}", typeLine: "Creature — Wurm", oracleText: "", power: "6", toughness: "4", colors: ["G"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Craw+Wurm&format=image&version=normal" },
    { name: "Savannah Lions", manaCost: "{W}", typeLine: "Creature — Cat", oracleText: "", power: "2", toughness: "1", colors: ["W"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Savannah+Lions&format=image&version=normal" },
    { name: "Woolly Thoctar", manaCost: "{R}{G}{W}", typeLine: "Creature — Beast", oracleText: "", power: "5", toughness: "4", colors: ["R", "G", "W"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Woolly+Thoctar&format=image&version=normal" },
    { name: "Storm Crow", manaCost: "{1}{U}", typeLine: "Creature — Bird", oracleText: "Flying", power: "1", toughness: "2", colors: ["U"], keywords: ["Flying"], imageUrl: "https://api.scryfall.com/cards/named?exact=Storm+Crow&format=image&version=normal" },
    { name: "Dark Confidant", manaCost: "{1}{B}", typeLine: "Creature — Human Wizard", oracleText: "", power: "2", toughness: "1", colors: ["B"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Dark+Confidant&format=image&version=normal" },
    { name: "Baneslayer Angel", manaCost: "{3}{W}{W}", typeLine: "Creature — Angel", oracleText: "Flying, First Strike, Lifelink", power: "5", toughness: "5", colors: ["W"], keywords: ["Flying", "First Strike", "Lifelink"], imageUrl: "https://api.scryfall.com/cards/named?exact=Baneslayer+Angel&format=image&version=normal" },
    { name: "Stoneforge Mystic", manaCost: "{1}{W}", typeLine: "Creature — Kor Artificer", oracleText: "", power: "1", toughness: "2", colors: ["W"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Stoneforge+Mystic&format=image&version=normal" },
    { name: "Gravecrawler", manaCost: "{B}", typeLine: "Creature — Zombie", oracleText: "", power: "2", toughness: "1", colors: ["B"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Gravecrawler&format=image&version=normal" },
    { name: "Diregraf Ghoul", manaCost: "{B}", typeLine: "Creature — Zombie", oracleText: "", power: "2", toughness: "2", colors: ["B"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Diregraf+Ghoul&format=image&version=normal" },
    { name: "Gray Merchant of Asphodel", manaCost: "{3}{B}{B}", typeLine: "Creature — Zombie Cleric", oracleText: "", power: "2", toughness: "4", colors: ["B"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Gray+Merchant+of+Asphodel&format=image&version=normal" },
    { name: "Liliana's Reaver", manaCost: "{2}{B}{B}", typeLine: "Creature — Zombie", oracleText: "Deathtouch", power: "4", toughness: "3", colors: ["B"], keywords: ["Deathtouch"], imageUrl: "https://api.scryfall.com/cards/named?exact=Liliana%27s+Reaver&format=image&version=normal" },
    { name: "Soul Warden", manaCost: "{W}", typeLine: "Creature — Human Cleric", oracleText: "", power: "1", toughness: "1", colors: ["W"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Soul+Warden&format=image&version=normal" },
    { name: "Grand Abolisher", manaCost: "{W}{W}", typeLine: "Creature — Human Cleric", oracleText: "", power: "2", toughness: "2", colors: ["W"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Grand+Abolisher&format=image&version=normal" },
    { name: "Thalia, Guardian of Thraben", manaCost: "{1}{W}", typeLine: "Legendary Creature — Human Soldier", oracleText: "First Strike", power: "2", toughness: "1", colors: ["W"], keywords: ["First Strike"], imageUrl: "https://api.scryfall.com/cards/named?exact=Thalia%2C+Guardian+of+Thraben&format=image&version=normal" },
    { name: "Olivia Voldaren", manaCost: "{2}{B}{R}", typeLine: "Legendary Creature — Vampire", oracleText: "Flying", power: "3", toughness: "3", colors: ["B", "R"], keywords: ["Flying"], imageUrl: "https://api.scryfall.com/cards/named?exact=Olivia+Voldaren&format=image&version=normal" },
    { name: "Aurelia, the Warleader", manaCost: "{2}{R}{R}{W}{W}", typeLine: "Legendary Creature — Angel", oracleText: "Flying, Vigilance, Haste", power: "3", toughness: "4", colors: ["R", "W"], keywords: ["Flying", "Vigilance", "Haste"], imageUrl: "https://api.scryfall.com/cards/named?exact=Aurelia%2C+the+Warleader&format=image&version=normal" },
    { name: "Liliana's Standard Bearer", manaCost: "{2}{B}", typeLine: "Creature — Zombie Knight", oracleText: "", power: "3", toughness: "1", colors: ["B"], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Liliana%27s+Standard+Bearer&format=image&version=normal" },
    { name: "Steel Overseer", manaCost: "{2}", typeLine: "Artifact Creature — Construct", oracleText: "", power: "1", toughness: "1", colors: [], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Steel+Overseer&format=image&version=normal" },
    { name: "Solemn Simulacrum", manaCost: "{4}", typeLine: "Artifact Creature — Golem", oracleText: "", power: "2", toughness: "2", colors: [], keywords: [], imageUrl: "https://api.scryfall.com/cards/named?exact=Solemn+Simulacrum&format=image&version=normal" }
].filter(c => c.typeLine.includes("Creature"));


const createPlayer = (id: string, name: string): Player => {
    return {
        id,
        name,
        life: INITIAL_LIFE,
        commanderDamage: {},
        poisonCounters: 0,
        library: [],
        hand: [], // No hand
        graveyard: [],
        exile: [],
        commandZone: [],
        battlefield: [], // Init empty, filled by shuffle
        gold: 0,
    };
};

interface GameStore extends GameState {
    resolveCombat: () => void;
    shuffleBoard: () => void;
    performOpponentBlocks: () => void;
    getCombatHints: () => string[];
    combatStats: {
        damageDealt: number;
        damageBlocked: number;
        creaturesLost: number;
    };
    calculateCombatOutcome: () => CombatOutcome;
    closeSummary: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    players: [
        createPlayer('player1', 'Player 1'),
        createPlayer('player2', 'Player 2'),
    ],
    activePlayerId: 'player1',
    priorityPlayerId: 'player1',
    phase: 'main1',
    combatStep: undefined,
    turnCount: 1,
    stack: [],
    attackers: [],
    blockers: {},
    selectedCardId: null,
    combatStats: { damageDealt: 0, damageBlocked: 0, creaturesLost: 0 },
    lastCombatSummary: null,
    showSummary: false,
    log: ["Welcome to the Battle Simulator!", "Click 'New Battle' to start."],
    quizMode: true, // Always on
    showQuiz: false,
    pendingOutcome: null,
    autoBattle: true, // Always on
    autoBattleTimeout: null,
    showTurnBanner: null,
    winner: null,
    showShop: false,
    showTurnOrderModal: false,

    toggleAutoBattle: () => {
        const { autoBattle, nextPhase, performOpponentAttacks, activePlayerId, combatStep, autoBattleTimeout } = get();
        const isTurningOn = !autoBattle;

        if (autoBattleTimeout) clearTimeout(autoBattleTimeout);

        set({ autoBattle: isTurningOn, autoBattleTimeout: null });
        if (isTurningOn) {
            // If it's already AI turn to attack, trigger it
            if (activePlayerId === 'player2' && combatStep === 'declareAttackers') {
                performOpponentAttacks();
            }
            // Start the engine
            nextPhase();
        }
    },

    toggleQuizMode: () => set(state => ({ quizMode: !state.quizMode })),

    closeQuiz: () => set({ showQuiz: false, pendingOutcome: null }),
    cancelQuiz: () => set({ showQuiz: false, pendingOutcome: null, combatStep: 'declareBlockers' }),
    closeSummary: () => set({ showSummary: false, lastCombatSummary: null }),

    submitQuiz: (userPredictions, _userTrample) => {
        const { pendingOutcome, resolveCombat, addLog } = get();
        if (!pendingOutcome) return;

        const attackersCount = get().attackers.length;
        if (attackersCount === 0) {
            resolveCombat();
            set({ showQuiz: false, pendingOutcome: null });
            return;
        }

        // Check predictions
        let correctCount = 0;
        const totalChecked = Object.keys(userPredictions).length;

        // The actual results are in pendingOutcome.deaths
        // A card dies if it's in the deaths array.
        Object.entries(userPredictions).forEach(([cardId, prediction]) => {
            const isDead = pendingOutcome.deaths.includes(cardId);
            const actualOutcome = isDead ? 'Dies' : 'Survives';
            if (prediction === actualOutcome) {
                correctCount++;
            }
        });

        const incorrectCount = totalChecked - correctCount;
        const goldEarned = correctCount * 10;
        const opponentGoldEarned = incorrectCount * 10;

        addLog(`Quiz submitted! Result: ${correctCount}/${totalChecked} correct.`);
        if (goldEarned > 0) {
            addLog(`🪙 You earned ${goldEarned} gold!`);
        }
        if (opponentGoldEarned > 0) {
            addLog(`💰 Opponent earned ${opponentGoldEarned} gold from your mistakes!`);
        }

        // Update player gold and apply +1/+1 counters for incorrect answers
        set(state => {
            const newPlayers = state.players.map(p => {
                if (p.id === 'player1') {
                    return { ...p, gold: p.gold + goldEarned };
                }
                if (p.id === 'player2' && incorrectCount > 0) {
                    // Add +1/+1 counters to random opponent creatures
                    const availableCreatures = p.battlefield.filter(c => !pendingOutcome.deaths.includes(c.id));
                    if (availableCreatures.length > 0) {
                        const newBattlefield = [...p.battlefield];
                        for (let i = 0; i < incorrectCount; i++) {
                            const randomIndex = Math.floor(Math.random() * availableCreatures.length);
                            const randomCreature = availableCreatures[randomIndex];
                            const cardIndex = newBattlefield.findIndex(c => c.id === randomCreature.id);
                            if (cardIndex !== -1) {
                                newBattlefield[cardIndex] = {
                                    ...newBattlefield[cardIndex],
                                    plusOneCounters: newBattlefield[cardIndex].plusOneCounters + 1
                                };
                                addLog(`❌ ${randomCreature.name} gets a +1/+1 counter!`);
                            }
                        }
                        return { ...p, battlefield: newBattlefield, gold: p.gold + opponentGoldEarned };
                    }
                    return { ...p, gold: p.gold + opponentGoldEarned };
                }
                return p;
            });
            return { players: newPlayers };
        });

        // After quiz feedback (could be more elaborate, but starting with this)
        // We'll proceed to resolve.
        resolveCombat();
        set({ showQuiz: false, pendingOutcome: null });
    },

    addLog: (message: string) => {
        set(state => ({ log: [...state.log, message] }));
    },

    openTurnOrderModal: () => {
        set({ showTurnOrderModal: true });
    },

    startBattle: (startingPlayer: 'player1' | 'player2') => {
        set({ showTurnOrderModal: false });
        get().shuffleBoard();
        
        // Set the starting player
        set({ activePlayerId: startingPlayer });
        
        const { addLog, players } = get();
        const starter = players.find(p => p.id === startingPlayer);
        addLog(`${starter?.name} goes first!`);
    },

    shuffleBoard: () => {
        // Randomly determine how many creatures each player gets (1-5)
        const p1Count = Math.floor(Math.random() * 5) + 1;
        const p2Count = Math.floor(Math.random() * 5) + 1;

        // Pick cards
        const shuffledPool = [...CARD_POOL].sort(() => 0.5 - Math.random());
        const p1Cards = shuffledPool.slice(0, p1Count);
        const p2Cards = shuffledPool.slice(p1Count, p1Count + p2Count);

        set(state => {
            const newPlayers = state.players.map(p => {
                const isP1 = p.id === 'player1';
                const cards = isP1 ? p1Cards : p2Cards;

                const battlefield = cards.map((c, i) => ({
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
                }));

                return {
                    ...p,
                    life: INITIAL_LIFE,
                    hand: [],
                    graveyard: [],
                    exile: [],
                    battlefield
                };
            });

            return {
                players: newPlayers,
                phase: 'combat',
                combatStep: 'declareAttackers',
                turnCount: 1,
                attackers: [],
                blockers: {},
                activePlayerId: 'player1',
                winner: null,
                log: ["--- NEW BATTLE STARTED ---", `Player 1 spawns with ${p1Count} creatures.`, `Player 2 spawns with ${p2Count} creatures.`, "Combat Phase: Declare Attackers."]
            };
        });
    },

    performOpponentBlocks: () => {
        const { players, activePlayerId, attackers, addLog } = get();
        // Opponent is the one who is NOT active
        const defender = players.find(p => p.id !== activePlayerId);
        const attackerPlayer = players.find(p => p.id === activePlayerId);

        if (!defender || !attackerPlayer) return;
        if (attackers.length === 0) return;

        const newBlockers: Record<string, string[]> = {};
        const availableBlockers = defender.battlefield.filter(c => !c.tapped);
        const usedBlockers = new Set<string>();

        attackers.forEach(attackerId => {
            const attacker = attackerPlayer.battlefield.find(c => c.id === attackerId);
            if (!attacker) return;

            const attPower = parseInt(attacker.power || '0') + (attacker.plusOneCounters || 0);
            const attToughness = parseInt(attacker.toughness || '0') + (attacker.plusOneCounters || 0);

            // Find best blocker
            // Strategy: 1. Kill and Survive, 2. Kill and Trade, 3. Survive (Stall), 4. Last Resort
            const bestBlocker = availableBlockers.find(blocker => {
                if (usedBlockers.has(blocker.id)) return false;

                // Flying Logic
                const attFlying = attacker.keywords?.includes('Flying');
                const blkFlying = blocker.keywords?.includes('Flying');
                const blkReach = blocker.keywords?.includes('Reach');
                if (attFlying && !blkFlying && !blkReach) return false;

                const blkPower = parseInt(blocker.power || '0') + (blocker.plusOneCounters || 0);
                const blkToughness = parseInt(blocker.toughness || '0') + (blocker.plusOneCounters || 0);
                const isBlkDeathtouch = blocker.keywords?.includes('Deathtouch');
                const isAttDeathtouch = attacker.keywords?.includes('Deathtouch');

                const blockerKills = blkPower >= attToughness || (isBlkDeathtouch && blkPower > 0);
                const blockerSurvives = blkToughness > attPower && (attPower === 0 || !isAttDeathtouch);

                // Kill and Survive
                if (blockerKills && blockerSurvives) return true;

                // Survive (Stall)
                if (blockerSurvives) return true;

                // Kill and Trade
                if (blockerKills) return true;

                return false;
            });

            if (bestBlocker) {
                newBlockers[attackerId] = [bestBlocker.id];
                usedBlockers.add(bestBlocker.id);
                addLog(`${defender.name}'s ${bestBlocker.name} blocks ${attackerPlayer.name}'s ${attacker.name}.`);
            }
        });

        if (Object.keys(newBlockers).length > 0) {
            set({ blockers: newBlockers });
        } else {
            addLog(`${defender.name} declares no blocks.`);
        }
    },

    performOpponentAttacks: () => {
        const { players, activePlayerId } = get();
        const attacker = players.find(p => p.id === activePlayerId);
        if (!attacker || activePlayerId !== 'player2') return;

        // Simple AI: Just attack with everyone available
        const availableAttackers = attacker.battlefield.filter(c => !c.tapped);
        if (availableAttackers.length === 0) {
            return;
        }

        const attackerIds = availableAttackers.map(c => c.id);
        set({ attackers: attackerIds });
    },

    getCombatHints: () => {
        const { activePlayerId, players, combatStep, attackers, blockers } = get();
        const hints: string[] = [];

        const p1 = players.find(p => p.id === 'player1');
        const p2 = players.find(p => p.id === 'player2');
        if (!p1 || !p2) return [];

        const hasKeyword = (card: Card, kw: string) =>
            card.keywords?.some(k => k.toLowerCase() === kw.toLowerCase());

        if (activePlayerId === 'player1') {
            // Player's Turn Hints
            if (combatStep === 'declareAttackers') {
                const player = players.find(p => p.id === 'player1');
                const opponent = players.find(p => p.id === 'player2');
                if (!player || !opponent) return [];

                const myCreatures = player.battlefield.filter(c => !c.tapped);
                const oppCreatures = opponent.battlefield.filter(c => !c.tapped); // Potential blockers

                // Flying Hint
                const myFlyers = myCreatures.filter(c => hasKeyword(c, 'Flying'));
                if (myFlyers.length > 0) {
                    const oppPotentialFlyerBlockers = opponent.battlefield.filter(c => hasKeyword(c, 'Flying') || hasKeyword(c, 'Reach'));
                    const oppUntappedFlyerBlockers = oppPotentialFlyerBlockers.filter(c => !c.tapped);

                    if (oppPotentialFlyerBlockers.length === 0) {
                        hints.push("✨ Free Damage! Your Flying creatures are unblockable because the opponent has no Flying or Reach creatures.");
                    } else if (oppUntappedFlyerBlockers.length === 0) {
                        hints.push("✨ Tactical Opportunity! Your Flying creatures are unblockable right now because all of the opponent's Flying/Reach creatures are tapped.");
                    } else {
                        hints.push(`⚠️ Aerial Resistance: The opponent has ${oppUntappedFlyerBlockers.length} creature(s) that can block your flyers. Be prepared for a trade or a block.`);
                    }
                }

                // Vigilance Hint
                const myVigilance = myCreatures.filter(c => hasKeyword(c, 'Vigilance'));
                if (myVigilance.length > 0) {
                    hints.push("🛡️ Alert: Vigilance creatures will not tap when they attack, meaning they'll be ready to block on the opponent's turn!");
                }

                // Deathtouch Hint
                const myDeathtouch = myCreatures.filter(c => hasKeyword(c, 'Deathtouch'));
                if (myDeathtouch.length > 0 && oppCreatures.length > 0) {
                    hints.push("💀 Lethal Touch: Any amount of damage from a Deathtouch creature is lethal, meaning they'll destroy any blocker regardless of its defense!");
                }

                // Lifelink Hint
                const myLifelink = myCreatures.filter(c => hasKeyword(c, 'Lifelink'));
                if (myLifelink.length > 0) {
                    hints.push("❤️ Vitality: Lifelink creatures will heal you when they deal damage to a creature or a player.");
                }

                // Trample Hint
                const myTrample = myCreatures.filter(c => hasKeyword(c, 'Trample'));
                if (myTrample.length > 0) {
                    hints.push("🐘 Crushing Through: Trample damage will carry over to the opponent.");
                }

                // Power Disparity
                const strongCreatures = myCreatures.filter(c => {
                    const power = parseInt(c.power || '0');
                    const toughness = parseInt(c.toughness || '0');
                    return oppCreatures.every(opp => {
                        const oppToughness = parseInt(opp.toughness || '0');
                        const oppPower = parseInt(opp.power || '0');
                        return oppToughness <= power && oppPower < toughness && !hasKeyword(opp, 'Deathtouch');
                    });
                });

                if (strongCreatures.length > 0 && oppCreatures.length > 0) {
                    hints.push("⚔️ Advantage: You have creatures that can kill blockers and survive.");
                }

                if (myCreatures.length > 0 && oppCreatures.length === 0) {
                    hints.push("🔥 Open Board: Opponent has no blockers!");
                }
            }
        } else {
            // Opponent's Turn (Player is blocking)
            if (combatStep === 'declareBlockers') {
                hints.push("🛡️ Defend! Click an attacker, then your creature to block.");

                // Calculate incoming damage
                let totalIncoming = 0;
                attackers.forEach(id => {
                    const card = p2.battlefield.find(c => c.id === id);
                    if (card) totalIncoming += parseInt(card.power || '0');
                });

                let blockedSoFar = 0;
                Object.keys(blockers).forEach(attId => {
                    const attacker = p2.battlefield.find(c => c.id === attId);
                    if (!attacker) return;
                    const bIds = blockers[attId] || [];
                    if (bIds.length > 0) {
                        blockedSoFar += parseInt(attacker.power || '0');
                    }
                });

                const leaking = totalIncoming - blockedSoFar;
                if (leaking > 0) {
                    hints.push(`⚠️ WARNING: You are set to take ${leaking} damage this turn unless you block!`);
                }

                // Strategy Tip: Deathtouch
                const myDeathtouch = p1.battlefield.filter(c => !c.tapped && hasKeyword(c, 'Deathtouch'));
                if (myDeathtouch.length > 0) {
                    const strongAttackers = attackers.map(id => p2.battlefield.find(c => c.id === id))
                        .filter(c => c && parseInt(c.power || '0') >= 4);
                    if (strongAttackers.length > 0) {
                        hints.push("💡 Tip: Use your Deathtouch blockers to kill the highest damage attackers (4+ power).");
                    }
                }

                // Strategy Tip: Value Trades
                const myLowToughness = p1.battlefield.filter(c => !c.tapped && parseInt(c.toughness || '0') <= 2);
                if (myLowToughness.length > 0 && leaking > 10) {
                    hints.push("💡 Tip: Just because a character has low defense doesn't mean it's useless - sacrificing a small creature can save your life points.");
                }

                // Strategy Tip: First Strike Avoidance
                Object.keys(blockers).forEach(attId => {
                    const attacker = p2.battlefield.find(c => c.id === attId);
                    const bIds = blockers[attId] || [];
                    if (attacker && hasKeyword(attacker, 'First Strike') && bIds.length > 0) {
                        bIds.forEach(blkId => {
                            const blocker = p1.battlefield.find(c => c.id === blkId);
                            if (blocker && !hasKeyword(blocker, 'First Strike') && !hasKeyword(blocker, 'Double Strike')) {
                                const attPower = parseInt(attacker.power || '0') + (attacker.plusOneCounters || 0);
                                const blkToughness = parseInt(blocker.toughness || '0') + (blocker.plusOneCounters || 0);
                                if (attPower >= blkToughness) {
                                    const otherAttackers = attackers.find(id => {
                                        const other = p2.battlefield.find(c => c.id === id);
                                        return other && !hasKeyword(other, 'First Strike') && !blockers[id]?.length;
                                    });
                                    if (otherAttackers) {
                                        hints.push(`⚠️ Death Trap: ${blocker.name} will die to First Strike before it can hit ${attacker.name}. Consider blocking a different attacker to get more value.`);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }

        return hints;
    },

    calculateCombatOutcome: (): CombatOutcome => {
        const { activePlayerId, players, attackers, blockers } = get();
        const defenderPlayerId = players.find(p => p.id !== activePlayerId)?.id;
        if (!defenderPlayerId) return { damageEvents: [], deaths: [], deathDescriptions: [], attackerLifeGained: 0, defenderLifeGained: 0, explanation: [] };

        const attackerPlayer = players.find(p => p.id === activePlayerId)!;
        const defenderPlayer = players.find(p => p.id === defenderPlayerId)!;

        const damageEvents: DamageEvent[] = [];
        const damageOnCard: Record<string, number> = {};
        const hasDealtDamage = new Set<string>();
        let attackerLifeGained = 0;
        let defenderLifeGained = 0;
        const deathDescriptions: string[] = [];
        const deaths: string[] = [];
        const explanation: string[] = [];

        const allCombatants = [...attackerPlayer.battlefield, ...defenderPlayer.battlefield];
        const getCard = (id: string) => allCombatants.find(c => c.id === id);

        const hasKeyword = (card: Card, keyword: string) =>
            card.keywords?.some(k => k.toLowerCase() === keyword.toLowerCase());

        const getActualPower = (card: Card) => parseInt(card.power || '0') + (card.plusOneCounters || 0) - (card.minusOneCounters || 0);
        const getActualToughness = (card: Card) => parseInt(card.toughness || '0') + (card.plusOneCounters || 0) - (card.minusOneCounters || 0);

        const checkLethal = (cardId: string) => {
            const card = getCard(cardId);
            if (!card) return true;
            const dmg = damageOnCard[cardId] || 0;
            const tough = getActualToughness(card);
            if (dmg >= tough) return true;
            if (dmg > 0) {
                return damageEvents.some(e => e.targetId === cardId && e.isDeathtouch && e.damage > 0);
            }
            return false;
        };

        const resolveDamageStep = (isFirstStrikeStep: boolean) => {
            // Take a snapshot of who is dead BEFORE this step begins.
            // Damage dealt WITHIN this step is simultaneous.
            const deadAtStartOfStep = new Set<string>();
            allCombatants.forEach(c => {
                if (checkLethal(c.id)) deadAtStartOfStep.add(c.id);
            });

            // 1. Attackers Assign Damage
            attackers.forEach(attId => {
                const attacker = getCard(attId);
                // If attacker died in a PREVIOUS step, it cannot deal damage.
                if (!attacker || deadAtStartOfStep.has(attId)) return;

                const isFS = hasKeyword(attacker, 'First Strike');
                const isDS = hasKeyword(attacker, 'Double Strike');

                let attackerShouldDeal = false;
                if (isFirstStrikeStep) {
                    if (isFS || isDS) attackerShouldDeal = true;
                } else {
                    if (!hasDealtDamage.has(attId) || isDS) attackerShouldDeal = true;
                }

                if (!attackerShouldDeal) return;

                const bIds = blockers[attId] || [];
                const attPower = getActualPower(attacker);
                const isLifelink = hasKeyword(attacker, 'Lifelink');
                const isDeathtouch = hasKeyword(attacker, 'Deathtouch');
                const isTrample = hasKeyword(attacker, 'Trample');

                if (bIds.length === 0) {
                    // Unblocked
                    explanation.push(`${attacker.name} deals ${attPower} damage to defender (${isFirstStrikeStep ? 'First Strike' : 'Normal'} Step).`);
                    damageEvents.push({
                        sourceId: attId,
                        targetId: defenderPlayerId,
                        damage: attPower,
                        type: 'toPlayer',
                        isLifelink
                    });
                    if (isLifelink) attackerLifeGained += attPower;
                } else {
                    let powerToAssign = attPower;
                    bIds.forEach(blkId => {
                        const blocker = getCard(blkId);
                        // We use checkLethal (live) here because one attacker assigns damage 
                        // to its blockers in order, and needs to know if the first is "done".
                        if (!blocker || checkLethal(blkId)) return;

                        const tough = getActualToughness(blocker);
                        const alreadyTaken = damageOnCard[blkId] || 0;
                        const lethalNeeded = isDeathtouch ? 1 : Math.max(0, tough - alreadyTaken);
                        const assigned = isTrample ? Math.min(powerToAssign, lethalNeeded) : powerToAssign;

                        if (assigned > 0) {
                            explanation.push(`${attacker.name} deals ${assigned} damage to ${blocker.name} (${isFirstStrikeStep ? 'First Strike' : 'Normal'} Step).`);
                            damageEvents.push({
                                sourceId: attId,
                                targetId: blkId,
                                damage: assigned,
                                type: 'toCreature',
                                isLifelink,
                                isDeathtouch
                            });
                            damageOnCard[blkId] = (damageOnCard[blkId] || 0) + assigned;
                            if (isLifelink) attackerLifeGained += assigned;
                            powerToAssign -= assigned;
                        }
                    });

                    // Carry over Trample
                    if (isTrample && powerToAssign > 0) {
                        explanation.push(`${attacker.name} tramples for ${powerToAssign} damage to defender.`);
                        damageEvents.push({
                            sourceId: attId,
                            targetId: defenderPlayerId,
                            damage: powerToAssign,
                            type: 'toPlayer',
                            isLifelink
                        });
                        if (isLifelink) attackerLifeGained += powerToAssign;
                    }
                }
                hasDealtDamage.add(attId);
            });

            // 2. Blockers Assign Damage
            const blockerDamageResults: { targetId: string, damage: number, sourceId: string, isLifelink: boolean, isDeathtouch: boolean }[] = [];

            Object.entries(blockers).forEach(([attId, bIds]) => {
                bIds.forEach(blkId => {
                    const blocker = getCard(blkId);
                    const attacker = getCard(attId);
                    if (!blocker || !attacker) return;

                    // Blocker cannot deal damage if IT died in a previous step,
                    // OR if its ATTACKER died in a previous step.
                    if (deadAtStartOfStep.has(blkId)) {
                        if (!isFirstStrikeStep && !hasDealtDamage.has(blkId)) {
                            explanation.push(`${blocker.name} died in the First Strike step and cannot deal damage.`);
                        }
                        return;
                    }

                    if (deadAtStartOfStep.has(attId)) {
                        // Attacker is already dead, blocker has nothing to hit.
                        return;
                    }

                    const isFS = hasKeyword(blocker, 'First Strike');
                    const isDS = hasKeyword(blocker, 'Double Strike');

                    let blockerShouldDeal = false;
                    if (isFirstStrikeStep) {
                        if (isFS || isDS) blockerShouldDeal = true;
                    } else {
                        if (!hasDealtDamage.has(blkId) || isDS) blockerShouldDeal = true;
                    }

                    if (!blockerShouldDeal) return;

                    const blkPower = getActualPower(blocker);
                    const isLifelink = hasKeyword(blocker, 'Lifelink');
                    const isDeathtouch = hasKeyword(blocker, 'Deathtouch');

                    explanation.push(`${blocker.name} deals ${blkPower} damage to ${attacker.name} (${isFirstStrikeStep ? 'First Strike' : 'Normal'} Step).`);
                    blockerDamageResults.push({
                        sourceId: blkId,
                        targetId: attId,
                        damage: blkPower,
                        isLifelink,
                        isDeathtouch
                    });
                    hasDealtDamage.add(blkId);
                });
            });

            // Commit blocker damage AFTER the loop so it is truly simultaneous
            blockerDamageResults.forEach(res => {
                damageEvents.push({
                    sourceId: res.sourceId,
                    targetId: res.targetId,
                    damage: res.damage,
                    type: 'toCreature',
                    isLifelink: res.isLifelink,
                    isDeathtouch: res.isDeathtouch
                });
                damageOnCard[res.targetId] = (damageOnCard[res.targetId] || 0) + res.damage;
                if (res.isLifelink) defenderLifeGained += res.damage;
            });
        };

        // Step 1: First Strike Step
        resolveDamageStep(true);

        // Step 2: Normal Damage Step
        resolveDamageStep(false);

        // Finalize deaths
        allCombatants.forEach(card => {
            // Check for deathtouch from any event targeting this card
            const tookDeathtouch = damageEvents.some(e => e.targetId === card.id && e.isDeathtouch && e.damage > 0);
            const tough = getActualToughness(card);
            const dmg = damageOnCard[card.id] || 0;

            if (dmg >= tough || tookDeathtouch) {
                deaths.push(card.id);
            }
        });

        // Generate descriptions
        attackers.forEach(attId => {
            const att = getCard(attId);
            if (!att) return;
            const bIds = blockers[attId] || [];

            bIds.forEach(blkId => {
                const blk = getCard(blkId);
                if (!blk) return;

                const attDies = deaths.includes(attId);
                const blkDies = deaths.includes(blkId);

                if (attDies && blkDies) deathDescriptions.push(`${att.name} and ${blk.name} killed each other.`);
                else if (attDies) deathDescriptions.push(`${blk.name} killed ${att.name}.`);
                else if (blkDies) deathDescriptions.push(`${att.name} killed ${blk.name}.`);
            });
        });

        return { damageEvents, deaths, deathDescriptions, attackerLifeGained, defenderLifeGained, explanation };
    },

    resolveCombat: () => {
        const { combatStep, activePlayerId, players, addLog, quizMode, pendingOutcome, attackers, blockers } = get();

        // Safety: Only resolve combat during the combat damage step
        if (combatStep !== 'combatDamage') return;

        // If we are in quiz mode and don't have a confirmed outcome yet, 
        // calculate it and show quiz.
        if (quizMode && !get().pendingOutcome) {
            const outcome = get().calculateCombatOutcome();
            // If no attackers, don't show quiz, just resolve (it will do nothing)
            if (attackers.length === 0) {
                set({ showQuiz: false, pendingOutcome: null });
            } else {
                set({ pendingOutcome: outcome, showQuiz: true });
                return; // Stop here, wait for quiz submission
            }
        }

        // Use the outcome (either pre-calculated by quiz or fresh)
        const outcome = pendingOutcome || get().calculateCombatOutcome();
        const attackerPlayerId = activePlayerId;
        const defenderPlayerId = players.find(p => p.id !== activePlayerId)?.id!;

        addLog("Resolving Combat Damage...");

        // Calculate Turn Summary (Stats)
        let incomingDmg = 0;
        let blockedDmg = 0;

        const attackerProp = players.find(p => p.id === activePlayerId);
        attackers.forEach(id => {
            const card = attackerProp?.battlefield.find(c => c.id === id);
            if (card) {
                const pwr = parseInt(card.power || '0') + (card.plusOneCounters || 0);
                incomingDmg += pwr;
                if (blockers[id] && blockers[id].length > 0) {
                    blockedDmg += pwr; // Simplified: if blocked, we count the whole power as "contained" for the ratio
                }
            }
        });

        const reduction = incomingDmg > 0 ? Math.round((blockedDmg / incomingDmg) * 100) : 0;

        const defenderProp = players.find(p => p.id === defenderPlayerId);

        // Count deaths per player
        const p1 = players.find(p => p.id === 'player1');
        const p2 = players.find(p => p.id === 'player2');
        const p1Lost = p1?.battlefield.filter(c => outcome.deaths.includes(c.id)).length || 0;
        const p2Lost = p2?.battlefield.filter(c => outcome.deaths.includes(c.id)).length || 0;

        // Calculate gold earned from killing opponent creatures
        const goldPerKill = 25;
        const goldEarned = p2Lost * goldPerKill;
        const opponentGoldFromKills = p1Lost * goldPerKill;

        set({
            lastCombatSummary: {
                totalIncoming: incomingDmg,
                blockedDamage: blockedDmg,
                reductionPercent: reduction,
                lifeLost: outcome.damageEvents.filter(e => e.type === 'toPlayer' && e.targetId === defenderPlayerId).reduce((s, e) => s + e.damage, 0),
                defenderName: defenderProp?.name || 'Unknown',
                defenderId: defenderPlayerId,
                playerCreaturesLost: p1Lost,
                opponentCreaturesLost: p2Lost,
                killLog: outcome.deathDescriptions,
                goldEarned
            },
            showSummary: true
        });

        // Log gold earnings
        if (goldEarned > 0 && activePlayerId === 'player1') {
            addLog(`🪙 Earned ${goldEarned} gold from kills!`);
        }
        if (opponentGoldFromKills > 0 && activePlayerId === 'player2') {
            addLog(`💰 Opponent earned ${opponentGoldFromKills} gold from kills!`);
        }

        // Apply Damage Events and award gold in single state update
        set(state => {
            const newPlayers = state.players.map(p => {
                let newLife = p.life;
                let newGold = p.gold;
                
                if (p.id === attackerPlayerId) newLife += outcome.attackerLifeGained;
                if (p.id === defenderPlayerId) {
                    const totalToPlayer = outcome.damageEvents
                        .filter((e: DamageEvent) => e.targetId === defenderPlayerId)
                        .reduce((sum: number, e: DamageEvent) => sum + e.damage, 0);
                    newLife -= totalToPlayer;
                }

                // Award gold for kills
                if (p.id === 'player1' && goldEarned > 0 && activePlayerId === 'player1') {
                    newGold += goldEarned;
                }
                if (p.id === 'player2' && opponentGoldFromKills > 0 && activePlayerId === 'player2') {
                    newGold += opponentGoldFromKills;
                }

                const updatedBattlefield = p.battlefield.map(card => {
                    const damageTaken = outcome.damageEvents
                        .filter((e: DamageEvent) => e.targetId === card.id)
                        .reduce((sum: number, e: DamageEvent) => sum + e.damage, 0);
                    return { ...card, damageTaken: card.damageTaken + damageTaken };
                });

                return { ...p, life: newLife, gold: newGold, battlefield: updatedBattlefield };
            });

            // Process deaths - check for shield counters
            const finalPlayers = newPlayers.map(p => {
                const actualDeadCards: Card[] = [];
                const savedByShieldCards: Card[] = [];
                
                p.battlefield.forEach(c => {
                    if (outcome.deaths.includes(c.id)) {
                        // Creature would die - check for shield counter
                        if (c.shieldCounters > 0) {
                            // Shield counter saves it - remove one shield counter
                            savedByShieldCards.push({ ...c, shieldCounters: c.shieldCounters - 1 });
                            addLog(`🛡️ ${p.name}'s ${c.name} is saved by a shield counter!`);
                        } else {
                            // No shield counter - creature dies
                            actualDeadCards.push(c);
                            addLog(`${p.name}'s ${c.name} dies.`);
                        }
                    }
                });
                
                const survivingCards = p.battlefield.filter(c => !outcome.deaths.includes(c.id));
                
                return {
                    ...p,
                    battlefield: [...survivingCards, ...savedByShieldCards],
                    graveyard: [...p.graveyard, ...actualDeadCards]
                };
            });

            // CHECK FOR VICTORY - only if we have valid player data
            if (finalPlayers && finalPlayers.length >= 2) {
                const p1Wiped = finalPlayers[0]?.battlefield?.length === 0;
                const p2Wiped = finalPlayers[1]?.battlefield?.length === 0;
                const p1Dead = (finalPlayers[0]?.life || 0) <= 0;
                const p2Dead = (finalPlayers[1]?.life || 0) <= 0;

                if (p1Wiped || p2Wiped || p1Dead || p2Dead) {
                    const winnerId = (p1Wiped || p1Dead) ? 'player2' : 'player1';
                    setTimeout(() => {
                        set({
                            winner: winnerId,
                            autoBattle: false
                        });
                        if (p1Wiped || p2Wiped) {
                            const loser = p1Wiped ? finalPlayers[0] : finalPlayers[1];
                            addLog(`💀 ${loser?.name || 'Player'}'s army has been destroyed!`);
                        }
                        if (p1Dead || p2Dead) {
                            const loser = p1Dead ? finalPlayers[0] : finalPlayers[1];
                            addLog(`💀 ${loser?.name || 'Player'} has been defeated (Life: ${loser?.life || 0})!`);
                        }
                        addLog(`--- BATTLE CONCLUDED: ${winnerId === 'player1' ? 'VICTORY' : 'DEFEAT'} ---`);
                    }, 1000); // Small delay to let deaths animate
                }
            }

            return { players: finalPlayers, pendingOutcome: null };
        });

        // Log general results
        outcome.explanation.forEach((msg: string) => addLog(msg));
    },

    nextPhase: () => {
        const { phase, combatStep, activePlayerId, players, addLog, quizMode, autoBattle, autoBattleTimeout, showQuiz } = get();

        // Block manual phase shifts if quiz is active
        if (showQuiz) return;

        // Clear any pending auto-advances since we are moving manually or now.
        if (autoBattleTimeout) clearTimeout(autoBattleTimeout);
        set({ autoBattleTimeout: null });

        let nextPhase: Phase = phase;
        let nextCombatStep: CombatPhaseStep | undefined = undefined;
        let nextActivePlayerId = activePlayerId;
        let nextTurnCount = get().turnCount;

        if (phase === 'beginning') {
            nextPhase = 'main1';
            addLog(`Phase: Main 1`);
        }
        else if (phase === 'main1') {
            nextPhase = 'combat';
            nextCombatStep = 'begin';
            set({ combatStats: { damageDealt: 0, damageBlocked: 0, creaturesLost: 0 }, selectedCardId: null });
            addLog(`Phase: Combat (Beginning)`);
        }
        else if (phase === 'combat') {
            if (combatStep === 'begin') {
                nextCombatStep = 'declareAttackers';
                set({ selectedCardId: null });
                addLog(`Step: Declare Attackers`);
            }
            else if (combatStep === 'declareAttackers') {
                const attackersCount = get().attackers.length;
                const attackingPlayer = players.find(p => p.id === activePlayerId);

                if (attackersCount > 0) {
                    // Log attacks FIRST before announcing next step
                    if (attackingPlayer) {
                        get().attackers.forEach(attackerId => {
                            const card = attackingPlayer.battlefield.find(c => c.id === attackerId);
                            if (card) {
                                addLog(`${attackingPlayer.name}'s ${card.name} attacks!`);
                            }
                        });
                    }

                    nextCombatStep = 'declareBlockers';
                    addLog(`Step: Declare Blockers`);
                } else {
                    addLog(`No attackers declared. Skipping combat steps.`);
                    nextCombatStep = 'end';
                }

                set(state => {
                    const attackingPlayer = state.players.find(p => p.id === activePlayerId);
                    if (!attackingPlayer) return state;

                    const newPlayers = state.players.map(p => {
                        if (p.id !== activePlayerId) return p;
                        return {
                            ...p,
                            battlefield: p.battlefield.map(c => {
                                const isAttacking = state.attackers.includes(c.id);
                                const hasVigilance = c.keywords?.some(k => k.toLowerCase() === 'vigilance');

                                if (isAttacking && !hasVigilance && !c.tapped) {
                                    // Creature is attacking and doesn't have vigilance, so it taps.
                                    return { ...c, tapped: true };
                                }
                                return c;
                            })
                        };
                    });

                    return { players: newPlayers };
                });

                // Inform the user about tapping/vigilance if they have attackers
                if (attackersCount > 0) {
                    const attackingPlayer = players.find(p => p.id === activePlayerId);
                    get().attackers.forEach(id => {
                        const card = attackingPlayer?.battlefield.find(c => c.id === id);
                        if (card && card.keywords?.some(k => k.toLowerCase() === 'vigilance')) {
                            addLog(`${card.name} attacks without tapping (Vigilance).`);
                        }
                    });
                }

                // Only auto-block for the AI (Player 2)
                if (activePlayerId === 'player1' && attackersCount > 0) {
                    setTimeout(() => {
                        get().performOpponentBlocks();
                    }, 500);
                }
            }
            else if (combatStep === 'declareBlockers') {
                nextCombatStep = 'combatDamage';
                addLog(`Step: Combat Damage`);
                // Force state update immediately so resolveCombat sees the new combatStep
                set({ combatStep: 'combatDamage', selectedCardId: null });
                get().resolveCombat();
            }
            else if (combatStep === 'combatDamage') {
                nextCombatStep = 'end';
                addLog(`Step: End of Combat`);
            }
            else if (combatStep === 'end') {
                nextPhase = 'main2';
                nextCombatStep = undefined;
                // Important: clear attackers and blockers HERE
                set({ attackers: [], blockers: {}, pendingOutcome: null });
                addLog(`Phase: Main 2`);
            }
        }
        else if (phase === 'main2') {
            nextPhase = 'end';
            addLog(`Phase: End Step`);
        }
        else if (phase === 'end') {
            nextPhase = 'beginning';
            const currentIndex = players.findIndex(p => p.id === activePlayerId);
            nextActivePlayerId = players[(currentIndex + 1) % players.length].id;
            const nextPlayerName = players.find(p => p.id === nextActivePlayerId)?.name || 'Unknown';

            if (nextActivePlayerId === players[0].id) nextTurnCount++;

            addLog(`Turn ${nextTurnCount}: ${nextPlayerName}'s Turn`);
            addLog(`Phase: Beginning`);

            set({ showTurnBanner: nextPlayerName });
            setTimeout(() => set({ showTurnBanner: null }), 2000);

            // AI shop purchases at start of their turn
            if (nextActivePlayerId === 'player2') {
                setTimeout(() => {
                    get().performAIShopPurchases();
                }, 800);
            }

            set(state => ({
                players: state.players.map(p => ({
                    ...p,
                    battlefield: p.battlefield.map(c => ({
                        ...c,
                        // Only untap the incoming player's permanents
                        tapped: p.id === nextActivePlayerId ? false : c.tapped,
                        // ALL creatures have damage removed during cleanup step (MTG rule 514.2)
                        damageTaken: 0,
                        // Clear summoning sickness for active player's creatures
                        summoningSickness: p.id === nextActivePlayerId ? false : c.summoningSickness
                    }))
                }))
            }));
            addLog(`${nextPlayerName} untaps permanents.`);
        }

        set({
            phase: nextPhase,
            combatStep: nextCombatStep,
            activePlayerId: nextActivePlayerId,
            priorityPlayerId: nextActivePlayerId,
            turnCount: nextTurnCount,
            attackers: (nextPhase === 'combat' && (nextCombatStep === 'begin' || nextCombatStep === 'declareAttackers')) ? get().attackers : (nextCombatStep === undefined ? [] : get().attackers),
            blockers: (nextPhase === 'combat') ? get().blockers : (nextCombatStep === undefined ? {} : get().blockers)
        });

        // Ensure attackers and blockers are cleared at turn end
        if (phase === 'end') {
            set({ attackers: [], blockers: {} });
        }

        // Check for Game Over after any phase transition
        const p1 = players[0];
        const p2 = players[1];
        // User wants until creatures are dead
        const p1Wiped = p1.battlefield.length === 0;
        const p2Wiped = p2.battlefield.length === 0;

        if ((p1Wiped || p2Wiped) && (phase === 'combat' && combatStep === 'combatDamage')) {
            if (p1Wiped) addLog(`💀 ${p1.name}'s army has been destroyed!`);
            if (p2Wiped) addLog(`💀 ${p2.name}'s army has been destroyed!`);
        }

        if (autoBattle) {
            // PAUSE for Quiz Mode or if we are waiting for user blocks
            const isWaitingForQuiz = showQuiz || (quizMode && nextCombatStep === 'combatDamage');
            if (isWaitingForQuiz) return;

            if (p1Wiped || p2Wiped) {
                const winnerId = p1Wiped ? 'player2' : 'player1';
                set({
                    autoBattle: false,
                    autoBattleTimeout: null,
                    winner: winnerId
                });
                addLog(`--- BATTLE CONCLUDED: ${winnerId === 'player1' ? 'VICTORY' : 'DEFEAT'} ---`);
                return;
            }

            const timeoutId = setTimeout(() => {
                const currentStore = useGameStore.getState();
                if (currentStore.autoBattle) {
                    set({ autoBattleTimeout: null });
                    // 1. If we are moving TO AI's attack step, trigger attacks
                    if ((nextCombatStep as string) === 'declareAttackers' && nextActivePlayerId === 'player2') {
                        currentStore.performOpponentAttacks();
                        // Instead of moving immediately, we just update state with attackers.
                        // The NEXT loop (in 1.5s) will handle moving to next phase.
                        // This allows the user to see the red rings as "attacks declared".
                        return;
                    }

                    // 2. If we are moving TO blockers step, trigger auto-blocks ONLY for AI (Player 2)
                    if ((nextCombatStep as string) === 'declareBlockers' && nextActivePlayerId === 'player1') {
                        // Player 1 is active (attacking), so Player 2 (AI) needs to block.
                        currentStore.performOpponentBlocks();
                        return;
                    }

                    // If it's Player 1's turn to Attack, PAUSE auto-sim
                    if ((nextCombatStep as string) === 'declareAttackers' && nextActivePlayerId === 'player1') {
                        addLog("Waiting for Player 1 to declare attacks...");
                        return; // Stop auto-advancing
                    }

                    // If it's Player 1's turn to block (AI is attacking), we PAUSE the auto-sim
                    // so the human can practice blocking.
                    if ((nextCombatStep as string) === 'declareBlockers' && nextActivePlayerId === 'player2') {
                        addLog("Waiting for Player 1 to declare blocks...");
                        return; // Stop auto-advancing
                    }

                    currentStore.nextPhase();
                }
            }, 1500);

            set({ autoBattleTimeout: timeoutId });
        }
    },

    passPriority: () => {
        console.log("Priority passed");
    },

    drawCard: (_playerId: string) => { },

    playLand: (playerId: string, cardId: string) => {
        console.log(`Player ${playerId} played land ${cardId}`);
    },

    castSpell: (playerId: string, cardId: string) => {
        console.log(`Player ${playerId} cast spell ${cardId}`);
    },

    selectCard: (cardId: string | null) => {
        set({ selectedCardId: cardId });
    },

    declareAttacker: (cardId: string) => {
        const { phase, combatStep, activePlayerId, players, attackers, addLog } = get();
        if (phase !== 'combat' || combatStep !== 'declareAttackers') {
            addLog("You can only declare attackers during the Declare Attackers step.");
            return;
        }

        const player = players.find(p => p.id === activePlayerId);
        if (!player) return;

        const card = player.battlefield.find(c => c.id === cardId);
        if (!card) return;

        if (attackers.includes(cardId)) {
            set({ attackers: attackers.filter(id => id !== cardId) });
            return;
        }

        if (card.tapped) {
            addLog(`${card.name} is tapped and cannot attack.`);
            return;
        }

        if (card.summoningSickness && !card.keywords?.includes('Haste')) {
            addLog(`${card.name} has summoning sickness and cannot attack.`);
            return;
        }

        set({ attackers: [...attackers, cardId] });
    },

    declareBlocker: (attackerId: string, blockerId: string) => {
        const { phase, combatStep, players, activePlayerId, addLog } = get();
        if (phase !== 'combat' || combatStep !== 'declareBlockers') return;

        const attackerPlayer = players.find(p => p.id === activePlayerId);
        const defenderPlayer = players.find(p => p.id !== activePlayerId);
        const attackerCard = attackerPlayer?.battlefield.find(c => c.id === attackerId);
        const blockerCard = defenderPlayer?.battlefield.find(c => c.id === blockerId);

        if (!attackerCard || !blockerCard) return;

        if (blockerCard.tapped) {
            addLog(`${blockerCard.name} is tapped and cannot block.`);
            return;
        }

        const attFlying = attackerCard?.keywords?.includes('Flying');
        const blkFlying = blockerCard?.keywords?.includes('Flying');
        const blkReach = blockerCard?.keywords?.includes('Reach');
        if (attFlying && !blkFlying && !blkReach) {
            addLog(`${blockerCard?.name} cannot block ${attackerCard?.name} (Flying).`);
            return;
        }

        set(state => {
            // RULE: Is this blocker already blocking something?
            // "The moment a creature is assigned as a blocker: Lock it. Prevent further selection."
            const alreadyAssigned = Object.values(state.blockers).some(list => list.includes(blockerId));

            if (alreadyAssigned) {
                addLog(`${blockerCard.name} is already committed to a block and cannot be re-assigned.`);
                return state;
            }

            // RULE: One attacker -> many blockers is allowed (Multi-blocking)
            // One blocker -> one attacker is enforced by the 'alreadyAssigned' check above.

            const newBlockers = {
                ...state.blockers,
                [attackerId]: [...(state.blockers[attackerId] || []), blockerId]
            };

            addLog(`${blockerCard.name} blocks ${attackerCard.name}.`);

            return {
                blockers: newBlockers,
                selectedCardId: attackerId // Keep the attacker selected for multi-blocking
            };
        });
    },

    toggleShop: () => {
        set(state => ({ showShop: !state.showShop }));
    },

    purchaseUpgrade: (upgrade: string, cost: number) => {
        const { players, addLog } = get();
        const player = players.find(p => p.id === 'player1');
        
        if (!player || player.gold < cost) {
            addLog(`Not enough gold! Need ${cost}, have ${player?.gold || 0}.`);
            return;
        }

        set(state => {
            let updatedPlayers = [...state.players];
            
            if (upgrade === 'spawn_creature') {
                // Spawn a random creature for player1
                const randomCard = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
                const newCreature = {
                    ...randomCard,
                    id: `player1-creature-${Date.now()}-${Math.random()}`,
                    controllerId: 'player1',
                    ownerId: 'player1',
                    tapped: false,
                    damageTaken: 0,
                    plusOneCounters: 0,
                    minusOneCounters: 0,
                    summoningSickness: true,
                    shieldCounters: 0
                };
                
                updatedPlayers = state.players.map(p => {
                    if (p.id !== 'player1') return p;
                    return {
                        ...p,
                        battlefield: [...p.battlefield, newCreature]
                    };
                });
                
                addLog(`✨ Summoned ${newCreature.name} to your battlefield!`);
            } else if (upgrade === 'plus_counter' || upgrade === 'minus_counter') {
                const targetPlayer = upgrade === 'plus_counter' ? 'player1' : 'player2';
                const targetCreatures = state.players.find(pl => pl.id === targetPlayer)?.battlefield || [];
                
                if (targetCreatures.length > 0) {
                    const randomCreature = targetCreatures[Math.floor(Math.random() * targetCreatures.length)];
                    updatedPlayers = state.players.map(pl => {
                        if (pl.id !== targetPlayer) return pl;
                        
                        const updatedBattlefield = pl.battlefield.map(c => {
                            if (c.id === randomCreature.id) {
                                if (upgrade === 'plus_counter') {
                                    return { ...c, plusOneCounters: c.plusOneCounters + 1 };
                                } else {
                                    return { ...c, minusOneCounters: c.minusOneCounters + 1 };
                                }
                            }
                            return c;
                        }).filter(c => {
                            const baseToughness = parseInt(c.toughness || '0');
                            const netToughness = baseToughness + (c.plusOneCounters || 0) - (c.minusOneCounters || 0);
                            return netToughness > 0;
                        });
                        
                        return {
                            ...pl,
                            battlefield: updatedBattlefield
                        };
                    });
                    
                    const baseToughness = parseInt(randomCreature.toughness || '0');
                    const netToughness = baseToughness + (randomCreature.plusOneCounters || 0) - (randomCreature.minusOneCounters || 0) - (upgrade === 'minus_counter' ? 1 : 0);
                    
                    if (upgrade === 'minus_counter' && netToughness <= 0) {
                        addLog(`💀 -1/-1 counter applied to ${randomCreature.name} - creature dies!`);
                    } else {
                        addLog(`${upgrade === 'plus_counter' ? '🪙 +1/+1' : '💀 -1/-1'} counter applied to ${randomCreature.name}!`);
                    }
                }
            } else if (upgrade === 'life_gain') {
                updatedPlayers = state.players.map(p => 
                    p.id === 'player1' ? { ...p, life: p.life + 2 } : p
                );
                addLog(`💖 You gained 2 life!`);
            } else if (upgrade === 'gamble_spawn') {
                // Spawn a creature for opponent with summoning sickness
                const randomCard = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
                const newCreature = {
                    ...randomCard,
                    id: `player2-creature-${Date.now()}-${Math.random()}`,
                    controllerId: 'player2',
                    ownerId: 'player2',
                    tapped: false,
                    damageTaken: 0,
                    plusOneCounters: 0,
                    minusOneCounters: 0,
                    summoningSickness: true,
                    shieldCounters: 0
                };
                
                // Random gold between 0 and 200
                const goldEarned = Math.floor(Math.random() * 201);
                
                updatedPlayers = state.players.map(p => {
                    if (p.id === 'player2') {
                        return {
                            ...p,
                            battlefield: [...p.battlefield, newCreature]
                        };
                    } else if (p.id === 'player1') {
                        return {
                            ...p,
                            gold: p.gold + goldEarned
                        };
                    }
                    return p;
                });
                
                addLog(`🎲 GAMBLE! Spawned ${newCreature.name} for opponent - you earned ${goldEarned} gold!`);
                // No cost deduction since it's free, but we still return here to skip the final gold deduction
                return { players: updatedPlayers };
            } else if (upgrade === 'shield_counter') {
                const targetCreatures = state.players.find(pl => pl.id === 'player1')?.battlefield || [];
                
                if (targetCreatures.length > 0) {
                    const randomCreature = targetCreatures[Math.floor(Math.random() * targetCreatures.length)];
                    updatedPlayers = state.players.map(pl => {
                        if (pl.id !== 'player1') return pl;
                        return {
                            ...pl,
                            battlefield: pl.battlefield.map(c =>
                                c.id === randomCreature.id
                                    ? { ...c, shieldCounters: c.shieldCounters + 1 }
                                    : c
                            )
                        };
                    });
                    
                    addLog(`🛡️ Shield counter applied to ${randomCreature.name}!`);
                }
            } else {
                updatedPlayers = state.players.map(p => {
                    if (p.id !== 'player1') return p;
                    
                    const availableCreatures = p.battlefield.filter(c => !c.keywords.includes(upgrade));
                    if (availableCreatures.length > 0) {
                        const randomCreature = availableCreatures[Math.floor(Math.random() * availableCreatures.length)];
                        const newBattlefield = p.battlefield.map(c => {
                            if (c.id === randomCreature.id) {
                                return {
                                    ...c,
                                    keywords: [...c.keywords, upgrade]
                                };
                            }
                            return c;
                        });
                        
                        addLog(`✨ ${randomCreature.name} gains ${upgrade}!`);
                        return { ...p, battlefield: newBattlefield };
                    }
                    return p;
                });
            }

            // Deduct gold from player1
            const finalPlayers = updatedPlayers.map(p => 
                p.id === 'player1' ? { ...p, gold: p.gold - cost } : p
            );

            return { players: finalPlayers };
        });
    },

    performAIShopPurchases: () => {
        const { players, addLog } = get();
        const aiPlayer = players.find(p => p.id === 'player2');
        
        if (!aiPlayer || aiPlayer.gold < 24) return; // 24 is cheapest item

        // Define shop items with their costs and IDs
        const shopItems = [
            { id: 'plus_counter', cost: 24, category: 'quick', priority: 3 },
            { id: 'life_gain', cost: 32, category: 'quick', priority: 2 },
            { id: 'Flying', cost: 56, category: 'premium', priority: 5 },
            { id: 'Vigilance', cost: 52, category: 'premium', priority: 4 },
            { id: 'Trample', cost: 60, category: 'premium', priority: 5 },
            { id: 'Lifelink', cost: 60, category: 'premium', priority: 6 },
            { id: 'minus_counter', cost: 64, category: 'quick', priority: 7 },
            { id: 'Deathtouch', cost: 64, category: 'premium', priority: 6 },
            { id: 'First Strike', cost: 68, category: 'premium', priority: 5 },
            { id: 'Double Strike', cost: 72, category: 'premium', priority: 8 },
            { id: 'spawn_creature', cost: 80, category: 'quick', priority: 4 },
            { id: 'shield_counter', cost: 85, category: 'premium', priority: 7 }
        ];

        // Filter affordable items
        const affordable = shopItems.filter(item => item.cost <= aiPlayer.gold);
        if (affordable.length === 0) return;

        // AI strategy: Prefer higher priority items, but add some randomness
        const sorted = affordable.sort((a, b) => b.priority - a.priority);
        
        // 70% chance to pick top priority, 30% chance to pick any affordable
        const selectedItem = Math.random() < 0.7 
            ? sorted[0] 
            : affordable[Math.floor(Math.random() * affordable.length)];

        // Process the purchase for AI (player2)
        set(state => {
            let updatedPlayers = [...state.players];
            
            if (selectedItem.id === 'spawn_creature') {
                // Spawn a random creature for player2
                const randomCard = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
                const newCreature = {
                    ...randomCard,
                    id: `player2-creature-${Date.now()}-${Math.random()}`,
                    controllerId: 'player2',
                    ownerId: 'player2',
                    tapped: false,
                    damageTaken: 0,
                    plusOneCounters: 0,
                    minusOneCounters: 0,
                    summoningSickness: true,
                    shieldCounters: 0
                };
                
                updatedPlayers = state.players.map(p => {
                    if (p.id !== 'player2') return p;
                    return {
                        ...p,
                        battlefield: [...p.battlefield, newCreature]
                    };
                });
                
                addLog(`🤖 AI summoned ${newCreature.name}!`);
            } else if (selectedItem.id === 'plus_counter') {
                const targetCreatures = state.players.find(pl => pl.id === 'player2')?.battlefield || [];
                
                if (targetCreatures.length > 0) {
                    const randomCreature = targetCreatures[Math.floor(Math.random() * targetCreatures.length)];
                    updatedPlayers = state.players.map(pl => {
                        if (pl.id !== 'player2') return pl;
                        
                        const updatedBattlefield = pl.battlefield.map(c => {
                            if (c.id === randomCreature.id) {
                                return { ...c, plusOneCounters: c.plusOneCounters + 1 };
                            }
                            return c;
                        });
                        
                        return { ...pl, battlefield: updatedBattlefield };
                    });
                    
                    addLog(`🤖 AI granted +1/+1 counter to ${randomCreature.name}!`);
                }
            } else if (selectedItem.id === 'minus_counter') {
                const targetCreatures = state.players.find(pl => pl.id === 'player1')?.battlefield || [];
                
                if (targetCreatures.length > 0) {
                    const randomCreature = targetCreatures[Math.floor(Math.random() * targetCreatures.length)];
                    updatedPlayers = state.players.map(pl => {
                        if (pl.id !== 'player1') return pl;
                        
                        const updatedBattlefield = pl.battlefield.map(c => {
                            if (c.id === randomCreature.id) {
                                return { ...c, minusOneCounters: c.minusOneCounters + 1 };
                            }
                            return c;
                        }).filter(c => {
                            const baseToughness = parseInt(c.toughness || '0');
                            const netToughness = baseToughness + (c.plusOneCounters || 0) - (c.minusOneCounters || 0);
                            return netToughness > 0;
                        });
                        
                        return { ...pl, battlefield: updatedBattlefield };
                    });
                    
                    addLog(`🤖 AI placed -1/-1 counter on your ${randomCreature.name}!`);
                }
            } else if (selectedItem.id === 'life_gain') {
                updatedPlayers = state.players.map(p => {
                    if (p.id !== 'player2') return p;
                    return { ...p, life: p.life + 2 };
                });
                addLog(`🤖 AI gained 2 life!`);
            } else if (selectedItem.id === 'shield_counter') {
                const targetCreatures = state.players.find(pl => pl.id === 'player2')?.battlefield || [];
                
                if (targetCreatures.length > 0) {
                    const randomCreature = targetCreatures[Math.floor(Math.random() * targetCreatures.length)];
                    updatedPlayers = state.players.map(pl => {
                        if (pl.id !== 'player2') return pl;
                        
                        const updatedBattlefield = pl.battlefield.map(c => {
                            if (c.id === randomCreature.id) {
                                return { ...c, shieldCounters: c.shieldCounters + 1 };
                            }
                            return c;
                        });
                        
                        return { ...pl, battlefield: updatedBattlefield };
                    });
                    
                    addLog(`🤖 AI granted shield counter to ${randomCreature.name}!`);
                }
            } else if (['Flying', 'Trample', 'Deathtouch', 'First Strike', 'Lifelink', 'Vigilance', 'Double Strike'].includes(selectedItem.id)) {
                const targetCreatures = state.players.find(pl => pl.id === 'player2')?.battlefield || [];
                
                if (targetCreatures.length > 0) {
                    const eligibleCreatures = targetCreatures.filter(c => 
                        !c.keywords?.some(k => k.toLowerCase() === selectedItem.id.toLowerCase())
                    );
                    
                    if (eligibleCreatures.length > 0) {
                        const randomCreature = eligibleCreatures[Math.floor(Math.random() * eligibleCreatures.length)];
                        
                        updatedPlayers = state.players.map(p => {
                            if (p.id !== 'player2') return p;
                            
                            const newBattlefield = p.battlefield.map(c => {
                                if (c.id === randomCreature.id) {
                                    return {
                                        ...c,
                                        keywords: [...c.keywords, selectedItem.id]
                                    };
                                }
                                return c;
                            });
                            
                            return { ...p, battlefield: newBattlefield };
                        });
                        
                        addLog(`🤖 AI granted ${selectedItem.id} to ${randomCreature.name}!`);
                    }
                }
            }

            // Deduct gold from player2
            const finalPlayers = updatedPlayers.map(p => 
                p.id === 'player2' ? { ...p, gold: p.gold - selectedItem.cost } : p
            );

            return { players: finalPlayers };
        });
    }
}));
