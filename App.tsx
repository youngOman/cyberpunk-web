
import React, { useState, useEffect, useRef } from 'react';
import { SlotMachine } from './components/SlotMachine';
import { ProfileCard } from './components/ProfileCard';
import { GlitchText } from './components/GlitchText';
import { MahjongGame } from './components/MahjongGame';
import { MemoryGame } from './components/MemoryGame';
import { CodeBreakerGame } from './components/CodeBreakerGame';
import { INITIAL_CREDITS } from './constants';
import { Battery, Wifi, Menu, X, Home, Gamepad2, Layers, BrainCircuit, Loader2, Hash } from 'lucide-react';

type ViewType = 'home' | 'slots' | 'mahjong' | 'memory' | 'codebreaker';

const CreditsDisplay: React.FC<{ credits: number }> = ({ credits }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevCredits = useRef(credits);

  useEffect(() => {
    if (prevCredits.current !== credits) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 300);
      prevCredits.current = credits;
      return () => clearTimeout(timer);
    }
  }, [credits]);

  return (
    <div className={`flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded border transition-all duration-300 ${isUpdating ? 'border-neon-yellow bg-neon-yellow/10 shadow-[0_0_15px_rgba(255,230,0,0.3)]' : 'border-gray-700'}`}>
      <span className="text-xs text-gray-500 uppercase font-rajdhani hidden sm:inline">Credits</span>
      <span className={`font-mono font-bold transition-all duration-300 ${isUpdating ? 'text-white drop-shadow-[0_0_8px_#ffe600] scale-110' : 'text-neon-yellow'}`}>
        ¥{credits.toLocaleString()}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Transition State
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [animState, setAnimState] = useState<'idle' | 'out' | 'in'>('idle');

  const handleViewChange = (newView: ViewType) => {
    if (newView === activeView || animState !== 'idle') return;
    
    setIsMenuOpen(false);
    setAnimState('out');
    
    // Wait for exit animation
    setTimeout(() => {
      setActiveView(newView);
      setCurrentView(newView);
      setAnimState('in');
      
      // Wait for enter animation
      setTimeout(() => {
        setAnimState('idle');
      }, 100);
    }, 100);
  };

  const NavButton = ({ view, label, icon: Icon }: { view: ViewType; label: string; icon: any }) => (
    <button
      onClick={() => handleViewChange(view)}
      className={`
        group flex items-center gap-3 px-4 py-3 w-full md:w-auto md:py-2 md:px-4 relative overflow-hidden
        transition-all duration-300 border-l-4 md:border-l-0 md:border-b-2 rounded-r md:rounded-r-none md:rounded-t
        ${activeView === view 
          ? 'border-neon-pink bg-neon-pink/10 text-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.2)]' 
          : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-gray-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] transition-transform duration-500 ${activeView === view ? '' : 'group-hover:translate-x-[100%]'}`}></div>
      <Icon size={18} className={`transition-transform duration-300 ${activeView === view ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="font-orbitron tracking-wider text-sm relative z-10">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen hex-bg text-gray-100 selection:bg-neon-pink selection:text-white pb-20 flex flex-col overflow-hidden">
      
      {/* Sticky HUD Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-black/80 border-b border-gray-800 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleViewChange('home')}>
            <div className="w-2 h-8 bg-neon-blue shadow-[0_0_10px_#00f3ff] group-hover:shadow-[0_0_20px_#00f3ff] transition-shadow"></div>
            <div className="flex flex-col leading-none">
              <GlitchText text="KOMICHI_FANCLUB" className="text-lg md:text-xl font-orbitron font-bold text-white" />
              <span className="text-[10px] text-neon-blue font-rajdhani tracking-[0.3em] uppercase group-hover:text-white transition-colors">Neural Playground</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
             <NavButton view="home" label="PROFILE" icon={Home} />
             <NavButton view="slots" label="SLOTS" icon={Gamepad2} />
             <NavButton view="codebreaker" label="CODE BREAKER" icon={Hash} />
             <NavButton view="mahjong" label="CYBER RIICHI" icon={Layers} />
          </div>

          {/* Credits & Mobile Toggle */}
          <div className="flex items-center gap-4 md:gap-6">
             {/* Credits Display */}
             <CreditsDisplay credits={credits} />

             {/* Status Icons (Desktop) */}
             <div className="hidden md:flex items-center gap-3 text-gray-500">
               <Wifi size={18} className="text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
               <Battery size={18} className="text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]" />
             </div>

             {/* Hamburger Button */}
             <button 
               className="md:hidden text-white p-1 hover:text-neon-blue transition-colors"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 border-b border-neon-blue backdrop-blur-xl flex flex-col p-4 shadow-2xl animate-[slideIn_0.2s_ease-out]">
             <NavButton view="home" label="PROFILE: YOUNG" icon={Home} />
             <NavButton view="slots" label="GAME: NEURAL SLOTS" icon={Gamepad2} />
             <NavButton view="codebreaker" label="GAME: CODE BREAKER" icon={Hash} />
             <NavButton view="mahjong" label="GAME: CYBER RIICHI" icon={Layers} />
             
             <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-500 font-mono">
                <span>SYS_STATUS: ONLINE</span>
                <span>V2.1.0</span>
             </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 pt-8 flex-grow relative z-10">
        
        {/* Transition Container */}
        <div className={`
          transition-transform duration-0
          ${animState === 'out' ? 'animate-tv-out' : ''}
          ${animState === 'in' ? 'animate-tv-in' : ''}
        `}>

          {/* Intro Header (Changes based on view) */}
          <div className="text-center mb-10">
            <h2 className="text-neon-pink font-rajdhani tracking-[0.2em] text-sm md:text-base uppercase animate-pulse">
              {activeView === 'home' ? 'Welcome to the Club' : 'Neural Interface Connected'}
            </h2>
            <h1 className="text-3xl md:text-5xl font-black text-white font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mt-2">
              {activeView === 'home' && "SYSTEM ADMIN: YOUNG"}
              {activeView === 'slots' && "NEURAL SLOTS"}
              {activeView === 'mahjong' && "CYBER RIICHI"}
              {activeView === 'codebreaker' && "CODE BREAKER"}
              {activeView === 'memory' && "MEMORY BREACH"}
            </h1>
          </div>

          {/* Content Area - USING DISPLAY NONE FOR PERSISTENCE */}
          <div className="min-h-[50vh]">
              {/* Profile - Can remount, it's static */}
              <div className={activeView === 'home' ? 'block' : 'hidden'}>
                <ProfileCard />
              </div>

              {/* Slots - Persist */}
              <div className={activeView === 'slots' ? 'block' : 'hidden'}>
                <div className="max-w-lg mx-auto">
                    <p className="text-center text-gray-400 font-rajdhani mb-8">
                      Align the symbols to synchronize with the network. High risk, high reward.
                    </p>
                    <SlotMachine credits={credits} setCredits={setCredits} />
                </div>
              </div>

              {/* Code Breaker - Persist */}
              <div className={activeView === 'codebreaker' ? 'block' : 'hidden'}>
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-gray-400 font-rajdhani mb-8">
                      Crack the 4-digit security sequence. Green for Hit, Yellow for Blow.
                    </p>
                    <CodeBreakerGame credits={credits} setCredits={setCredits} />
                </div>
              </div>

              {/* Mahjong - Persist */}
              <div className={activeView === 'mahjong' ? 'block' : 'hidden'}>
                 <div className="max-w-4xl mx-auto">
                      <p className="text-center text-gray-400 font-rajdhani mb-8">
                      Discard to Declare Riichi. Outsmart the AI ghosts in a battle of probability.
                    </p>
                    <MahjongGame credits={credits} setCredits={setCredits} visible={activeView === 'mahjong'} />
                 </div>
              </div>
          </div>
        </div>

        {/* Loading / Glitch Overlay during transition */}
        {animState !== 'idle' && (
           <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="w-full h-0.5 bg-neon-blue absolute top-1/2 left-0 animate-[ping_0.1s_infinite]"></div>
              <div className="bg-black/80 backdrop-blur-sm px-6 py-2 rounded border border-neon-pink text-neon-pink font-orbitron tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(255,0,255,0.3)]">
                 <Loader2 className="animate-spin" />
                 SYSTEM_RELOADING...
              </div>
           </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800 bg-black py-8 text-center relative z-10">
        <div className="flex justify-center items-center gap-4 mb-4 opacity-50">
           <div className="w-16 h-[1px] bg-neon-blue shadow-[0_0_5px_#00f3ff]"></div>
           <div className="w-2 h-2 bg-neon-pink rotate-45 shadow-[0_0_5px_#ff00ff]"></div>
           <div className="w-16 h-[1px] bg-neon-blue shadow-[0_0_5px_#00f3ff]"></div>
        </div>
        <p className="text-gray-600 font-rajdhani text-sm">
          © 2077 KOMICHI FANCLUB. ENGINEERED BY YOUNG.
        </p>
      </footer>

    </div>
  );
};

export default App;
