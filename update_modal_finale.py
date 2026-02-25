import os

file_path = r"c:\Users\CREED-gaming\Desktop\New folder\src\banding\components\BandingCombatQuizModal.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_content = """import { useState, useMemo, useEffect } from 'react';
import { useBandingStore } from '../bandingStore';
import type { Card } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, CheckCircle, XCircle, ChevronRight, Info, RotateCcw, Shield, Minus, Plus, ChevronUp, ChevronDown, Coins, Play } from 'lucide-react';
import { clsx } from 'clsx';

const KEYWORD_COLORS: Record<string, string> = {
    'Flying': 'bg-sky-500 text-white',
    'Trample': 'bg-green-600 text-white',
    'Deathtouch': 'bg-purple-600 text-white',
    'First Strike': 'bg-slate-100 text-black border border-slate-300',
    'Double Strike': 'bg-amber-400 text-black',
    'Vigilance': 'bg-slate-200 text-black',
    'Haste': 'bg-red-500 text-white',
    'Reach': 'bg-emerald-700 text-white',
    'Lifelink': 'bg-pink-500 text-white',
    'Protection': 'bg-indigo-500 text-white',
    'Banding': 'bg-amber-100 text-amber-900 border border-amber-300',
};

// --- ANIMATION COMPONENTS ---
const AnimatedSword = ({ isFirstStrike, delay = 0, onHit }: { isFirstStrike: boolean, delay?: number, onHit?: () => void }) => {
    return (
        <motion.div
            initial={{ x: -100, opacity: 0, scale: 0.5 }}
            animate={{ x: [ -100, 0, 100 ], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 0.6, delay, ease: "easeInOut" }}
            onAnimationComplete={() => onHit && onHit()}
            className={clsx("absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-50", isFirstStrike ? "text-amber-300" : "text-slate-300")}
        >
            <Sword size={32} className="rotate-90" fill="currentColor" />
        </motion.div>
    );
};

const FloatingDamage = ({ value, delay = 0 }: { value: number, delay?: number }) => {
    return (
        <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.5 }}
            animate={{ y: -50, opacity: [0, 1, 0], scale: [0.5, 1.5, 1] }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 font-black text-2xl z-50 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none"
            style={{ textShadow: "0 0 8px rgba(220, 38, 38, 0.8), 0 0 2px black" }}
        >
            -{value}
        </motion.div>
    );
};

