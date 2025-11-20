import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { GlitchText } from './GlitchText';

interface HighLowGameProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

export const HighLowGame: React.FC<HighLowGameProps> = ({ credits, setCredits }) => {
  const [currentNumber, setCurrentNumber] = useState(50);
  const [nextNumber, setNextNumber] = useState<number | null>(null);
  const [message, setMessage] = useState("PREDICT THE NEXT DATA STREAM");
  const [streak, setStreak] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const BET_AMOUNT = 20;

  const generateNumber = () => Math.floor(Math.random() * 100) + 1;

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (credits < BET_AMOUNT) {
      setMessage("INSUFFICIENT CREDITS");
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    setCredits(prev => prev - BET_AMOUNT);
    
    // Simulate calculation delay
    let ticks = 0;
    const interval = setInterval(() => {
      setNextNumber(Math.floor(Math.random() * 100) + 1);
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        finalizeGuess(guess);
      }
    }, 50);
  };

  const finalizeGuess = (guess: 'higher' | 'lower') => {
    const newNum = generateNumber();
    
    // Ensure we don't get the exact same number for simplicity, or treat equal as loss (house edge)
    let finalNum = newNum;
    if (finalNum === currentNumber) {
        finalNum = currentNumber === 100 ? 99 : currentNumber + 1;
    }
    
    setNextNumber(finalNum);

    const isWin = (guess === 'higher' && finalNum > currentNumber) || 
                  (guess === 'lower' && finalNum < currentNumber);

    if (isWin) {
      const multiplier = 1 + (streak * 0.1); // Streak bonus
      const winAmount = Math.floor(BET_AMOUNT * 1.8 * multiplier);
      setCredits(prev => prev + winAmount);
      setStreak(prev => prev + 1);
      setMessage(`DATA MATCHED! +${winAmount} (STREAK x${multiplier.toFixed(1)})`);
    } else {
      setStreak(0);
      setMessage("DATA CORRUPTION. LINK LOST.");
    }

    setTimeout(() => {
      setCurrentNumber(finalNum);
      setNextNumber(null);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 relative">
      {/* Container Frame */}
      <div className="absolute inset-0 bg-gray-900/80 border border-neon-green clip-path-cyberpunk opacity-90"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 py-8">
        <div className="flex items-center gap-2 text-neon-green mb-4">
            <Activity className="animate-pulse" />
            <h2 className="font-orbitron tracking-widest text-xl">BINARY_RISK_PROTOCOL</h2>
        </div>

        {/* Game Display */}
        <div className="flex items-center justify-center gap-8 md:gap-16 w-full">
            {/* Current Number */}
            <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 font-rajdhani uppercase mb-2">Current Node</span>
                <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-neon-blue bg-black/50 flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <span className="text-4xl md:text-6xl font-orbitron text-white">{currentNumber}</span>
                </div>
            </div>

            {/* Direction Indicators */}
            <div className="flex flex-col gap-2 opacity-50">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>

            {/* Next Number (Hidden/Revealing) */}
            <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 font-rajdhani uppercase mb-2">Target Node</span>
                <div className={`w-24 h-24 md:w-32 md:h-32 border-2 ${nextNumber !== null ? 'border-neon-pink' : 'border-gray-700'} bg-black/50 flex items-center justify-center rounded-sm relative overflow-hidden transition-all duration-300`}>
                    {nextNumber !== null ? (
                        <span className="text-4xl md:text-6xl font-orbitron text-neon-pink animate-pulse">{nextNumber}</span>
                    ) : (
                        <span className="text-4xl md:text-6xl font-orbitron text-gray-800">?</span>
                    )}
                    {isProcessing && !nextNumber && (
                        <div className="absolute inset-0 bg-neon-green/10 animate-pulse"></div>
                    )}
                </div>
            </div>
        </div>

        {/* Status Message */}
        <div className="h-8">
            <p className={`font-rajdhani tracking-widest text-lg ${message.includes("MATCHED") ? "text-neon-green" : message.includes("CORRUPTION") ? "text-neon-red" : "text-neon-blue"}`}>
                {message}
            </p>
        </div>

        {/* Controls */}
        <div className="flex gap-6 w-full max-w-md">
            <button 
                onClick={() => handleGuess('lower')}
                disabled={isProcessing}
                className="flex-1 py-4 border border-neon-red bg-black/40 hover:bg-neon-red/20 text-neon-red transition-all group rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex flex-col items-center">
                    <ArrowDown size={32} className="mb-1 group-hover:translate-y-1 transition-transform" />
                    <span className="font-orbitron font-bold tracking-widest">LOWER</span>
                </div>
            </button>
            
            <div className="flex flex-col justify-center items-center text-gray-500 font-mono text-xs">
                <span>COST</span>
                <span className="text-white text-lg">{BET_AMOUNT}</span>
            </div>

            <button 
                onClick={() => handleGuess('higher')}
                disabled={isProcessing}
                className="flex-1 py-4 border border-neon-green bg-black/40 hover:bg-neon-green/20 text-neon-green transition-all group rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex flex-col items-center">
                    <ArrowUp size={32} className="mb-1 group-hover:-translate-y-1 transition-transform" />
                    <span className="font-orbitron font-bold tracking-widest">HIGHER</span>
                </div>
            </button>
        </div>

        <div className="text-xs text-gray-600 font-rajdhani uppercase">
            Current Streak: <span className="text-white">{streak}</span> (Multiplier: x{(1 + streak * 0.1).toFixed(1)})
        </div>
      </div>
    </div>
  );
};