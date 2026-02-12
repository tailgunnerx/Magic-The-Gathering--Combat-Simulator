# ⚔️ Magic: The Gathering Combat Simulator

An interactive combat simulator for Magic: The Gathering built with React, TypeScript, and Vite. Master MTG combat mechanics through hands-on practice with quiz-based gameplay and a rewarding gold economy system.

![MTG Combat Simulator](https://img.shields.io/badge/Magic-Combat_Simulator-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite)

## 🎮 Features

### Core Combat System
- **Realistic MTG Combat**: Full implementation of Magic: The Gathering combat rules
- **AI Opponent**: Automated opponent with strategic decision-making
- **Interactive Gameplay**: Click-based creature selection for attacking and blocking
- **Turn-Based Flow**: Complete phase system (Beginning → Main 1 → Combat → Main 2 → End)

### Combat Mechanics
- **First Strike & Double Strike**: Damage dealt in separate combat steps
- **Deathtouch**: Any amount of damage is lethal
- **Trample**: Excess damage carries over to defending player
- **Flying & Reach**: Flying creatures can only be blocked by creatures with flying or reach
- **Lifelink**: Damage dealt also gains life
- **Vigilance**: Creatures don't tap when attacking
- **Haste**: Attack immediately without summoning sickness

### 🪙 Gold Economy System
Earn gold through gameplay and spend it in the treasure shop to gain powerful advantages!

**Ways to Earn Gold:**
- **+10 Gold** for each correct answer in combat quiz
- **+5 Gold** for each opponent creature you destroy

**Treasure Shop** (only available during your turn):

#### Quick Boosts
- **+1/+1 Counter** (24g) - Permanently boost a random creature's power and toughness
- **+2 Life** (32g) - Gain 2 life points
- **-1/-1 Counter** (64g) - Weaken opponent's creature (may kill it if toughness reaches 0)
- **Summon Creature** (80g) - Add a random creature to your battlefield

#### Premium Abilities
Grant powerful keywords to your creatures:
- **Vigilance** (52g) - Attack without tapping
- **Flying** (56g) - Can only be blocked by flying/reach creatures
- **Trample** (60g) - Excess damage carries over to opponent
- **Lifelink** (60g) - Gain life equal to damage dealt
- **Deathtouch** (64g) - Any damage is lethal
- **First Strike** (68g) - Deal damage before normal combat
- **Double Strike** (72g) - Deal damage in both first strike AND normal combat

### 📚 Combat Quiz Mode
**Always Active** - Learn by predicting combat outcomes!

Before damage is dealt, you'll be asked to predict whether each creature will survive or die. The simulator shows:
- All attacking and blocking assignments
- Creature stats with +1/+1 and -1/-1 counters displayed
- Keywords and abilities affecting combat
- Step-by-step explanation of damage resolution

**Correct predictions earn you 10 gold each!** ✨

### 🎲 Turn Order Selection
At the start of each battle, choose who goes first:
- **You Start** - Take the first turn
- **Opponent Starts** - Give your opponent the first turn  
- **Roll D20** - Let the dice decide with a cool animated roll (automatic re-roll on ties)

### 🃏 Diverse Creature Pool
30 unique creatures including:
- **Classic Creatures**: Serra Angel, Shivan Dragon, Craw Wurm
- **Zombies**: Gravecrawler, Diregraf Ghoul, Gray Merchant of Asphodel
- **Clerics**: Soul Warden, Grand Abolisher
- **Legendary Creatures**: Thalia, Aurelia the Warleader, Olivia Voldaren
- **Artifact Creatures**: Steel Overseer, Solemn Simulacrum
- And many more!

### 🎨 Beautiful UI
- **Animated Cards**: Smooth transitions and hover effects using Framer Motion
- **Casino-Style Shop**: Ultra-flashy treasure shop with rotating sunrays and pulsing effects
- **Visual Feedback**: Color-coded rings, damage indicators, and status effects
- **Gold Display**: Animated gold pouch showing your current treasure

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tailgunnerx/Magic-The-Gathering--Combat-Simulator.git

# Navigate to project directory
cd Magic-The-Gathering--Combat-Simulator

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🎯 How to Play

1. **Start a Battle**: Click "New Battle" to initialize the battlefield with random creatures
2. **Choose Turn Order**: Select who goes first or roll a D20
3. **Take Your Turn**: 
   - Navigate through phases using the "Next Phase" button
   - During combat, click creatures to declare attackers
   - Opponent AI automatically declares blockers
4. **Combat Quiz**: Predict which creatures will survive the combat
5. **Earn Gold**: Get gold for correct predictions and killing opponent creatures
6. **Visit Shop**: Click the glowing treasure chest to purchase upgrades (only during your turn)
7. **Win Condition**: Reduce opponent's life to 0 or below

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 7** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── Card.tsx       # Creature card display
│   ├── GameInterface.tsx   # Main game UI
│   ├── CombatQuizModal.tsx # Quiz overlay
│   ├── TreasureShop.tsx    # Gold shop system
│   └── TurnOrderModal.tsx  # Turn selection
├── store/
│   └── gameStore.ts   # Zustand state management
├── types/
│   └── index.ts       # TypeScript definitions
└── App.tsx            # Root component
```

## 🎓 Learning Resources

This simulator is perfect for:
- **New MTG Players**: Learn combat mechanics in a safe environment
- **Tournament Preparation**: Practice complex combat scenarios
- **Rules Mastery**: Understand interactions between keywords
- **Teaching Tool**: Help others learn MTG combat step-by-step

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is for educational purposes. Magic: The Gathering is © Wizards of the Coast.

## 🙏 Acknowledgments

- Card images from [Scryfall API](https://scryfall.com/)
- Inspired by the official Magic: The Gathering rules
- Built with love for the MTG community

---

**Enjoy the game and may your creatures always survive combat!** ⚔️✨
