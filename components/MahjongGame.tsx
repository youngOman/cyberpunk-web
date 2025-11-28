
import React, { useState, useEffect, useRef } from 'react';
import { Play, Cpu, Disc, Shield, Skull } from 'lucide-react';
import { playCyberSound } from '../utils/audio';

interface MahjongGameProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  visible?: boolean;
}

// --- Constants & Types ---
const RIICHI_COST = 1000;
const BASE_REWARD = 2000;

const TILES = {
  man: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'], // Characters
  pin: ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'], // Circles
  sou: ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'], // Bamboo
  honor: ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆'], // Winds & Dragons
};

const ALL_TILES_ORDER = [...TILES.man, ...TILES.pin, ...TILES.sou, ...TILES.honor];

// Helper to check tile color/style for better visibility
// NEON STYLE: Override characters with specific colors
const getTileColorClass = (tile: string) => {
  if (TILES.man.includes(tile)) return "text-neon-pink drop-shadow-[0_0_5px_#ff00ff]";
  if (TILES.sou.includes(tile)) return "text-neon-green drop-shadow-[0_0_5px_#00ff9d]";
  if (TILES.pin.includes(tile)) return "text-neon-blue drop-shadow-[0_0_5px_#00f3ff]";
  if (tile === '🀄') return "text-neon-red drop-shadow-[0_0_5px_#ff3333]"; // Red Dragon
  if (tile === '🀅') return "text-neon-green drop-shadow-[0_0_5px_#00ff9d]"; // Green Dragon
  return "text-white drop-shadow-[0_0_5px_white]"; // White Dragon / Winds
};

const sortHand = (hand: string[]) => {
  return [...hand].sort((a, b) => ALL_TILES_ORDER.indexOf(a) - ALL_TILES_ORDER.indexOf(b));
};

type PlayerPosition = 'bottom' | 'right' | 'top' | 'left';

