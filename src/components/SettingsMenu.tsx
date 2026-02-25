import { useState } from 'react';
import { Settings, X, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGameStore } from '../store/gameStore';

export const SettingsMenu = () => {
    const { enableAdminMode } = useGameStore();
    const [isOpen, setIsOpen] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    // Initial update log
    const updates = [
        {
            date: new Date().toLocaleDateString(),
            version: '1.0.1',
            changes: [
                'Added Settings Menu with Gear Icon',
                'Added Updates Update Log to track progress',
                'Refined GameInterface layout to accommodate new settings',
            ]
        }
    ];

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check the password without mentioning it in commit
        // Convert to lower/upper or check directly
        if (adminPassword === "Creed") {
            enableAdminMode();
            setShowAdminLogin(false);
        } else {
            alert("Incorrect Authorization");
        }
        setAdminPassword('');
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                    title="Settings"
                >
                    <Settings size={20} className={isOpen ? "animate-spin-slow" : ""} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
                        >
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setShowUpdates(true);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-md transition-colors"
                                >
                                    <Info size={16} />
                                    Updates
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAdminLogin(true);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-md transition-colors mt-1"
                                >
                                    <ShieldAlert size={16} />
                                    Admin Mode
                                </button>
                                {/* Future settings options can go here */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Updates Modal */}
            <AnimatePresence>
                {showUpdates && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <Info className="text-blue-400" />
                                    Update Log
                                </h2>
                                <button
                                    onClick={() => setShowUpdates(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
                                {updates.map((update, idx) => (
                                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-blue-400">Version {update.version}</span>
                                            <span className="text-sm text-slate-400">{update.date}</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {update.changes.map((change, cIdx) => (
                                                <li key={cIdx} className="text-slate-300 text-sm flex items-start gap-2">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{change}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Admin Password Modal */}
            <AnimatePresence>
                {showAdminLogin && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-red-900/50 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.2)] w-full max-w-sm overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-red-950/30">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-red-400 tracking-widest uppercase">
                                    <ShieldAlert />
                                    Admin Access
                                </h2>
                                <button
                                    onClick={() => setShowAdminLogin(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAdminSubmit} className="p-6 flex flex-col gap-4">
                                <p className="text-slate-400 text-sm">Please enter the authorization phrase to access administrator privileges.</p>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Authorization Phrase..."
                                    className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors mt-2"
                                >
                                    Authenticate
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
