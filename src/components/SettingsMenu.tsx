import { useState } from 'react';
import { Settings, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUpdates, setShowUpdates] = useState(false);

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
        </>
    );
};
