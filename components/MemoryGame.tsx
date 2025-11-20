
import React, { useState, useEffect } from 'react';
import { Cpu, Disc, Database, Wifi, Lock, Unlock, AlertTriangle, Eye } from 'lucide-react';
import { playCyberSound } from '../utils/audio';

interface MemoryGameProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

const ICONS = [Cpu, Disc, Database, Wifi, Lock, AlertTriangle];
const ENTRY_FEE = 100;
const PRIZE_POOL = 300;

export const MemoryGame: React.FC<MemoryGameProps> = ({ credits, setCredits }) => {
  const [cards, setCards] = useState<{id: number, iconId: number, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [moves, setMoves] = useState(0);
  const [maxMoves] = useState(15); // Difficulty constraint

  // Initialize Game
  const startGame = () => {
    if (credits < ENTRY_FEE) return;
    
    playCyberSound('start');
    setCredits(prev => prev - ENTRY_FEE);
    
    // Create pairs
    const gameIcons = [...ICONS.slice(0, 6)]; // Use 6 icons (12 cards total)
    const deck = [...gameIcons, ...gameIcons]
        .map((icon, index) => ({ icon, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((item, index) => ({
            id: index,
            iconId: ICONS.indexOf(item.icon),
            isFlipped: false,
            isMatched: false
        }));

    setCards(deck);
    setGameState('playing');
    setMoves(0);
    setFlippedCards([]);
  };

  const handleCardClick = (id: number) => {
    if (gameState !== 'playing') return;
    if (flippedCards.length === 2) return; // Wait for check
    if (cards[id].isFlipped || cards[id].isMatched) return;

    playCyberSound('flip');

    // Flip card
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
        setMoves(prev => prev + 1);
        checkForMatch(newFlipped[0], newFlipped[1]);
    }
  };

  const checkForMatch = (id1: number, id2: number) => {
    const match = cards[id1].iconId === cards[id2].iconId;

    setTimeout(() => {
        setCards(prev => {
            const newCards = [...prev];
            if (match) {
                playCyberSound('match');
                newCards[id1].isMatched = true;
                newCards[id2].isMatched = true;
            } else {
                playCyberSound('error');
                newCards[id1].isFlipped = false;
                newCards[id2].isFlipped = false;
            }
            return newCards;
        });
        setFlippedCards([]);
    }, 800);
  };

  // Check Game Over / Win
  useEffect(() => {
    if (gameState !== 'playing') return;

    const allMatched = cards.every(c => c.isMatched);
    if (allMatched && cards.length > 0) {
        setGameState('won');
        setCredits(prev => prev + PRIZE_POOL);
        playCyberSound('win');
    } else if (moves >= maxMoves) {
        setGameState('lost');
        playCyberSound('lose');
    }
  }, [cards, moves, gameState, maxMoves, setCredits]);

  const IconComponent = ({ iconId, className }: { iconId: number, className?: string }) => {
    const Icon = ICONS[iconId];
    return <Icon className={className} size={32} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full bg-gray-900/80 p-4 border-b-2 border-neon-pink rounded-t-lg">
            <div className="flex items-center gap-2 text-neon-pink mb-2 md:mb-0">
                <Eye />
                <h2 className="font-orbitron text-xl tracking-wider">MEMORY_BREACH</h2>
            </div>
            <div className="flex items-center gap-6 font-rajdhani font-bold text-lg">
                <div className={`${moves >= maxMoves - 3 ? 'text-neon-red animate-pulse' : 'text-neon-blue'}`}>
                    ATTEMPTS: {moves}/{maxMoves}
                </div>
                <div className="text-neon-yellow">PRIZE: {PRIZE_POOL}</div>
            </div>
        </div>

        {gameState === 'idle' || gameState === 'won' || gameState === 'lost' ? (
             <div className="w-full h-96 bg-black/50 border border-gray-700 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                
                {gameState === 'won' && (
                    <div className="text-neon-green font-orbitron text-4xl font-bold animate-pulse mb-4 text-center">
                        SYSTEM BREACH SUCCESSFUL<br/>
                        <span className="text-xl mt-2 block">DATA EXTRACTED</span>
                    </div>
                )}
                
                {gameState === 'lost' && (
                    <div className="text-neon-red font-orbitron text-4xl font-bold mb-4 text-center">
                        CONNECTION TERMINATED<br/>
                        <span className="text-xl mt-2 block text-gray-400">FIREWALL DETECTED</span>
                    </div>
                )}

                <button 
                    onClick={startGame}
                    disabled={credits < ENTRY_FEE}
                    className={`
                        relative px-12 py-4 font-orbitron font-bold text-xl tracking-widest border-2 transition-all duration-300
                        ${credits < ENTRY_FEE 
                            ? 'border-gray-600 text-gray-600 cursor-not-allowed bg-gray-900' 
                            : 'border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black shadow-[0_0_30px_rgba(255,0,255,0.3)]'
                        }
                    `}
                >
                    {gameState === 'idle' ? 'INITIATE HACK' : 'RETRY BREACH'}
                    <div className="text-xs mt-1 opacity-70 font-mono block text-center">COST: {ENTRY_FEE}</div>
                </button>
             </div>
        ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
                {cards.map((card) => (
                    <div 
                        key={card.id} 
                        onClick={() => handleCardClick(card.id)}
                        className="relative h-28 md:h-32 cursor-pointer perspective-1000 group"
                    >
                        <div className={`w-full h-full relative transform-style-3d transition-transform duration-500 ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                            
                            {/* Front (Hidden) */}
                            <div className="absolute inset-0 w-full h-full backface-hidden bg-gray-900 border border-gray-700 flex flex-col items-center justify-center group-hover:border-neon-blue/50 transition-colors rounded-sm">
                                <Lock className="text-gray-600 mb-2" size={24} />
                                <span className="text-[10px] text-gray-600 font-mono tracking-widest">ENCRYPTED</span>
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-800"></div>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800"></div>
                            </div>

                            {/* Back (Revealed) */}
                            <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gray-800 border-2 ${card.isMatched ? 'border-neon-green shadow-[0_0_15px_#00ff9d]' : 'border-neon-pink'} flex flex-col items-center justify-center rounded-sm`}>
                                <IconComponent iconId={card.iconId} className={`${card.isMatched ? 'text-neon-green' : 'text-neon-pink'}`} />
                                <span className={`text-[10px] mt-2 font-mono tracking-widest ${card.isMatched ? 'text-neon-green' : 'text-neon-pink'}`}>
                                    {card.isMatched ? 'DECRYPTED' : 'ACCESSING'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
