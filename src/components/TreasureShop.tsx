import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Sparkles, Skull, Shield, Wind, Zap, Droplet } from 'lucide-react';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: React.ReactNode;
    category: 'small' | 'big';
}

const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'plus_counter',
        name: '+1/+1 Counter',
        description: 'Grant a random creature you control +1/+1',
        cost: 20,
        icon: <Sparkles className="text-emerald-400" />,
        category: 'small'
    },
    {
        id: 'minus_counter',
        name: '-1/-1 Counter',
        description: 'Give a random opponent creature -1/-1',
        cost: 25,
        icon: <Skull className="text-purple-400" />,
        category: 'small'
    },
    {
        id: 'Deathtouch',
        name: 'Deathtouch',
        description: 'Grant Deathtouch to a random creature you control',
        cost: 80,
        icon: <Droplet className="text-purple-600" />,
        category: 'big'
    },
    {
        id: 'Flying',
        name: 'Flying',
        description: 'Grant Flying to a random creature you control',
        cost: 70,
        icon: <Wind className="text-sky-500" />,
        category: 'big'
    },
    {
        id: 'Trample',
        name: 'Trample',
        description: 'Grant Trample to a random creature you control',
        cost: 75,
        icon: <Shield className="text-green-600" />,
        category: 'big'
    },
    {
        id: 'First Strike',
        name: 'First Strike',
        description: 'Grant First Strike to a random creature you control',
        cost: 85,
        icon: <Zap className="text-amber-400" />,
        category: 'big'
    }
];

export const TreasureShop = () => {
    const { showShop, toggleShop, players, purchaseUpgrade } = useGameStore();
    const player = players.find(p => p.id === 'player1');

    if (!showShop) return null;

    const handlePurchase = (item: ShopItem) => {
        purchaseUpgrade(item.id, item.cost);
    };

    const smallItems = SHOP_ITEMS.filter(item => item.category === 'small');
    const bigItems = SHOP_ITEMS.filter(item => item.category === 'big');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-gradient-to-b from-amber-950 to-slate-900 border-4 border-amber-600 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-700 to-amber-600 p-6 border-b-4 border-amber-500 flex justify-between items-center relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] opacity-20"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                                <span className="text-4xl">💰</span>
                                Treasure Shop
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <Coins className="text-yellow-300" size={20} />
                                <span className="text-yellow-200 font-bold text-lg">Your Gold: {player?.gold || 0}</span>
                            </div>
                        </div>
                        <button
                            onClick={toggleShop}
                            className="text-white hover:text-amber-200 transition-colors relative z-10"
                        >
                            <X size={32} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Small Upgrades */}
                        <div>
                            <h3 className="text-amber-400 font-black text-xl mb-3 uppercase tracking-wide">Quick Boosts</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {smallItems.map(item => (
                                    <ShopItemCard
                                        key={item.id}
                                        item={item}
                                        playerGold={player?.gold || 0}
                                        onPurchase={handlePurchase}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Big Upgrades */}
                        <div>
                            <h3 className="text-amber-400 font-black text-xl mb-3 uppercase tracking-wide flex items-center gap-2">
                                <Sparkles className="text-yellow-400" />
                                Premium Abilities
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {bigItems.map(item => (
                                    <ShopItemCard
                                        key={item.id}
                                        item={item}
                                        playerGold={player?.gold || 0}
                                        onPurchase={handlePurchase}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const ShopItemCard = ({ item, playerGold, onPurchase }: { item: ShopItem, playerGold: number, onPurchase: (item: ShopItem) => void }) => {
    const canAfford = playerGold >= item.cost;
    const isPremium = item.category === 'big';

    return (
        <motion.button
            whileHover={canAfford ? { scale: 1.05 } : {}}
            whileTap={canAfford ? { scale: 0.95 } : {}}
            onClick={() => canAfford && onPurchase(item)}
            disabled={!canAfford}
            className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${canAfford
                    ? isPremium
                        ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-900/50'
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 hover:border-slate-500 hover:shadow-lg'
                    : 'bg-slate-900/50 border-slate-700 opacity-50 cursor-not-allowed'
                }
            `}
        >
            {isPremium && canAfford && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Premium
                </div>
            )}
            
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isPremium ? 'bg-purple-950/50' : 'bg-slate-950/50'}`}>
                    {item.icon}
                </div>
                <div className="flex-1">
                    <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
                    <p className="text-slate-400 text-xs mb-2">{item.description}</p>
                    <div className="flex items-center gap-1">
                        <Coins className={canAfford ? 'text-yellow-500' : 'text-slate-600'} size={14} />
                        <span className={`font-bold text-sm ${canAfford ? 'text-yellow-400' : 'text-slate-500'}`}>
                            {item.cost}
                        </span>
                    </div>
                </div>
            </div>

            {!canAfford && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                    <span className="text-red-400 font-bold text-xs">Not Enough Gold</span>
                </div>
            )}
        </motion.button>
    );
};