export const MahjongGame: React.FC<MahjongGameProps> = ({ credits, setCredits, visible = true }) => {
  // --- Game State ---
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [turn, setTurn] = useState<PlayerPosition>('bottom');
  
  // Player State
  const [hand, setHand] = useState<string[]>([]);
  const [drawnTile, setDrawnTile] = useState<string | null>(null);
  const [isRiichi, setIsRiichi] = useState(false);
  const [winningTiles, setWinningTiles] = useState<string[]>([]);
  
  // Actions
  const [canRon, setCanRon] = useState(false);
  const [canTsumo, setCanTsumo] = useState(false);
  const [canRiichi, setCanRiichi] = useState(false);
  const [statusMessage, setStatusMessage] = useState("SYSTEM READY");

  // Opponents & River
  const [river, setRiver] = useState<{tile: string, player: PlayerPosition, isRecent: boolean}[]>([]);
  const [ronSource, setRonSource] = useState<PlayerPosition | null>(null); 
  const [lastDiscard, setLastDiscard] = useState<string | null>(null);

  // Refs
  const ronTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // --- Initialization ---

  // Helper to generate random sets
  const getRandomSet = () => {
    const type = Math.random();
    if (type < 0.7) {
        // Sequence
        const suit = ['man', 'pin', 'sou'][Math.floor(Math.random() * 3)] as 'man'|'pin'|'sou';
        const start = Math.floor(Math.random() * 7); // 0 to 6
        return [TILES[suit][start], TILES[suit][start+1], TILES[suit][start+2]];
    } else {
        // Triplet
        const suitKeys = Object.keys(TILES) as Array<keyof typeof TILES>;
        const suit = suitKeys[Math.floor(Math.random() * suitKeys.length)];
        const tile = TILES[suit][Math.floor(Math.random() * TILES[suit].length)];
        return [tile, tile, tile];
    }
  };

  const getRandomWait = () => {
    const suit = ['man', 'pin', 'sou'][Math.floor(Math.random() * 3)] as 'man'|'pin'|'sou';
    // Values 1-8 (Indices 0-7). 
    // We form a sequence using idx and idx+1.
    const idx = Math.floor(Math.random() * 7); 
    
    const t1 = TILES[suit][idx];
    const t2 = TILES[suit][idx+1];
    
    const waits: string[] = [];
    // Left side wait (if idx > 0) -> idx-1
    if (idx > 0) waits.push(TILES[suit][idx-1]);
    // Right side wait (if idx < 8) -> idx+2
    // But wait... 
    // If idx=0 (1,2), wait is 3 (idx=2).
    // If idx=7 (8,9), wait is 7 (idx=6).
    // If idx=1 (2,3), wait is 1,4.
    
    if (idx + 2 < 9) waits.push(TILES[suit][idx+2]);
    
    return { tiles: [t1, t2], wait: waits };
  };

  const initGame = () => {
    if (credits < RIICHI_COST) return;
    setCredits(prev => prev - RIICHI_COST);
    
    // Generate a Random Tenpai Hand
    let newHand: string[] = [];

    // 1. Generate 3 complete sets (9 tiles)
    for(let i=0; i<3; i++) {
        newHand.push(...getRandomSet());
    }

    // 2. Generate a random Pair (2 tiles)
    const suitKeys = Object.keys(TILES) as Array<keyof typeof TILES>;
    const pairSuit = suitKeys[Math.floor(Math.random() * suitKeys.length)];
    const pairTile = TILES[pairSuit][Math.floor(Math.random() * TILES[pairSuit].length)];
    newHand.push(pairTile, pairTile);

    // 3. Generate a partial set (2 tiles) that creates the wait
    const waitObj = getRandomWait();
    newHand.push(...waitObj.tiles);

    setHand(sortHand(newHand));
    setWinningTiles(waitObj.wait);
    
    setRiver([]);
    setDrawnTile(null);
    setIsRiichi(false);
    setCanRon(false);
    setCanTsumo(false);
    setCanRiichi(true); 
    setGameState('playing');
    setTurn('bottom');
    setStatusMessage("GAME START");
    setRonSource(null);
  };

  // --- Game Loop Driver ---
  useEffect(() => {
    if (gameState !== 'playing' || !visible) return; // PAUSE IF HIDDEN

    let timer: ReturnType<typeof setTimeout>;

    if (turn === 'bottom') {
        // Player's Turn Logic
        if (!drawnTile) {
            // If player hasn't drawn yet, draw automatically after delay
            timer = setTimeout(() => {
                performPlayerDraw();
            }, 500);
        }
        // If drawnTile exists, we wait for User Interaction (Click)
    } else {
        // Bot's Turn Logic
        timer = setTimeout(() => {
            performBotTurn(turn);
        }, 600);
    }

    return () => clearTimeout(timer);
  }, [gameState, turn, drawnTile, hand, visible]); // Re-run when these change

  // --- Actions ---

  const performPlayerDraw = () => {
    setStatusMessage(isRiichi ? "AUTO-MODE: DRAWING..." : "YOUR TURN: DRAW A TILE");
    playCyberSound('flip');
    
    // Reduced lucky chance to 5% to prolong game
    const isLucky = Math.random() < 0.05;
    const randomTile = getRandomTile();
    const newTile = isLucky && winningTiles.length > 0 ? winningTiles[0] : randomTile;
    
    setDrawnTile(newTile);
    
    // Check Tsumo
    if (winningTiles.includes(newTile)) {
        setCanTsumo(true);
        setStatusMessage("WINNING TILE! TSUMO?");
        playCyberSound('match');
    } else {
        setCanTsumo(false);
    }
    
    // Auto-discard if Riichi
    if (isRiichi) {
        setTimeout(() => {
             // If tsumo, don't auto discard immediately, give chance to click? 
             // Standard Riichi: if you draw win, you win. If not, discard.
             if (!winningTiles.includes(newTile)) {
                 handleDiscard(newTile, true);
             }
        }, 1000);
    }
  };

  const handleDiscard = (tileToDiscard: string, isDrawnTile: boolean) => {
    if (gameState !== 'playing') return;
    
    playCyberSound('tile-clack');
    
    // Update Hand logic
    let newHand = [...hand];
    if (isDrawnTile) {
        setDrawnTile(null);
    } else {
        if (drawnTile) {
            const index = newHand.lastIndexOf(tileToDiscard);
            if (index !== -1) {
                newHand[index] = drawnTile;
                newHand = sortHand(newHand);
                setHand(newHand);
            }
            setDrawnTile(null);
        }
    }

    // Add to River
    const discardEntry = { tile: tileToDiscard, player: 'bottom' as PlayerPosition, isRecent: true };
    setRiver(prev => [...prev.map(r => ({...r, isRecent: false})), discardEntry]);
    
    // Reset
    setCanTsumo(false);
    setCanRiichi(false); 
    
    // Pass Turn
    setTurn('right');
    setStatusMessage("OPPONENT TURN...");
  };

  const declareRiichi = () => {
    if (!drawnTile) return;
    setIsRiichi(true);
    setCanRiichi(false);
    playCyberSound('riichi');
    setStatusMessage("RIICHI! AUTO-COMBAT ENGAGED");
  };

  const performBotTurn = (botPos: PlayerPosition) => {
    // Bot Logic
    const randomTile = getRandomTile();
    // 5% chance to deal into player
    const isDanger = Math.random() < 0.05; 
    const discard = isDanger && winningTiles.length > 0 ? winningTiles[Math.floor(Math.random() * winningTiles.length)] : randomTile;
    
    playCyberSound('tile-clack');
    
    setRiver(prev => [...prev.map(r => ({...r, isRecent: false})), { tile: discard, player: botPos, isRecent: true }]);
    setLastDiscard(discard);

    // Check Ron
    if (winningTiles.includes(discard)) {
        setCanRon(true);
        setRonSource(botPos);
        setStatusMessage("WINNING TILE DISCARDED!");
        playCyberSound('match');
        
        // Timer window for RON
        ronTimerRef.current = setTimeout(() => {
            setCanRon(false);
            setRonSource(null);
            advanceTurn(botPos);
        }, 3500);
    } else {
        advanceTurn(botPos);
    }
  };

  const advanceTurn = (currentPos: PlayerPosition) => {
      const next = getNextPlayer(currentPos);
      setTurn(next);
  };

  // --- Helpers ---

  const getRandomTile = () => {
    const all = [...TILES.man, ...TILES.pin, ...TILES.sou, ...TILES.honor];
    return all[Math.floor(Math.random() * all.length)];
  };

  const getNextPlayer = (current: PlayerPosition): PlayerPosition => {
    if (current === 'bottom') return 'right';
    if (current === 'right') return 'top';
    if (current === 'top') return 'left';
    return 'bottom';
  };

  const handleWin = (type: 'tsumo' | 'ron') => {
    if (ronTimerRef.current) clearTimeout(ronTimerRef.current);
    
    setGameState('finished');
    const isTsumo = type === 'tsumo';
    playCyberSound(isTsumo ? 'tsumo' : 'win');

    const uraDora = Math.floor(Math.random() * 3); 
    const riichiBonus = isRiichi ? 1000 : 0;
    const winAmount = BASE_REWARD + (uraDora * 500) + riichiBonus;

    setCredits(prev => prev + winAmount);
    setStatusMessage(`${isTsumo ? 'TSUMO' : 'RON'}! NET GAIN: ${winAmount}`);
  };

  useEffect(() => {
    return () => {
        if (ronTimerRef.current) clearTimeout(ronTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center min-h-[600px] relative select-none">
       
       {/* Table Area */}
       <div className="relative w-full aspect-square max-w-[600px] bg-[#0a0a0f] rounded-3xl border-4 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-neon-blue/20">
          
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(20,20,30,1)_0%,rgba(0,0,0,1)_100%)]"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(0,243,255,0.03)_25%,rgba(0,243,255,0.03)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.03)_75%,rgba(0,243,255,0.03)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,243,255,0.03)_25%,rgba(0,243,255,0.03)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.03)_75%,rgba(0,243,255,0.03)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>
          
          {/* Center HUD */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-black/80 backdrop-blur-md border border-neon-blue/50 rounded-full flex flex-col items-center justify-center z-10 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
             
             {/* Center Content: Either Info or Start Button */}
             {gameState === 'idle' || gameState === 'finished' ? (
                <button 
                    onClick={initGame}
                    disabled={credits < RIICHI_COST}
                    className="group flex flex-col items-center justify-center w-full h-full rounded-full hover:bg-neon-blue/10 transition-all cursor-pointer"
                >
                    <div className="text-neon-blue font-orbitron text-xl font-bold animate-pulse group-hover:scale-125 group-hover:text-white group-hover:drop-shadow-[0_0_10px_#00f3ff] transition-all duration-300">
                        {gameState === 'finished' ? 'AGAIN' : 'DEAL'}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-rajdhani">COST: {RIICHI_COST}</div>
                    {gameState === 'finished' && <div className="text-neon-yellow text-xs mt-2 font-bold shadow-black drop-shadow-md">WINNER!</div>}
                </button>
             ) : (
                 <>
                    <div className="text-gray-500 text-[10px] font-orbitron tracking-widest mb-1">POTENTIAL</div>
                    <div className="text-neon-yellow font-rajdhani font-bold text-3xl drop-shadow-[0_0_10px_rgba(255,230,0,0.5)] animate-[pulse_3s_infinite]">
                        {(BASE_REWARD + (isRiichi ? 1000 : 0)).toLocaleString()}
                    </div>
                    <div className="w-24 h-[1px] bg-gray-700 my-3"></div>
                    <div className={`text-xs font-bold tracking-widest ${turn === 'bottom' ? 'text-neon-green animate-pulse shadow-neon-green' : 'text-neon-red'}`}>
                        {turn === 'bottom' ? 'YOUR TURN' : 'OPPONENT'}
                    </div>
                 </>
             )}
          </div>

          {/* Discards (River) */}
          <div className="absolute inset-0 pointer-events-none">
             {river.map((r, i) => {
                 let pos = {};
                 if (r.player === 'bottom') pos = { bottom: '28%', left: `${50 + (i%6 - 2.5)*8}%` };
                 if (r.player === 'right') pos = { right: '22%', top: `${50 + (i%6 - 2.5)*10}%`, transform: 'rotate(-90deg)' };
                 if (r.player === 'top') pos = { top: '22%', right: `${50 + (i%6 - 2.5)*8}%`, transform: 'rotate(180deg)' };
                 if (r.player === 'left') pos = { left: '22%', bottom: `${50 + (i%6 - 2.5)*10}%`, transform: 'rotate(90deg)' };

                 return (
                     <div key={i} className={`absolute transition-all duration-300 ${r.isRecent ? 'scale-110 z-20 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]' : 'scale-100 opacity-80'}`} style={pos}>
                         <Tile tile={r.tile} size="sm" disabled />
                     </div>
                 );
             })}
          </div>

          {/* Opponents */}
          <OpponentAvatar position="top" isActive={turn === 'top'} name="DAEMON_X" icon={Skull} isRonTarget={ronSource === 'top'} />
          <OpponentAvatar position="left" isActive={turn === 'left'} name="GHOST_SHELL" icon={Shield} isRonTarget={ronSource === 'left'} />
          <OpponentAvatar position="right" isActive={turn === 'right'} name="NET_RUNNER" icon={Cpu} isRonTarget={ronSource === 'right'} />

          {/* Player Area */}
          <div className={`
             absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center justify-end pb-6 z-20 pointer-events-auto transition-all duration-500
             ${turn === 'bottom' ? 'shadow-[inset_0_-50px_100px_rgba(0,255,157,0.1)]' : ''}
          `}>
             
             {/* Actions */}
             <div className="flex gap-4 mb-6 min-h-[60px]">
                 {canRon && (
                     <button onClick={() => handleWin('ron')} className="bg-neon-red text-white font-black text-2xl px-10 py-2 clip-path-cyberpunk hover:bg-white hover:text-red-600 transition-all animate-bounce shadow-[0_0_30px_#ff3333] z-50 border border-white">
                         RON!
                     </button>
                 )}
                 {canTsumo && (
                     <button onClick={() => handleWin('tsumo')} className="bg-neon-yellow text-black font-black text-2xl px-10 py-2 clip-path-cyberpunk hover:bg-white transition-all animate-bounce shadow-[0_0_30px_#ffe600] z-50 border border-black">
                         TSUMO!
                     </button>
                 )}
                 {canRiichi && gameState === 'playing' && drawnTile && !isRiichi && (
                     <button onClick={declareRiichi} className="bg-black/80 text-neon-blue border border-neon-blue font-bold text-lg px-8 py-2 rounded hover:bg-neon-blue hover:text-black transition-all z-50 shadow-[0_0_15px_#00f3ff] hover:shadow-[0_0_30px_#00f3ff]">
                         RIICHI
                     </button>
                 )}
             </div>

             {/* Hand */}
             <div className={`
                flex items-end gap-1 md:gap-2 px-4 relative z-30 transition-all duration-500 p-2 rounded-xl
                ${turn === 'bottom' ? 'ring-2 ring-neon-green/30 bg-neon-green/5 shadow-[0_0_30px_rgba(0,255,157,0.1)]' : 'opacity-80 grayscale-[0.5]'}
                ${gameState === 'idle' ? 'opacity-30 grayscale' : ''}
             `}>
                {gameState === 'playing' || gameState === 'finished' ? hand.map((tile, i) => (
                   <Tile 
                     key={i} 
                     tile={tile} 
                     size="lg" 
                     onClick={() => {
                        if (!isRiichi && turn === 'bottom' && drawnTile) {
                            handleDiscard(tile, false);
                        }
                     }}
                     disabled={turn !== 'bottom' || (isRiichi && !!drawnTile)} 
                   />
                )) : (
                    // Dummy hand for idle state visuals
                    [...Array(13)].map((_, i) => <div key={i} className="w-8 h-12 bg-gray-800/50 rounded border border-gray-700"></div>)
                )}

                <div className="w-2 md:w-4"></div>

                {drawnTile ? (
                    <div className="relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-neon-yellow text-[10px] font-bold animate-bounce bg-black/80 px-2 py-1 rounded border border-neon-yellow">DRAW</div>
                        <Tile 
                            tile={drawnTile} 
                            size="lg" 
                            highlight={true}
                            onClick={() => {
                                if (turn === 'bottom') handleDiscard(drawnTile, true);
                            }}
                            disabled={turn !== 'bottom'}
                        />
                    </div>
                ) : (
                    <div className="w-12 h-16 md:w-12 md:h-16 opacity-0"></div> 
                )}
             </div>
             
             {/* Status */}
             <div className="mt-4 text-neon-blue font-orbitron text-sm tracking-widest bg-black/80 px-6 py-1 rounded border-x border-neon-blue/50 z-30 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                 {statusMessage}
             </div>
          </div>

       </div>
    </div>
  );
};

const OpponentAvatar = ({ position, isActive, name, icon: Icon, isRonTarget }: { position: PlayerPosition, isActive: boolean, name: string, icon: any, isRonTarget: boolean }) => {
    let posClass = "";
    if (position === 'top') posClass = "top-4 left-1/2 -translate-x-1/2";
    if (position === 'left') posClass = "left-4 top-1/2 -translate-y-1/2 -rotate-90";
    if (position === 'right') posClass = "right-4 top-1/2 -translate-y-1/2 rotate-90";

    return (
        <div className={`absolute ${posClass} flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-40 grayscale'} z-20`}>
            <div className={`
                w-12 h-12 rounded-full bg-black border-2 flex items-center justify-center relative mb-2 transition-all duration-300
                ${isActive ? 'border-neon-pink shadow-[0_0_20px_#ff00ff]' : 'border-gray-700'}
                ${isRonTarget ? 'bg-neon-red animate-ping' : ''}
            `}>
                <Icon className={isActive ? 'text-neon-pink' : 'text-gray-600'} size={24} />
            </div>
            <div className="bg-black/80 px-2 py-0.5 rounded text-[10px] text-gray-300 font-orbitron border border-gray-700 whitespace-nowrap">
                {name}
            </div>
             <div className="flex gap-0.5 mt-1">
                {[...Array(13)].map((_, i) => (
                    <div key={i} className="w-3 h-5 bg-black rounded-[1px] border border-gray-800"></div>
                ))}
             </div>
        </div>
    );
};

interface TileProps {
  tile: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  highlight?: boolean;
  disabled?: boolean;
}

// VISUAL OVERHAUL: Dark Mode Neon Tiles
const Tile: React.FC<TileProps> = ({ tile, size = 'md', onClick, highlight, disabled }) => {
    const sizeClass = size === 'lg' ? 'w-12 h-16 text-4xl' : size === 'md' ? 'w-8 h-12 text-2xl' : 'w-6 h-8 text-xl';
    
    return (
        <button 
            onClick={(e) => {
                if (!disabled && onClick) {
                    e.stopPropagation(); 
                    onClick();
                }
            }}
            disabled={disabled}
            className={`
                relative ${sizeClass} bg-gray-950 rounded-[4px] flex items-center justify-center shadow-[0_0_5px_rgba(0,0,0,0.8)]
                transition-all duration-200 z-30 border border-gray-800
                ${disabled ? 'cursor-default opacity-90' : 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:border-neon-blue hover:scale-105 active:translate-y-0'}
                ${highlight ? 'ring-2 ring-neon-yellow shadow-[0_0_20px_#ffe600] border-neon-yellow z-40' : ''}
            `}
        >
            {/* Tile Face */}
            <span className={`${getTileColorClass(tile)} font-serif select-none relative z-10`}>{tile}</span>
            
            {/* Glass/Hologram Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[4px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
            
            {/* Back depth (pseudo 3d) */}
            {!disabled && (
                 <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-800 rounded-b-[4px]"></div>
            )}
        </button>
    );
};
