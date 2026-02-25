const fs = require('fs');
const path = require('path');

const gameStorePath = path.join(process.cwd(), 'src/store/gameStore.ts');
const bandingStorePath = path.join(process.cwd(), 'src/banding/bandingStore.ts');

try {
    let content = fs.readFileSync(gameStorePath, 'utf8');

    content = content.replace(/interface GameStore extends GameState/g, 'interface BandingStore extends GameState');
    content = content.replace(/useGameStore = create<GameStore>/g, 'useBandingStore = create<BandingStore>');

    content = content.replace(/import type \{ GameState, Player, Phase, CombatPhaseStep, Card, CombatOutcome, DamageEvent \} from '\.\.\/types';/g,
        "import type { GameState, Player, Phase, CombatPhaseStep, Card, CombatOutcome, DamageEvent } from '../types';\nimport { BANDING_CARD_POOL as CARD_POOL } from './bandingCards';\nimport { calculateBandingCombatOutcome } from './BandingLogic';");

    const cardPoolStart = content.indexOf('const CARD_POOL: Omit<Card');
    const commanderPoolStart = content.indexOf('const COMMANDER_POOL: Omit<Card');

    if (cardPoolStart !== -1 && commanderPoolStart !== -1) {
        content = content.slice(0, cardPoolStart) + content.slice(commanderPoolStart);
    }

    content = content.replace(/calculateCombatOutcome, /g, 'calculateBandingCombatOutcome, ');
    content = content.replace(/calculateCombatOutcome:/g, 'calculateBandingCombatOutcome:');
    content = content.replace(/const outcome = calculateCombatOutcome\(/g, 'const outcome = calculateBandingCombatOutcome(');
    content = content.replace(/calculateCombatOutcome: \(\) => CombatOutcome;/g, 'calculateBandingCombatOutcome: () => CombatOutcome;');
    content = content.replace(/useGameStore/g, 'useBandingStore');
    content = content.replace(/GameStore/g, 'BandingStore');

    content = content.replace(/attackers: \[\]\,/g, 'attackers: [],\nbands: [],\naddToBand: () => {},');

    // Replace the declareBlocker function to also include Banding logic for addToBand
    content = content.replace(/declareBlocker: \(attackerId: string, blockerId: string\) => \{/g, `
    bands: [], 
    addToBand: (cardId: string, targetCardId: string) => {
        const { bands, players, activePlayerId } = get();
        const player = players.find(p => p.id === activePlayerId);
        const card = player?.battlefield.find(c => c.id === cardId);
        const target = player?.battlefield.find(c => c.id === targetCardId);

        if (!card || !target) return;

        const hasBanding = (c: any) => c?.keywords?.includes('Banding');
        let bandIndex = bands.findIndex(b => b.includes(targetCardId));

        set((state: any) => {
            let newBands = [...state.bands];
            if (bandIndex === -1) {
                newBands.push([targetCardId, cardId]);
            } else {
                const currentBand = newBands[bandIndex];
                const nonBandingCount = currentBand.filter(id => !hasBanding(player?.battlefield.find(c => c.id === id))).length;

                if (!hasBanding(card) && nonBandingCount >= 1) {
                    get().addLog('A band can only have one creature without banding.');
                    return state;
                }

                newBands[bandIndex] = [...currentBand, cardId];
            }
            return { bands: newBands };
        });
    },
    declareBlocker: (attackerId: string, blockerId: string) => {`);

    content = content.replace(/blockers: Record<string, string\[\]>;/g, 'blockers: Record<string, string[]>;\n    bands: string[][];\n    addToBand: (cardId: string, targetCardId: string) => void;');

    // Add bands to resolve function
    content = content.replace(/const outcome = calculateBandingCombatOutcome\(\s*attackerCards,\s*blockerMap\s*\);/g, 'const { bands } = get();\n        const outcome = calculateBandingCombatOutcome(attackerCards, blockerMap, bands, activePlayerId);');

    fs.writeFileSync(bandingStorePath, content);
    console.log('Store adapted successfully.');
} catch (e) {
    console.error('Error:', e);
}
