import React, { useState, useCallback, useRef } from 'react';
import { SLOT_ITEMS, COST_PER_SPIN } from '../constants';
import { ChevronUp, RotateCw, Coins, Triangle } from 'lucide-react';

interface SlotMachineProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

const getRandomItem = () => {
  const rand = Math.random();
  if (rand > 0.98) return SLOT_ITEMS[5]; // Skull
  if (rand > 0.90) return SLOT_ITEMS[4]; // Shield
  if (rand > 0.75) return SLOT_ITEMS[3]; // Radio
  if (rand > 0.55) return SLOT_ITEMS[2]; // Disc
  if (rand > 0.30) return SLOT_ITEMS[1]; // Zap
  return SLOT_ITEMS[0]; // Cpu
};

export const SlotMachine: React.FC<SlotMachineProps> = ({ credits, setCredits }) => {
  const [reels, setReels] = useState([getRandomItem(), getRandomItem(), getRandomItem()]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState("READY TO LINK");
  const [lastWin, setLastWin] = useState(0);
  const [reelStatus, setReelStatus] = useState<('idle' | 'spinning' | 'stopped')[]>(['idle', 'idle', 'idle']);

  // Refs to track interval IDs so we can clear them precisely
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  const spin = useCallback(() => {
    if (credits < COST_PER_SPIN) {
      setMessage("INSUFFICIENT CREDITS");
      return;
    }
    if (isSpinning) return;

    setCredits(prev => prev - COST_PER_SPIN);
    setIsSpinning(true);
    setMessage("NEURAL LINKING...");
    setLastWin(0);
    setReelStatus(['spinning', 'spinning', 'spinning']);

    // Clear any existing intervals just in case
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    const spinDuration = 1500; 

    // Start spinning
    [0, 1, 2].forEach((index) => {
      // Very fast interval for blur effect
      const interval = setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = getRandomItem();
          return newReels;
        });
      }, 50); // Fast switching
      intervalsRef.current.push(interval);
    });

    // Stop reels sequentially
    setTimeout(() => {
      clearInterval(intervalsRef.current[0]);
      const finalReel1 = getRandomItem();
      setReels(prev => [finalReel1, prev[1], prev[2]]);
      setReelStatus(prev => ['stopped', 'spinning', 'spinning']);
      
      setTimeout(() => {
        clearInterval(intervalsRef.current[1]);
        const finalReel2 = getRandomItem();
        setReels(prev => [prev[0], finalReel2, prev[2]]);
        setReelStatus(prev => ['stopped', 'stopped', 'spinning']);

        setTimeout(() => {
          clearInterval(intervalsRef.current[2]);
          const finalReel3 = getRandomItem();
          setReels(prev => [prev[0], prev[1], finalReel3]);
          setReelStatus(prev => ['stopped', 'stopped', 'stopped']);
          setIsSpinning(false);
          
          checkWin(finalReel1, finalReel2, finalReel3);

          // Reset status to idle after a moment
          setTimeout(() => setReelStatus(['idle', 'idle', 'idle']), 500);

        }, 400); 
      }, 400); 
    }, spinDuration); 

  }, [credits, isSpinning, setCredits]);

  const checkWin = (r1: typeof SLOT_ITEMS[0], r2: typeof SLOT_ITEMS[0], r3: typeof SLOT_ITEMS[0]) => {
    if (r1.id === r2.id && r2.id === r3.id) {
      const winAmount = r1.points * 10;
      setCredits(prev => prev + winAmount);
      setLastWin(winAmount);
      setMessage(`JACKPOT! +${winAmount}`);
    } else if (r1.id === r2.id || r2.id === r3.id || r1.id === r3.id) {
      const matchItem = r1.id === r2.id ? r1 : r3;
      const winAmount = Math.floor(matchItem.points * 2);
      setCredits(prev => prev + winAmount);
      setLastWin(winAmount);
      setMessage(`MATCH SEQUENCE! +${winAmount}`);
    } else {
      setMessage("SYNC FAILED");
    }
  };

  return (
    <div className="relative p-1 bg-gradient-to-b from-gray-800 to-gray-950 rounded-xl border-2 border-neon-blue shadow-[0_0_40px_rgba(0,243,255,0.2)] max-w-lg w-full mx-auto transform transition-transform hover:scale-[1.01]">
      
      {/* Top Decorative Header */}
      <div className="bg-gray-900 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50 animate-pulse"></div>
        <div className="flex items-center gap-3 z-10">
          <div className="w-3 h-3 rounded-sm bg-neon-red animate-pulse box-content border border-red-900"></div>
          <span className="text-xs text-neon-blue font-orbitron tracking-widest drop-shadow-sm">V2.0_PROTOCOL</span>
        </div>
        <div className="flex items-center gap-2 text-neon-yellow font-rajdhani font-bold bg-black/50 px-3 py-1 rounded border border-gray-700">
          <Coins size={14} />
          <span className="text-lg">{credits.toString().padStart(6, '0')}</span>
        </div>
      </div>

      {/* Reels Container */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-black relative overflow-hidden border-b border-gray-800">
        {/* Scanline moving across */}
        {isSpinning && <div className="absolute top-0 bottom-0 w-[2px] bg-neon-blue/50 z-20 animate-[spin-slow_1s_linear_infinite] translate-x-[-100%]"></div>}
        
        {/* Center Highlight Line */}
        <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent border-y border-neon-blue/30 z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-neon-blue z-20 opacity-80"><Triangle size={12} fill="currentColor" className="rotate-90" /></div>
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-neon-blue z-20 opacity-80"><Triangle size={12} fill="currentColor" className="-rotate-90" /></div>

        {reels.map((item, idx) => (
          <div key={idx} className="relative h-40 bg-gray-900/80 border-x border-gray-800 overflow-hidden">
             {/* Vertical Gradients for Depth */}
             <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black to-transparent z-10"></div>
             <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent z-10"></div>

             {/* Reel Content */}
             <div className="w-full h-full flex flex-col items-center justify-center relative">
                {/* Background vertical streak for speed illusion */}
                {reelStatus[idx] === 'spinning' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent animate-pulse"></div>
                )}

                {/* The Item */}
                <div className={`
                  flex flex-col items-center justify-center transition-all duration-100
                  ${reelStatus[idx] === 'spinning' ? 'filter blur-[2px] scale-y-125 opacity-80 translate-y-0' : 'scale-100 blur-0'}
                  ${reelStatus[idx] === 'stopped' ? 'animate-[pulse_0.2s_ease-in-out]' : ''}
                `}>
                  <item.icon 
                    size={reelStatus[idx] === 'spinning' ? 52 : 56} 
                    className={`${item.color} drop-shadow-[0_0_12px_currentColor]`} 
                  />
                  {reelStatus[idx] !== 'spinning' && (
                    <span className={`mt-3 text-[10px] font-orbitron tracking-widest ${item.color} opacity-80 uppercase`}>
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Flash Effect on Stop */}
                {reelStatus[idx] === 'stopped' && (
                    <div className="absolute inset-0 bg-white/20 animate-[ping_0.3s_cubic-bezier(0,0,0.2,1)] pointer-events-none"></div>
                )}
             </div>
          </div>
        ))}
      </div>

      {/* Status Message */}
      <div className="h-14 flex items-center justify-center bg-gray-950 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <span className={`relative z-10 font-orbitron tracking-[0.2em] text-sm md:text-base font-bold ${lastWin > 0 ? 'text-neon-yellow drop-shadow-[0_0_5px_#ffe600] animate-pulse' : 'text-neon-blue'}`}>
           {message}
        </span>
      </div>

      {/* Interaction Area */}
      <div className="p-5 bg-gray-900 rounded-b-lg">
        <div className="flex justify-between text-[10px] text-gray-400 font-rajdhani uppercase mb-3">
          <span className="flex items-center gap-1"><div className="w-1 h-1 bg-neon-green rounded-full"></div> SYS_READY</span>
          <span>COST: {COST_PER_SPIN} / SPIN</span>
        </div>
        
        <button 
          onClick={spin}
          disabled={isSpinning}
          className={`
            relative group w-full py-4 overflow-hidden rounded-sm clip-path-cyberpunk
            transition-all duration-200 border-2
            ${isSpinning || credits < COST_PER_SPIN
              ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed' 
              : 'bg-black/50 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black shadow-[0_0_20px_rgba(255,0,255,0.4)]'}
          `}
        >
          <div className="flex items-center justify-center gap-3 font-orbitron font-black text-xl tracking-widest relative z-10">
            {isSpinning ? (
               <RotateCw className="animate-spin" />
            ) : (
               <ChevronUp className="group-hover:-translate-y-1 transition-transform duration-300" />
            )}
            {isSpinning ? "EXECUTING..." : "INITIATE"}
          </div>
        </button>
      </div>

      {/* Decorative Corners */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon-blue opacity-60"></div>
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neon-blue opacity-60"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neon-blue opacity-60"></div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-neon-blue opacity-60"></div>
    </div>
  );
};