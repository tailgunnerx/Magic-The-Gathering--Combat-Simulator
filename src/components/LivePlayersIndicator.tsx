import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { rtdb } from '../firebase';

export const LivePlayersIndicator = () => {
    const [livePlayers, setLivePlayers] = useState<number | null>(null);

    useEffect(() => {
        // Unique ID for this specific browser tab/session
        const sessionId = Math.random().toString(36).substring(2, 10);

        // References to the database
        const amOnlineRef = ref(rtdb, '.info/connected');
        const userPresenceRef = ref(rtdb, `presence/${sessionId}`);
        const allPresenceRef = ref(rtdb, 'presence');

        // 1. Listen for connection state changes
        const unsubConnected = onValue(amOnlineRef, (snapshot) => {
            if (snapshot.val() === true) {
                // When we connect, set up the disconnect behavior
                // (if we lose connection, remove our presence from the DB)
                onDisconnect(userPresenceRef).remove().then(() => {
                    // Then add our presence to the DB
                    set(userPresenceRef, {
                        online: true,
                        last_changed: serverTimestamp()
                    });
                });
            }
        });

        // 2. Listen for the total count of everyone currently in the 'presence' node
        const unsubPresence = onValue(allPresenceRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                let count = 0;
                for (const key in data) {
                    if (data[key] && data[key].online) {
                        count++;
                    }
                }
                setLivePlayers(count);
            } else {
                setLivePlayers(0);
            }
        });

        // Cleanup on unmount
        return () => {
            unsubConnected();
            unsubPresence();
            // Remove ourselves when we navigate away cleanly
            set(userPresenceRef, null);
        };
    }, []);

    // Don't show until we have a real count from Firebase
    if (livePlayers === null || livePlayers === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-full px-4 py-1.5 shadow-md shadow-black/20"
                title="Real-time Live Players via Firebase"
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
        </AnimatePresence>
    );
};
