import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const LivePlayersIndicator = () => {
    // We'll use a mocked number for now to simulate live players since Firebase RTDB needs to be 
    // manually enabled in the Firebase Console. We can make the number fluctuate naturally.
    const [livePlayers, setLivePlayers] = useState(1);

    useEffect(() => {
        // Mock a natural fluctuation of players:
        // Set an initial reasonable number
        const basePlayers = Math.floor(Math.random() * 15) + 5;
        setLivePlayers(basePlayers);

        // Fluctuate every few seconds
        const interval = setInterval(() => {
            setLivePlayers((prev) => {
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                return Math.max(1, prev + change);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-full px-4 py-1.5 shadow-md shadow-black/20"
            title="Live Players (Simulated)"
        >
            <div className="relative flex items-center justify-center w-3 h-3">
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-full h-full bg-green-500 rounded-full"
                />
                <div className="w-2 h-2 bg-green-500 rounded-full relative z-10" />
            </div>
            <Users size={14} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-200">
                {livePlayers} <span className="text-slate-400 font-normal">live</span>
            </span>
        </motion.div>
    );
};
