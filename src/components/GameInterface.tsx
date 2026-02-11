import { useGameStore } from '../store/gameStore';
import { PlayerHUD } from './PlayerHUD';
import { Battlefield } from './Battlefield';
import { CombatLog } from './CombatLog';
import { CombatWizard } from './CombatWizard';
import { CombatQuizModal } from './CombatQuizModal';
import { CombatSummaryModal } from './CombatSummaryModal';
import { TurnBanner } from './TurnBanner';
import { VictoryModal } from './VictoryModal';
import { TreasureShop } from './TreasureShop';
import { Shuffle, GraduationCap, Swords } from 'lucide-react';

export const GameInterface = () => {
    const {
        players,
        activePlayerId,
        phase,
        combatStep,
        shuffleBoard,
        quizMode,
        toggleQuizMode,
        autoBattle,
        toggleAutoBattle,
        toggleShop
    } = useGameStore();

    const player1 = players[0];
    const player2 = players[1];

    return (
        <div className="h-screen bg-neutral-950 text-white flex flex-col font-sans overflow-hidden">
            <VictoryModal />
            {/* Top Bar - Minimal */}
            <div className="bg-neutral-900 p-3 shadow-md flex justify-between items-center z-30 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={shuffleBoard}
                        className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md"
                    >
                        <Shuffle size={18} /> New Battle
                    </button>

                    <div className="h-8 w-px bg-slate-700 mx-2"></div>

                    <button
                        onClick={toggleQuizMode}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md border ${quizMode
                            ? "bg-blue-600 border-blue-400 text-white"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                            }`}
                        title={quizMode ? "Training Mode: ON" : "Training Mode: OFF"}
                    >
                        <GraduationCap size={18} />
                        {quizMode ? "Quiz Mode: ON" : "Quiz Mode: OFF"}
                    </button>

                    <div className="h-8 w-px bg-slate-700 mx-2"></div>

                    <button
                        onClick={toggleAutoBattle}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md border ${autoBattle
                            ? "bg-red-600 border-red-400 text-white animate-pulse"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                            }`}
                        title={autoBattle ? "AI ADVERSARY: LIVE" : "AI ADVERSARY: OFF"}
                    >
                        <Swords size={18} />
                        {autoBattle ? "AI ADVERSARY: ON" : "DUEL THE AI"}
                    </button>

                    <div className="h-8 w-px bg-slate-700 mx-2"></div>

                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Active Player</span>
                        <span className={`font-bold ${activePlayerId === player1.id ? "text-green-400" : "text-red-400"}`}>
                            {players.find(p => p.id === activePlayerId)?.name}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Phase</span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-200 capitalize">{phase}</span>
                            {combatStep && (
                                <>
                                    <span className="text-slate-600">/</span>
                                    <span className="text-lg font-bold text-red-400 capitalize">{combatStep.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Sidebar + Game Board) */}
            <div className="flex-grow flex overflow-hidden relative">

                {/* Sidebar: Combat Log */}
                <CombatLog />

                {/* Right Side: Game Board & Instructions */}
                <div className="flex-grow flex flex-col relative overflow-hidden">

                    {/* Combat Wizard Layer - Floating Guide */}
                    <TurnBanner />
                    <CombatWizard />
                    <CombatQuizModal />
                    <CombatSummaryModal />
                    <TreasureShop />

                    {/* Main Game Plane */}
                    <div className="flex-grow flex flex-col relative overflow-hidden perspective-1000 bg-neutral-900">

                        {/* Opponent Zone (Reddish Tint Playmat) */}
                        <div className="flex-1 flex flex-col relative border-b-2 border-slate-800/50 bg-[#1a1111] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
                            {/* Playmat Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none"></div>

                            {/* Opponent HUD */}
                            <div className="absolute top-4 right-4 z-20">
                                <PlayerHUD player={player2} isActive={activePlayerId === player2.id} />
                            </div>

                            {/* Opponent Battlefield (Center-Top) */}
                            <div className="flex-grow flex items-end justify-center pb-8 p-4 z-10 w-full">
                                <Battlefield player={player2} />
                            </div>
                        </div>

                        {/* Player Zone (Blueish Tint Playmat) */}
                        <div className="flex-1 flex flex-col relative bg-[#0f172a] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]">
                            {/* Playmat Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                            {/* Player Battlefield (Center-Bottom) */}
                            <div className="flex-grow flex items-start justify-center pt-8 p-4 z-10 w-full">
                                <Battlefield player={player1} />
                            </div>

                            <div className="absolute bottom-4 left-4 z-20">
                                <PlayerHUD player={player1} isActive={activePlayerId === player1.id} />
                            </div>

                            {/* Treasure Chest Button */}
                            <div className="absolute bottom-4 right-4 z-20">
                                <button
                                    onClick={toggleShop}
                                    className="group relative bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-black px-6 py-4 rounded-2xl shadow-2xl transition-all active:scale-95 border-4 border-amber-400 hover:border-amber-300"
                                >
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] opacity-30 rounded-xl"></div>
                                    <div className="relative flex items-center gap-2">
                                        <span className="text-3xl">💎</span>
                                        <span className="text-xl uppercase tracking-tight">Shop</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                        NEW
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
