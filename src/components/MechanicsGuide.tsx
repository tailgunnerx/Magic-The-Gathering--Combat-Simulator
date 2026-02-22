import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, X, Info, Zap, ShieldAlert, Swords, HeartPulse, Wind, Eye } from 'lucide-react';

interface Mechanic {
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    tip: string;
    counter: string;
}

const mechanics: Mechanic[] = [
    {
        name: 'Deathtouch',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-emerald-400',
        description: 'Any amount of damage this deals to a creature is enough to destroy it.',
        tip: 'From YOUR perspective: Even your smallest 1/1 can kill the AI\'s massive dragon. But watch out! If the AI has it, your big defenders are at high risk.',
        counter: 'Beat it with First Strike or Double Strike. Since Double Strike includes a First Strike phase, if your first hit is lethal, the Deathtouch creature dies before it can ever touch you!'
    },
    {
        name: 'First Strike',
        icon: <Swords className="w-5 h-5" />,
        color: 'text-orange-400',
        description: 'This creature deals combat damage before creatures without first strike.',
        tip: 'From YOUR perspective: If your power is high enough to kill their creature, yours survives without taking a scratch. It\'s like winning the duel before they can swing back.',
        counter: 'Beat it with Double Strike, higher power/toughness, or your own First Strike. If you survive the first hit, you can still kill them with your normal damage.'
    },
    {
        name: 'Trample',
        icon: <ShieldAlert className="w-5 h-5" />,
        color: 'text-red-400',
        description: 'Can deal excess damage to the defending player or planeswalker.',
        tip: 'From YOUR perspective: If you attack a 1/1 with a 5/5 Trample, the AI still takes 4 damage! When the AI attacks YOU with Trample, your blockers won\'t save your life points entirely.',
        counter: 'Beat it by blocking with a high-toughness creature. The higher the toughness, the less "excess" damage leaks through to your health.'
    },
    {
        name: 'Lifelink',
        icon: <HeartPulse className="w-5 h-5" />,
        color: 'text-pink-400',
        description: 'Damage dealt by this creature also causes you to gain that much life.',
        tip: 'From YOUR perspective: Every hit is a heal. It\'s your best way to recover if the AI has been chipping away at your health.',
        counter: 'Beat it by blocking with First Strike. If you kill the Lifelinker before it deals damage, the AI gains 0 life!'
    },
    {
        name: 'Haste',
        description: 'Creatures with haste can attack or tap as soon as they come under your control.',
        color: 'text-orange-400',
        icon: <Zap size={16} />,
        tip: 'Haste is great for catching opponents off-guard before they can set up blockers.',
        counter: 'Keep an eye on the opponent\'s gold. If they can summon a creature, they might attack with it immediately if it has Haste!'
    },
    {
        name: 'Flying',
        icon: <Wind className="w-5 h-5" />,
        color: 'text-blue-400',
        description: 'Can\'t be blocked except by creatures with flying or reach.',
        tip: 'From YOUR perspective: You can sail right over the AI\'s ground army. However, if the AI has fliers and you don\'t, you have no way to stop them from hitting you.',
        counter: 'Beat it by having your own Flyers or Reach creatures. Or, use your ground army to attack back harder and win the race!'
    },
    {
        name: 'Vigilance',
        icon: <Eye className="w-5 h-5" />,
        color: 'text-yellow-400',
        description: 'Attacking doesn\'t cause this creature to tap.',
        tip: 'From YOUR perspective: You get to have your cake and eat it too. You can attack the AI on your turn and still be standing ready to block on THEIR turn.',
        counter: 'Beat it with overwhelming force. Since they are always ready to block, you need creatures with better stats or keywords (like Flying) to get past them.'
    },
    {
        name: 'Double Strike',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-purple-400',
        description: 'Deals damage twice: once during the first-strike step and once normally.',
        tip: 'From YOUR perspective: Double Strike IS First Strike (for the first hit). If your first swing kills a Deathtouch creature, yours survives because the enemy never got to touch you!',
        counter: 'Beat it with extremely high toughness or your own First Strike/Double Strike. It is the most dangerous combat keyword, so treat it with respect!'
    },
    {
        name: 'Ward',
        icon: <Info className="w-5 h-5" />,
        color: 'text-cyan-400',
        description: 'Requires an extra cost to be targeted by spells or abilities.',
        tip: 'From YOUR perspective: In this simulator, creatures with Ward are harder for the AI to mess with, giving you more tactical stability.',
        counter: 'Beat it by being patient. You can still target them, it just costs more mana. Don\'t let it frustrate you into making bad plays.'
    }
];

export const MechanicsGuide = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-end">
            {/* The Book Icon Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-[75px] h-[75px] bg-gradient-to-br from-indigo-600 to-blue-800 rounded-2xl shadow-2xl border-2 border-indigo-400 flex items-center justify-center relative group overflow-hidden"
                style={{
                    boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)'
                }}
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Book className="w-10 h-10 text-indigo-100 drop-shadow-lg" />

                {/* Decorative Elements */}
                <div className="absolute bottom-1 right-2 text-[10px] font-black text-indigo-300 pointer-events-none">百科</div>
            </motion.button>

            {/* The Expanded List */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 10, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="w-[450px] h-[500px] bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-50 ml-4"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Book className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-none">Combat Encyclopedia</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Player's Battle Guide</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
                            {mechanics.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={m.name}
                                    className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 group hover:border-indigo-500/50 transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-xl bg-slate-900 border border-slate-700 ${m.color}`}>
                                            {m.icon}
                                        </div>
                                        <h4 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                                            {m.name}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                        {m.description}
                                    </p>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5">
                                                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                                                </div>
                                                <p className="text-xs text-indigo-200/90 italic font-medium">
                                                    <span className="font-bold uppercase text-[9px] text-indigo-400 block not-italic mb-1">Your Perspective</span>
                                                    {m.tip}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5">
                                                    <Swords className="w-3.5 h-3.5 text-rose-400" />
                                                </div>
                                                <p className="text-xs text-rose-200/90 italic font-medium">
                                                    <span className="font-bold uppercase text-[9px] text-rose-400 block not-italic mb-1">How To Beat This</span>
                                                    {m.counter}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-slate-950/50 text-center border-t border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Knowledge is Power</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
