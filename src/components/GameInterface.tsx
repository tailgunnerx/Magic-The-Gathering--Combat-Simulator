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
import { StartBattleModal } from './StartBattleModal';
import { MechanicsGuide } from './MechanicsGuide';
import { CombatTimeline } from './CombatTimeline';
import { SkipCombatModal } from './SkipCombatModal';
import { PenaltyNotification } from './PenaltyNotification';
import { SettingsMenu } from './SettingsMenu';
import { Shuffle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export const GameInterface = () => {
    const {
        players,
        activePlayerId,
        phase,
        combatStep,
        shuffleBoard,
        quizMode,
        toggleQuizMode,
        toggleShop,
        showStartPrompt
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

                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Active Player</span>
                        <span className={`font-bold ${activePlayerId === player1.id ? "text-green-400" : "text-red-400"}`}>
                            {players.find(p => p.id === activePlayerId)?.name}
                        </span>
                    </div>
                </div >

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

                    <div className="h-8 w-px bg-slate-700 mx-2"></div>
                    <SettingsMenu />
                </div>
            </div >

            {/* Main Content Area (Sidebar + Game Board) */}
            < div className="flex-grow flex overflow-hidden relative" >

                {/* Sidebar: Combat Log */}
                < CombatLog />

                {/* Right Side: Game Board & Instructions */}
                < div className="flex-grow flex flex-col relative overflow-hidden" >

                    {/* Combat Wizard Layer - Floating Guide */}
                    < TurnBanner />
                    <CombatWizard />
                    <CombatQuizModal />
                    <CombatSummaryModal />
                    <TreasureShop />
                    <StartBattleModal />
                    <SkipCombatModal />
                    <PenaltyNotification />

                    {/* Main Game Plane */}
                    <div className="flex-grow flex flex-col relative overflow-hidden perspective-1000 bg-neutral-900">

                        {/* Opponent Zone (Reddish Tint Playmat) */}
                        <div className={`flex-1 flex flex-col relative border-b-2 border-slate-800/50 bg-[#1a1111] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] transition-all duration-500 ${activePlayerId === player2.id && !showStartPrompt ? 'ring-4 ring-inset ring-amber-500/40' : ''
                            }`}>
                            {/* Playmat Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none"></div>

                            {/* Turn Indicator Glow */}
                            {activePlayerId === player2.id && !showStartPrompt && (
                                <div className="absolute inset-0 border-4 border-amber-500/30 shadow-[inset_0_0_50px_rgba(245,158,11,0.1)] pointer-events-none z-0 animate-pulse"></div>
                            )}

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
                        <div className={`flex-1 flex flex-col relative bg-[#111827] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] transition-all duration-500 ${activePlayerId === player1.id && !showStartPrompt ? 'ring-4 ring-inset ring-amber-500/40' : ''
                            }`}>
                            {/* Playmat Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                            {/* Turn Indicator Glow */}
                            {activePlayerId === player1.id && !showStartPrompt && (
                                <div className="absolute inset-0 border-4 border-amber-500/30 shadow-[inset_0_0_50px_rgba(245,158,11,0.1)] pointer-events-none z-0 animate-pulse"></div>
                            )}

                            {/* Player Battlefield (Center-Bottom) */}
                            <div className="flex-grow flex items-start justify-center pt-8 p-4 z-10 w-full">
                                <Battlefield player={player1} />
                            </div>

                            <div className="absolute bottom-4 left-4 z-30 flex items-end gap-4">
                                <PlayerHUD player={player1} isActive={activePlayerId === player1.id} />
                                <MechanicsGuide />
                            </div>

                            {/* Combat Timeline Center Piece */}
                            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-20">
                                <CombatTimeline />
                            </div>

                            {/* Treasure Chest Button */}
                            <div className="absolute bottom-4 right-4 z-20">
                                <div className="relative">
                                    {/* Rotating Sunray Background Layer 1 */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'linear'
                                        }}
                                        className="absolute inset-0 -m-8"
                                        style={{
                                            background: 'conic-gradient(from 0deg, transparent 0%, rgba(251, 191, 36, 0.3) 10%, transparent 20%, transparent 30%, rgba(251, 191, 36, 0.3) 40%, transparent 50%, transparent 60%, rgba(251, 191, 36, 0.3) 70%, transparent 80%, transparent 90%, rgba(251, 191, 36, 0.3) 100%)',
                                            filter: 'blur(8px)'
                                        }}
                                    />

                                    {/* Rotating Sunray Background Layer 2 */}
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{
                                            duration: 12,
                                            repeat: Infinity,
                                            ease: 'linear'
                                        }}
                                        className="absolute inset-0 -m-12"
                                        style={{
                                            background: 'conic-gradient(from 45deg, transparent 0%, rgba(234, 179, 8, 0.4) 8%, transparent 16%, transparent 24%, rgba(234, 179, 8, 0.4) 32%, transparent 40%, transparent 48%, rgba(234, 179, 8, 0.4) 56%, transparent 64%, transparent 72%, rgba(234, 179, 8, 0.4) 80%, transparent 88%)',
                                            filter: 'blur(12px)'
                                        }}
                                    />

                                    {/* Pulsing Outer Glow */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                        className="absolute inset-0 -m-6 rounded-full"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)',
                                            filter: 'blur(20px)'
                                        }}
                                    />

                                    {/* Sparkle Effects */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                scale: [0, 1, 0],
                                                opacity: [0, 1, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                                ease: 'easeInOut'
                                            }}
                                            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                                            style={{
                                                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                                                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 50}%`,
                                                boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)'
                                            }}
                                        />
                                    ))}

                                    <motion.button
                                        onClick={toggleShop}
                                        animate={{
                                            boxShadow: [
                                                '0 0 30px rgba(217, 119, 6, 0.8), 0 0 60px rgba(251, 191, 36, 0.6), 0 0 90px rgba(234, 179, 8, 0.4)',
                                                '0 0 50px rgba(217, 119, 6, 1), 0 0 80px rgba(251, 191, 36, 0.8), 0 0 120px rgba(234, 179, 8, 0.6)',
                                                '0 0 30px rgba(217, 119, 6, 0.8), 0 0 60px rgba(251, 191, 36, 0.6), 0 0 90px rgba(234, 179, 8, 0.4)'
                                            ]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: 'loop'
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow: '0 0 60px rgba(217, 119, 6, 1), 0 0 100px rgba(251, 191, 36, 1), 0 0 150px rgba(234, 179, 8, 0.8)'
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 hover:from-yellow-300 hover:via-amber-400 hover:to-yellow-500 text-white font-black px-8 py-5 rounded-2xl shadow-2xl transition-all border-4 border-yellow-300 hover:border-yellow-200"
                                    >
                                        {/* Animated shine overlay */}
                                        <motion.div
                                            animate={{
                                                x: ['-200%', '200%']
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: 'linear'
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent overflow-hidden rounded-2xl"
                                            style={{ width: '50%' }}
                                        />

                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] opacity-20 rounded-xl"></div>

                                        {/* Inner glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-transparent to-amber-900/30 rounded-xl"></div>

                                        <div className="relative flex items-center gap-3">
                                            <motion.span
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 10, -10, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut'
                                                }}
                                                className="text-4xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                                            >
                                                💎
                                            </motion.span>
                                            <span className="text-2xl uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Shop</span>
                                        </div>
                                    </motion.button>

                                    {/* NEW Badge - Outside button */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            repeatType: 'loop'
                                        }}
                                        className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-700 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white z-10"
                                        style={{
                                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
                                        }}
                                    >
                                        NEW
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};
