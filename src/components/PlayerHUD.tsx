import type { Player } from '../types';
import { Heart, Skull, Shield, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerHUDProps {
    player: Player;
    isActive: boolean;
}

export const PlayerHUD = ({ player, isActive }: PlayerHUDProps) => {
    return (
        <div className={`p-4 rounded-lg border-2 transition-colors ${isActive ? 'border-yellow-500 bg-slate-800' : 'border-slate-700 bg-slate-900'}`}>
            <h2 className="text-xl font-bold text-white mb-2">{player.name}</h2>

            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-red-500">
                    <Heart size={24} fill="currentColor" />
                    <span className="text-2xl font-bold">{player.life}</span>
                </div>

                {player.poisonCounters > 0 && (
                    <div className="flex items-center gap-2 text-green-500">
                        <Skull size={20} />
                        <span className="text-xl">{player.poisonCounters}</span>
                    </div>
                )}

                {player.id === 'player1' && (
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            filter: ['drop-shadow(0 0 0px rgba(234, 179, 8, 0))', 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.8))', 'drop-shadow(0 0 0px rgba(234, 179, 8, 0))']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'loop'
                        }}
                        className="flex items-center gap-2 text-yellow-500"
                    >
                        <Coins size={24} fill="currentColor" />
                        <span className="text-2xl font-bold">{player.gold}</span>
                    </motion.div>
                )}

                <div className="flex items-center gap-2 text-blue-400">
                    <Shield size={20} />
                    <span className="text-sm">{player.library.length} cards</span>
                </div>
            </div>
        </div>
    );
};