export const BandingCombatQuizModal = () => {
    const {
        showQuiz,
        pendingOutcome,
        players,
        activePlayerId,
        attackers,
        blockers,
        bands,
        cancelQuiz,
        manualDamageAssignments,
        setManualDamage,
        reorderBlockers,
        submitQuiz
    } = useBandingStore();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [predictions, setPredictions] = useState<Record<string, 'Survives' | 'Dies'>>({});
    
    // Animation States
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationPhase, setSimulationPhase] = useState<'IDLE' | 'FIRST_STRIKE' | 'NORMAL'>('IDLE');
    const [simulationTrigger, setSimulationTrigger] = useState(0);

    const goldEarned = useMemo(() => {
        if (!isSubmitted || !pendingOutcome) return 0;
        let correctCount = 0;
        Object.entries(predictions).forEach(([cardId, prediction]) => {
            const isDead = pendingOutcome.deaths.includes(cardId);
            const actualOutcome = isDead ? 'Dies' : 'Survives';
            if (prediction === actualOutcome) {
                correctCount++;
            }
        });
        return (correctCount * 10);
    }, [isSubmitted, pendingOutcome, predictions]);

    const togglePrediction = (cardId: string, outcome: 'Survives' | 'Dies') => {
        if (isSubmitted || isSimulating) return;
        setPredictions(prev => ({ ...prev, [cardId]: outcome }));
    };

    const handleDamageChange = (sourceIds: string[], targetId: string, delta: number) => {
        if (isSubmitted || isSimulating) return;

        if (delta > 0) {
            const source = sourceIds[0];
            setManualDamage(source, targetId, (manualDamageAssignments[`${source}:${targetId}`] || 0) + 1);
        } else {
            const source = sourceIds.find(sId => (manualDamageAssignments[`${sId}:${targetId}`] || 0) > 0) || sourceIds[0];
            setManualDamage(source, targetId, Math.max(0, (manualDamageAssignments[`${source}:${targetId}`] || 0) - 1));
        }
    };

    // Group scenarios and generate Instance IDs
    const combatScenarios = useMemo(() => {
        const attackerGroups: { group: string[], bandNumber?: number }[] = [];
        const bandedAttackers = new Set<string>();

        bands.forEach((band, idx) => {
            const activeBandMembers = band.filter(id => attackers.includes(id));
            if (activeBandMembers.length > 0) {
                attackerGroups.push({ group: activeBandMembers, bandNumber: idx + 1 });
                activeBandMembers.forEach(id => bandedAttackers.add(id));
            }
        });

        attackers.forEach(id => {
            if (!bandedAttackers.has(id)) {
                attackerGroups.push({ group: [id] });
            }
        });

        const activeAttackerPlayer = players.find(p => p.id === activePlayerId);
        const activeDefenderPlayer = players.find(p => p.id !== activePlayerId);

        const internalGetCard = (id: string, prefix: string, counter: number) => {
            let card = activeAttackerPlayer?.battlefield.find(c => c.id === id);
            let owner = 'P1';
            let pLabel = prefix;
            if (!card) {
                card = activeDefenderPlayer?.battlefield.find(c => c.id === id);
                owner = 'P2';
                pLabel = 'B';
            }
            if (!card) return null;
            return { ...card, instanceId: `${pLabel}${counter}`, owner };
        };

        let aCounter = 1;
        let bCounter = 1;

        return attackerGroups.map(({ group, bandNumber }) => {
            const attackerCards = group.map(id => internalGetCard(id, 'A', aCounter++)).filter(Boolean) as (Card & {instanceId: string, owner: string})[];

            const blockerIds = new Set<string>();
            let hasBlockers = false;
            group.forEach(attId => {
                if (blockers[attId] && blockers[attId].length > 0) {
                    hasBlockers = true;
                    blockers[attId].forEach(bId => blockerIds.add(bId));
                }
            });

            const blockersList = Array.from(blockerIds).map(id => internalGetCard(id, 'B', bCounter++)).filter(Boolean) as (Card & {instanceId: string, owner: string})[];

            return {
                isBand: group.length > 1,
                bandNumber,
                attackers: attackerCards,
                blockers: blockersList,
                hasBlockers,
                originalAttackerIds: group,
                hasFirstStrike: [...attackerCards, ...blockersList].some(c => c.keywords?.includes('First Strike') || c.keywords?.includes('Double Strike'))
            };
        }).filter(scenario => scenario.attackers.length > 0);
    }, [attackers, blockers, bands, players, activePlayerId]);

    const runSimulation = () => {
        if (isSimulating || isSubmitted) return;
        setIsSimulating(true);
        setSimulationTrigger(prev => prev + 1);
        
        // Simple timeline orchestrator
        const hasFS = combatScenarios.some(s => s.hasFirstStrike);
        
        if (hasFS) {
            setSimulationPhase('FIRST_STRIKE');
            setTimeout(() => {
                setSimulationPhase('NORMAL');
                setTimeout(() => {
                    setSimulationPhase('IDLE');
                    setIsSimulating(false);
                }, 1500);
            }, 1500);
        } else {
            setSimulationPhase('NORMAL');
            setTimeout(() => {
                setSimulationPhase('IDLE');
                setIsSimulating(false);
            }, 1500);
        }
    };

    if (!showQuiz || !pendingOutcome) return null;

    const handleSubmit = () => setIsSubmitted(true);
    const handleContinue = () => {
        submitQuiz(predictions, {}, {});
        setIsSubmitted(false);
        setPredictions({});
    };

    // Sub-component for individual card in the Row 2 lane
    const EngagementCard = ({ card, scenario, isAttacker, bIdx = 0 }: { card: Card & {instanceId: string, owner: string}, scenario: any, isAttacker: boolean, bIdx?: number }) => {
        const isLethal = pendingOutcome?.deaths.includes(card.id);
        const power = parseInt(card.power || '0') + (card.plusOneCounters || 0) - (card.minusOneCounters || 0);
        const toughness = parseInt(card.toughness || '0') + (card.plusOneCounters || 0);
        
        // Derive incoming damage to display in the mini-counter
        const rawIncomingDamage = isAttacker 
            ? scenario.blockers.reduce((s: number, b: any) => s + parseInt(b.power || '0') + (b.plusOneCounters || 0) - (b.minusOneCounters || 0), 0)
            : scenario.attackers.reduce((sum: number, a: any) => sum + (manualDamageAssignments[`${a.id}:${card.id}`] || 0), 0);
            
        const bandedIncomingDamage = isAttacker && scenario.isBand 
            ? scenario.blockers.reduce((sum: number, b: any) => sum + (manualDamageAssignments[`${b.id}:${card.id}`] || 0), 0)
            : rawIncomingDamage;
            
        const currentDamage = isAttacker && scenario.isBand ? bandedIncomingDamage : rawIncomingDamage;

        // Relation Label
        const relationLabel = isAttacker 
            ? (scenario.blockers.length === 0 ? "Unblocked" : `Blocked by: ${scenario.blockers.map((b: any) => `${b.name} (#${b.instanceId})`).join(', ')}`)
            : (`Blocking: ${scenario.isBand ? 'BAND ' + scenario.bandNumber : scenario.attackers.map((a: any) => `${a.name} (#${a.instanceId})`).join(', ')}`);

        // Animation logic mapped to card hits
        const isHitInThisPhase = (simulationPhase === 'FIRST_STRIKE' && scenario.hasFirstStrike) || 
                                 (simulationPhase === 'NORMAL');

        return (
            <div className={clsx(
                "bg-slate-800/90 border border-slate-700/60 rounded-xl p-3 relative flex flex-col gap-2 shadow-lg transition-all",
                isLethal && isSubmitted && "border-red-500/50 bg-red-950/20"
            )}>
                {/* Instance Tag and Owner */}
                <div className="absolute -top-2 -left-2 z-10 flex gap-1">
                    <div className={clsx("text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm border", isAttacker ? "bg-red-600 border-red-400" : "bg-blue-600 border-blue-400")}>
                        {card.owner}
                    </div>
                    <div className="bg-slate-700 border border-slate-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                        #{card.instanceId}
                    </div>
                </div>

                {!isAttacker && !isSubmitted && scenario.blockers.length > 1 && (
                    <div className="absolute -top-3 right-2 flex bg-slate-800 border border-slate-600 rounded overflow-hidden z-20 shadow-md scale-90">
                        <button disabled={bIdx === 0} onClick={() => reorderBlockers(scenario.originalAttackerIds[0], card.id, 'up')} className="p-0.5 hover:bg-slate-600 disabled:opacity-30 text-slate-300">
                            <ChevronUp size={12} />
                        </button>
                        <button disabled={bIdx === scenario.blockers.length - 1} onClick={() => reorderBlockers(scenario.originalAttackerIds[0], card.id, 'down')} className="p-0.5 hover:bg-slate-600 disabled:opacity-30 text-slate-300 border-l border-slate-700">
                            <ChevronDown size={12} />
                        </button>
                        <div className="px-1.5 py-0.5 bg-slate-700 text-[9px] font-black text-white flex items-center justify-center border-l border-slate-600">
                            {bIdx + 1}{bIdx === 0 ? 'st' : bIdx === 1 ? 'nd' : bIdx === 2 ? 'rd' : 'th'}
                        </div>
                    </div>
                )}
                
                {/* Card Content Row */}
                <div className="flex gap-3 mt-1">
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden border border-slate-600 shadow-lg">
                            <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        {isSimulating && isHitInThisPhase && <FloatingDamage value={currentDamage > 0 ? currentDamage : 0} delay={0.6} />}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                            <div className={clsx("text-[10px] font-black px-1.5 py-0.5 rounded-l text-white border shadow-md", isAttacker ? "bg-red-600 border-red-800" : "bg-blue-600 border-blue-800")}>
                                {power}/{toughness}
                            </div>
                            <div className="bg-slate-900 border border-slate-700 text-red-400 text-[10px] font-black px-1.5 py-0.5 rounded-r shadow-inner flex items-center gap-0.5" title="Damage Taken">
                                <Minus size={8} className="text-red-500/50"/> {simulationPhase === 'IDLE' && simulationTrigger > 0 ? currentDamage : 0}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between pt-1">
                        <div>
                            <h3 className="font-bold text-white text-xs truncate drop-shadow-sm leading-tight">{card.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {card.keywords?.map(k => (
                                    <span key={k} className={clsx("text-[6px] px-1 rounded font-black uppercase tracking-wider", KEYWORD_COLORS[k] || 'bg-slate-700 text-white')}>
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-700/50 rounded px-1.5 py-0.5 text-[8px] font-medium text-slate-300 mt-2 truncate w-full">
                            {relationLabel}
                        </div>
                    </div>
                </div>

                {/* Embedded Controls Bottom Row */}
                <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-700/50">
                    <div className="flex flex-col gap-1">
                        <div className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1">
                            <Sword size={8} /> Deals {power} Dmg
                        </div>
                        {/* Quiz Toggle Embedded */}
                        <div className="flex bg-slate-950 rounded border border-slate-800 p-0.5 scale-90 origin-bottom-left">
                            <button
                                onClick={() => togglePrediction(card.id, 'Survives')}
                                className={clsx(
                                    "px-2 py-1 rounded-sm text-[9px] font-bold transition-all",
                                    predictions[card.id] === 'Survives' ? "bg-green-600 text-white" : "text-slate-500"
                                )}
                            >
                                Survives
                            </button>
                            <button
                                onClick={() => togglePrediction(card.id, 'Dies')}
                                className={clsx(
                                    "px-2 py-1 rounded-sm text-[9px] font-bold transition-all",
                                    predictions[card.id] === 'Dies' ? "bg-red-600 text-white" : "text-slate-500"
                                )}
                            >
                                Dies
                            </button>
                            {isSubmitted && (
                                <div className="px-2 py-1 flex items-center bg-slate-900 rounded-sm ml-1 border-l border-slate-800">
                                    {predictions[card.id] === (pendingOutcome?.deaths.includes(card.id) ? 'Dies' : 'Survives') 
                                        ? <CheckCircle size={10} className="text-green-500" /> 
                                        : <XCircle size={10} className="text-red-500" />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Banding Incoming Damage Control */}
                    {isAttacker && scenario.isBand && (
                        <div className="flex items-center gap-1 scale-90 origin-bottom-right bg-slate-950 p-1 rounded border border-slate-800">
                            <div className="text-[8px] font-black text-amber-500 mr-1 uppercase">Alloc:</div>
                            <button disabled={isSubmitted || currentDamage <= 0} onClick={() => handleDamageChange(scenario.blockers.map((b:any) => b.id), card.id, -1)} className="w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded font-black disabled:opacity-40">
                                <Minus size={10} strokeWidth={3} />
                            </button>
                            <div className="w-6 h-5 flex items-center justify-center font-black text-[10px] text-red-200">
                                {currentDamage}
                            </div>
                            <button disabled={isSubmitted} onClick={() => handleDamageChange(scenario.blockers.map((b:any) => b.id), card.id, 1)} className="w-5 h-5 flex items-center justify-center bg-emerald-600 text-white rounded font-black disabled:opacity-40">
                                <Plus size={10} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
            >
                {/* Header (Modal Level) */}
                <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Sword className="text-red-500" />
                            COMBAT SURVIVAL QUIZ
                        </h2>
                        <p className="text-slate-400 text-sm">Predict the outcomes of this combat damage step by observing engagement lines.</p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto bg-slate-900 p-6 space-y-12">
                    {combatScenarios.map((scenario, sIdx) => {
                        const bandTitle = scenario.isBand ? `BAND ${scenario.bandNumber}` : `ENCOUNTER ${sIdx + 1}`;
                        
                        return (
                            <div key={sIdx} className="bg-slate-800/10 rounded-2xl border border-slate-700/50 flex flex-col shadow-xl">
                                
                                {/* ROW 1: BAND HEADER + SIMULATION CONTROLS */}
                                <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700/50 rounded-t-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-transparent pointer-events-none" />
                                    
                                    <div className="flex flex-col gap-1 z-10 w-1/3">
                                        <div className="flex items-center text-amber-500 font-black text-sm tracking-widest gap-3">
                                            <Sword size={16} /> {bandTitle}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium leading-tight pt-1 border-t border-slate-800 block">
                                            <span className="text-slate-300 font-bold block">Combat damage is simultaneous unless First/Double Strike applies.</span>
                                            {scenario.isBand && (
                                                <span className="text-amber-500/80 block mt-0.5">Banding: You control how incoming combat damage is divided among your band.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center z-10 w-1/3">
                                        <div className="bg-slate-950/80 border border-slate-700/80 rounded-full px-4 py-1 text-[10px] font-black uppercase text-slate-300 flex items-center gap-3 shadow-inner">
                                            <span className="text-red-400">{scenario.attackers.length} Attackers</span>
                                            <span className="text-slate-600">VS</span>
                                            <span className="text-blue-400">{scenario.blockers.length} Blockers</span>
                                        </div>
                                        {(isSimulating || isSubmitted) ? (
                                            <div className="text-emerald-400 text-[10px] font-bold mt-2 uppercase tracking-widest animate-pulse">
                                                {isSimulating ? "Simulating Combat..." : "Damage Resolved"}
                                            </div>
                                        ) : (
                                            <div className="text-amber-500 text-[10px] font-bold mt-2 uppercase tracking-widest">
                                                Damage Step Pending
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end z-10 w-1/3">
                                        <button 
                                            onClick={runSimulation}
                                            disabled={isSimulating || isSubmitted}
                                            className="group relative overflow-hidden bg-gradient-to-b from-yellow-400 to-yellow-600 disabled:from-slate-700 disabled:to-slate-800 text-yellow-950 disabled:text-slate-500 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl font-black shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all flex flex-col items-center justify-center border border-yellow-300 disabled:border-slate-600"
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                <Play size={16} className="fill-current" /> SIMULATE
                                            </div>
                                            <div className="text-[8px] opacity-70 uppercase tracking-wider font-bold group-hover:opacity-100">
                                                Replay Animation
                                            </div>
                                            {!isSimulating && !isSubmitted && (
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* ROW 2: ENGAGEMENT STAGE (Battlefield Lane) */}
                                <div className="flex p-6 gap-6 relative bg-slate-950/40">
                                    {/* Left: Attackers (P1) */}
                                    <div className="w-80 flex flex-col gap-4 z-10">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-red-500 border-b border-red-900/30 pb-2 text-center w-full">
                                            ATTACKERS (P1)
                                        </div>
                                        {scenario.attackers.map((attacker) => (
                                            <EngagementCard key={attacker.id} card={attacker} scenario={scenario} isAttacker={true} />
                                        ))}
                                    </div>

                                    {/* Center: Engagement Field (SVG Lines & Animation Phase) */}
                                    <div className="flex-1 min-w-[150px] relative flex items-center justify-center z-0">
                                        {/* Dynamic Phase Indicator */}
                                        <AnimatePresence mode="wait">
                                            {simulationPhase !== 'IDLE' && (
                                                <motion.div 
                                                    key={simulationPhase}
                                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-6 py-2 rounded-full border bg-slate-950/80 backdrop-blur-md whitespace-nowrap shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                                                    style={{ 
                                                        borderColor: simulationPhase === 'FIRST_STRIKE' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                                                        boxShadow: simulationPhase === 'FIRST_STRIKE' ? '0 0 20px rgba(251, 191, 36, 0.2)' : '0 0 20px rgba(239, 68, 68, 0.2)'
                                                    }}
                                                >
                                                    <span className={clsx("font-black text-sm tracking-[0.2em] uppercase", simulationPhase === 'FIRST_STRIKE' ? 'text-amber-400' : 'text-red-500')}>
                                                        {simulationPhase === 'FIRST_STRIKE' ? 'FIRST STRIKE STEP' : 'COMBAT DAMAGE STEP'}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {scenario.blockers.length > 0 ? (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                {/* Represent generalized engagement visual */}
                                                <svg width="100%" height="100%" className="overflow-visible pointer-events-none stroke-slate-500">
                                                    <path d="M 0,50% L 100%,50%" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                                    <circle cx="50%" cy="50%" r="20" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                                    <path d="M calc(50% - 6px),calc(50% - 6px) L calc(50% + 6px),calc(50% + 6px)" strokeWidth="2" />
                                                    <path d="M calc(50% - 6px),calc(50% + 6px) L calc(50% + 6px),calc(50% - 6px)" strokeWidth="2" />
                                                </svg>

                                                {/* Floating Swords triggered by simulation phase */}
                                                {simulationPhase !== 'IDLE' && (
                                                    <div className="absolute inset-0 overflow-visible pointer-events-none">
                                                        {scenario.attackers.map((a, i) => (
                                                            <AnimatedSword key={`a-${i}-${simulationTrigger}`} isFirstStrike={simulationPhase==='FIRST_STRIKE'} delay={Math.random()*0.2} />
                                                        ))}
                                                        {scenario.blockers.map((b, i) => (
                                                            <AnimatedSword key={`b-${i}-${simulationTrigger}`} isFirstStrike={simulationPhase==='FIRST_STRIKE'} delay={Math.random()*0.2 + 0.1} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-slate-600/50 font-black text-2xl uppercase tracking-widest text-center rotate-[-15deg]">
                                                Unblocked
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Blockers (P2) */}
                                    <div className="w-80 flex flex-col gap-4 z-10">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 border-b border-blue-900/30 pb-2 text-center w-full">
                                            ASSIGNED BLOCKERS (P2)
                                        </div>
                                        {scenario.blockers.map((blocker, bIdx) => (
                                            <EngagementCard key={blocker.id} card={blocker} scenario={scenario} isAttacker={false} bIdx={bIdx} />
                                        ))}
                                    </div>
                                </div>

                                {/* ROW 3: RESULTS (Side-Separated Lists) */}
                                <div className="border-t border-slate-700/50 bg-slate-900/80 p-5 flex gap-6 rounded-b-2xl">
                                    {/* Left Results (P1) */}
                                    <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-inner">
                                        <div className="text-[10px] font-black tracking-[0.1em] uppercase text-red-400 mb-3 border-b border-red-900/30 pb-2">
                                            P1 Attacker Outcomes
                                        </div>
                                        <div className="space-y-2">
                                            {scenario.attackers.map(a => {
                                                const isDead = pendingOutcome?.deaths.includes(a.id);
                                                return (
                                                    <div key={a.id} className="flex justify-between items-center text-xs text-slate-300">
                                                        <span className="font-bold flex items-center gap-2">
                                                            <span className="bg-red-900/50 text-red-200 px-1 py-0.5 rounded text-[8px]">#{a.instanceId}</span>
                                                            {a.name}
                                                        </span>
                                                        {isSubmitted ? (
                                                            <span className={clsx("font-black uppercase tracking-wider", isDead ? "text-red-500" : "text-green-500")}>
                                                                {isDead ? 'Dies' : 'Survives'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-600 italic font-medium">Pending...</span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Right Results (P2) */}
                                    <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-inner">
                                        <div className="text-[10px] font-black tracking-[0.1em] uppercase text-blue-400 mb-3 border-b border-blue-900/30 pb-2">
                                            P2 Blocker Outcomes
                                        </div>
                                        <div className="space-y-2">
                                            {scenario.blockers.map(b => {
                                                const isDead = pendingOutcome?.deaths.includes(b.id);
                                                return (
                                                    <div key={b.id} className="flex justify-between items-center text-xs text-slate-300">
                                                        <span className="font-bold flex items-center gap-2">
                                                            <span className="bg-blue-900/50 text-blue-200 px-1 py-0.5 rounded text-[8px]">#{b.instanceId}</span>
                                                            {b.name}
                                                        </span>
                                                        {isSubmitted ? (
                                                            <span className={clsx("font-black uppercase tracking-wider", isDead ? "text-red-500" : "text-green-500")}>
                                                                {isDead ? 'Dies' : 'Survives'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-600 italic font-medium">Pending...</span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                            {scenario.blockers.length === 0 && (
                                                <div className="text-slate-500 italic text-xs">No blockers assigned.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
                    <div className="text-slate-500 text-sm italic">
                        Select 'Survives' or 'Dies' for every creature inside their cards.
                    </div>

                    {!isSubmitted ? (
                        <div className="flex gap-3">
                            <button
                                onClick={cancelQuiz}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-700"
                            >
                                <RotateCcw size={18} /> REVISE BLOCKS
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(predictions).length < combatScenarios.reduce((sum, s) => sum + s.attackers.length + s.blockers.length, 0) || isSimulating}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40"
                            >
                                SUBMIT PREDICTIONS <CheckCircle size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleContinue}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ring-4 ring-green-900/30"
                        >
                            CONTINUE SIMULATION <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Rewrite complete.")
