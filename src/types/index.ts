export type Zone = 'library' | 'hand' | 'battlefield' | 'graveyard' | 'exile' | 'commandZone';
export type Phase = 'beginning' | 'main1' | 'combat' | 'main2' | 'end';
export type CombatPhaseStep = 'begin' | 'declareAttackers' | 'declareBlockers' | 'combatDamage' | 'end';

export interface Card {
    id: string; // Unique ID for this instance
    name: string;
    manaCost: string;
    typeLine: string;
    oracleText: string;
    power?: string; // String because of "*/*" or "1+*"
    toughness?: string;
    colors: string[];
    keywords: string[];
    imageUrl?: string;
    tapped: boolean;
    damageTaken: number;
    controllerId: string;
    ownerId: string;
    plusOneCounters: number;
    minusOneCounters: number;
    summoningSickness: boolean;
    shieldCounters: number;
}

export interface Player {
    id: string;
    name: string;
    life: number;
    commanderDamage: Record<string, number>; // Commander ID -> Damage dealt
    poisonCounters: number;
    library: Card[];
    hand: Card[];
    graveyard: Card[];
    exile: Card[];
    commandZone: Card[];
    battlefield: Card[]; // References to card IDs might be better, but holding objects for now simplifes
    gold: number;
}

export interface DamageEvent {
    sourceId: string;
    targetId: string; // card ID or player ID
    damage: number;
    type: 'toPlayer' | 'toCreature';
    isLifelink?: boolean;
    isTrample?: boolean;
    isDeathtouch?: boolean;
}

export interface CombatOutcome {
    damageEvents: DamageEvent[];
    deaths: string[]; // card IDs
    deathDescriptions: string[]; // "X killed Y" strings
    attackerLifeGained: number;
    defenderLifeGained: number;
    explanation: string[];
}

export interface GameState {
    players: Player[];
    activePlayerId: string;
    priorityPlayerId: string;
    phase: Phase;
    combatStep?: CombatPhaseStep;
    stack: any[];
    turnCount: number;

    lastCombatSummary: {
        totalIncoming: number;
        blockedDamage: number;
        reductionPercent: number;
        lifeLost: number;
        defenderName: string;
        defenderId: string;
        playerCreaturesLost: number;
        opponentCreaturesLost: number;
        killLog: string[];
        goldEarned: number;
    } | null;
    showSummary: boolean;

    attackers: string[];
    blockers: Record<string, string[]>;

    // Quiz State
    quizMode: boolean;
    showQuiz: boolean;
    pendingOutcome: CombatOutcome | null;

    // AI & Auto Logic
    autoBattle: boolean;
    autoBattleTimeout: any | null;
    showTurnBanner: string | null;
    selectedCardId: string | null;
    log: string[];
    winner: string | null;
    showStartPrompt: boolean;

    showShop: boolean;

    // Actions
    addLog: (message: string) => void;
    toggleQuizMode: () => void;
    submitQuiz: (userPredictions: Record<string, 'Survives' | 'Dies'>, userTrample?: Record<string, number>) => void;
    closeQuiz: () => void;
    cancelQuiz: () => void;
    performOpponentAttacks: () => void;
    getCombatHints: () => string[];
    shuffleBoard: () => void;
    startGame: (startingPlayerId: 'player1' | 'player2' | 'random') => void;
    toggleShop: () => void;
    purchaseUpgrade: (upgrade: string, cost: number) => void;
    performAIShopPurchases: () => void;

    // Actions
    nextPhase: () => void;
    selectCard: (cardId: string | null) => void;
    passPriority: () => void;
    drawCard: (playerId: string) => void;
    playLand: (playerId: string, cardId: string) => void;
    castSpell: (playerId: string, cardId: string) => void;
    declareAttacker: (cardId: string) => void;
    declareBlocker: (attackerId: string, blockerId: string) => void;
}
