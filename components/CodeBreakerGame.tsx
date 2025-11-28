
import React, { useState, useEffect, useRef } from 'react';
import { Hash, Delete, CornerDownLeft, Lock, Unlock, Terminal } from 'lucide-react';
import { playCyberSound } from '../utils/audio';

interface CodeBreakerGameProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;
const ENTRY_FEE = 50;
const REWARD = 500;

type Feedback = {
  hits: number; // Correct number, correct position (A)
  blows: number; // Correct number, wrong position (B)
};

type Attempt = {
  guess: string;
  feedback: Feedback;
};

export const CodeBreakerGame: React.FC<CodeBreakerGameProps> = ({ credits, setCredits }) => {
  const [secretCode, setSecretCode] = useState<string>("");
  const [currentInput, setCurrentInput] = useState<string>("");
  const [history, setHistory] = useState<Attempt[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const startGame = () => {
    if (credits < ENTRY_FEE) return;
    setCredits(prev => prev - ENTRY_FEE);
    
    // Generate 4 random digits (duplicates allowed logic)
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    
    setSecretCode(code);
    setHistory([]);
    setCurrentInput("");
    setGameState('playing');
    playCyberSound('start');
  };

  const handleKeypad = (num: number) => {
    if (gameState !== 'playing') return;
    if (currentInput.length < CODE_LENGTH) {
      setCurrentInput(prev => prev + num.toString());
      playCyberSound('keypress');
    }
  };

  const handleDelete = () => {
    if (gameState !== 'playing') return;
    setCurrentInput(prev => prev.slice(0, -1));
    playCyberSound('keypress');
  };

  const calculateFeedback = (guess: string, secret: string): Feedback => {
    let hits = 0;
    let blows = 0;
    
    const secretArr = secret.split('');
    const guessArr = guess.split('');
    
    const secretUsed = Array(CODE_LENGTH).fill(false);
    const guessUsed = Array(CODE_LENGTH).fill(false);

    // 1. Check Hits (Correct Pos)
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessArr[i] === secretArr[i]) {
        hits++;
        secretUsed[i] = true;
        guessUsed[i] = true;
      }
    }

    // 2. Check Blows (Wrong Pos)
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessUsed[i]) continue;
      
      for (let j = 0; j < CODE_LENGTH; j++) {
        if (!secretUsed[j] && guessArr[i] === secretArr[j]) {
          blows++;
          secretUsed[j] = true; 
          break;
        }
      }
    }

    return { hits, blows };
  };

  const submitGuess = () => {
    if (gameState !== 'playing') return;
    if (currentInput.length !== CODE_LENGTH) return;

    const feedback = calculateFeedback(currentInput, secretCode);
    const newHistory = [...history, { guess: currentInput, feedback }];
    setHistory(newHistory);
    setCurrentInput("");

    if (feedback.hits === CODE_LENGTH) {
      setGameState('won');
      setCredits(prev => prev + REWARD);
      playCyberSound('access-granted');
    } else if (newHistory.length >= MAX_ATTEMPTS) {
      setGameState('lost');
      playCyberSound('access-denied');
    } else {
      playCyberSound('keypress'); // Just a confirm sound
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[650px] md:h-[600px]">
        
        {/* Left Panel: Terminal Display */}
        <div className="flex-1 bg-black p-6 flex flex-col font-mono text-sm relative border-b md:border-b-0 md:border-r border-gray-700 min-w-0">
           {/* Scanline overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
           
           <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4 z-20">
              <div className="text-neon-green flex items-center gap-2">
                <Terminal size={18} />
                <span className="text-base tracking-wider">SECURE_TERMINAL_V3</span>
              </div>
              <div className={`font-bold text-base ${history.length > MAX_ATTEMPTS - 3 ? 'text-neon-red animate-pulse' : 'text-gray-500'}`}>
                 ATTEMPTS: {history.length}/{MAX_ATTEMPTS}
              </div>
           </div>

           {/* History Log */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 z-20 pr-2 custom-scrollbar">
              {history.length === 0 && gameState === 'playing' && (
                <div className="text-gray-600 italic mt-4 text-center opacity-50"> 
                  // Awaiting sequence input...
                  <br/>// System secure.
                </div>
              )}
              {history.map((attempt, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-900/60 p-3 rounded border-l-4 border-gray-700 animate-tv-in hover:border-neon-blue transition-colors hover:bg-gray-800">
                   <span className="text-2xl text-white tracking-[0.3em] font-bold pl-2 drop-shadow-[0_0_5px_white]">{attempt.guess}</span>
                   <div className="flex gap-4 text-sm font-bold">
                      <div className="flex items-center gap-2 text-neon-green bg-green-900/20 px-2 py-1 rounded">
                        <div className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_5px_#00ff9d]"></div>
                        HIT: {attempt.feedback.hits}
                      </div>
                      <div className="flex items-center gap-2 text-neon-yellow bg-yellow-900/20 px-2 py-1 rounded">
                        <div className="w-2 h-2 bg-neon-yellow rounded-full shadow-[0_0_5px_#ffe600]"></div>
                        BLOW: {attempt.feedback.blows}
                      </div>
                   </div>
                </div>
              ))}
              
              {gameState === 'won' && (
                 <div className="mt-6 text-neon-green font-bold text-center animate-pulse border-2 border-neon-green bg-green-900/20 p-4 rounded">
                    <Unlock size={32} className="mx-auto mb-2" />
                    <div className="text-xl tracking-widest">ACCESS GRANTED</div>
                    <div className="mt-2 text-sm opacity-80">REWARD CREDITS TRANSFERRED: {REWARD}</div>
                 </div>
              )}
              {gameState === 'lost' && (
                 <div className="mt-6 text-neon-red font-bold text-center border-2 border-neon-red bg-red-900/20 p-4 rounded">
                    <Lock size={32} className="mx-auto mb-2" />
                    <div className="text-xl tracking-widest">ACCESS DENIED</div>
                    <div className="mt-2 text-sm opacity-80">CORRECT SEQUENCE: {secretCode}</div>
                 </div>
              )}
           </div>
        </div>

        {/* Right Panel: Keypad */}
        <div className="w-full md:w-96 bg-gray-800 p-6 md:p-8 flex flex-col items-center justify-center relative z-20 border-t-4 md:border-t-0 md:border-l-4 border-black shadow-xl">
           
           {gameState === 'idle' ? (
             <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-neon-blue blur-xl opacity-20 rounded-full"></div>
                  <Lock className="relative mx-auto text-neon-blue" size={64} />
                </div>
                <div>
                  <h2 className="text-2xl font-orbitron text-white mb-2">CODE BREAKER</h2>
                  <div className="h-1 w-16 bg-neon-blue mx-auto rounded-full"></div>
                </div>
                <p className="text-sm text-gray-400 px-2 leading-relaxed font-rajdhani">
                  Decrypt the 4-digit numeric sequence.<br/>
                  <span className="text-neon-green font-bold">HIT</span> means correct number & position.<br/>
                  <span className="text-neon-yellow font-bold">BLOW</span> means correct number, wrong position.
                </p>
                <button 
                  onClick={startGame}
                  disabled={credits < ENTRY_FEE}
                  className={`
                    w-full py-4 font-bold text-lg tracking-widest clip-path-cyberpunk transition-all transform hover:scale-105 active:scale-95
                    ${credits < ENTRY_FEE ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-neon-blue text-black hover:bg-white shadow-[0_0_20px_rgba(0,243,255,0.4)]'}
                  `}
                >
                   INITIATE HACK <span className="text-xs block mt-1 opacity-70">COST: {ENTRY_FEE}</span>
                </button>
             </div>
           ) : (
             <div className="w-full flex flex-col h-full justify-center">
                {/* Current Input Display */}
                <div className={`
                    bg-black border-2 border-neon-blue/30 rounded h-20 mb-8 flex items-center justify-center text-5xl font-mono text-neon-blue tracking-[0.4em] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden group transition-all
                    ${currentInput.length > 0 ? 'border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.2)]' : ''}
                `}>
                   <div className="absolute inset-0 bg-neon-blue/5 group-hover:bg-neon-blue/10 transition-colors"></div>
                   <span className="relative z-10">{currentInput.padEnd(4, '_')}</span>
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                   {[1,2,3,4,5,6,7,8,9].map(num => (
                     <button 
                       key={num}
                       onClick={() => handleKeypad(num)}
                       className="h-14 rounded bg-gray-700 text-white font-bold text-xl transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] border border-gray-600 hover:bg-gray-600 hover:text-neon-blue hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] active:shadow-none active:translate-y-[4px] active:bg-neon-blue active:text-black"
                     >
                       {num}
                     </button>
                   ))}
                   <button 
                      onClick={handleDelete}
                      className="h-14 rounded bg-gray-800 text-neon-red border border-gray-600 hover:bg-gray-700 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] active:bg-red-500 active:text-black flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px]"
                   >
                      <Delete size={24} />
                   </button>
                   <button 
                       onClick={() => handleKeypad(0)}
                       className="h-14 rounded bg-gray-700 text-white font-bold text-xl transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] border border-gray-600 hover:bg-gray-600 hover:text-neon-blue hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] active:shadow-none active:translate-y-[4px] active:bg-neon-blue active:text-black"
                     >
                       0
                   </button>
                   <button 
                      onClick={submitGuess}
                      disabled={currentInput.length !== 4}
                      className={`
                        h-14 rounded flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px] transition-all border border-black
                        ${currentInput.length === 4 ? 'bg-neon-green text-black hover:bg-green-400 hover:shadow-[0_0_20px_#00ff9d] hover:scale-105' : 'bg-gray-800 text-gray-600'}
                      `}
                   >
                      <CornerDownLeft size={24} />
                   </button>
                </div>

                {/* Control Buttons */}
                {(gameState === 'won' || gameState === 'lost') && (
                   <button 
                     onClick={startGame}
                     disabled={credits < ENTRY_FEE}
                     className="w-full py-4 mt-auto bg-neon-pink text-black font-bold tracking-wider clip-path-cyberpunk hover:bg-white transition-all hover:scale-[1.02] shadow-[0_0_20px_#ff00ff]"
                   >
                     RETRY SYSTEM
                   </button>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
