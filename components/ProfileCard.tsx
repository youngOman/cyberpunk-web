import React from 'react';
import { User, Terminal, MapPin, Github, Mail, Server, Database, Cloud, Cpu } from 'lucide-react';
import { GlitchText } from './GlitchText';

export const ProfileCard: React.FC = () => {
  const skills = [
    { name: 'Python / AI', level: 98, color: 'bg-neon-yellow' },
    { name: 'Go (Golang)', level: 90, color: 'bg-neon-blue' },
    { name: 'Rust', level: 85, color: 'bg-neon-red' },
    { name: 'PostgreSQL / SQL', level: 92, color: 'bg-blue-400' },
    { name: 'DevOps / K8s', level: 88, color: 'bg-neon-pink' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 p-6 md:p-12 relative">
      {/* Complex Border Background */}
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl border border-gray-700 clip-path-cyberpunk z-0"></div>
      <div className="absolute -inset-[2px] bg-gradient-to-br from-neon-blue via-transparent to-neon-pink -z-10 clip-path-cyberpunk opacity-40"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Avatar / Identity Column */}
        <div className="lg:col-span-4 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-700 pb-8 lg:pb-0 lg:pr-8">
          <div className="w-40 h-40 relative mb-8 group">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-neon-blue animate-spin-slow"></div>
            <div className="absolute inset-0 rounded-full border border-neon-pink opacity-30 scale-110"></div>
            
            {/* Hexagon mask for image */}
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
               <User size={80} className="text-gray-500 group-hover:text-neon-blue transition-colors duration-500" />
            </div>
            
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-neon-yellow text-black text-[10px] font-bold px-3 py-1 rounded-sm font-rajdhani uppercase tracking-widest shadow-lg whitespace-nowrap">
              System Admin
            </div>
          </div>
          
          <GlitchText text="YOUNG" as="h1" className="text-5xl font-bold mb-3 text-white" />
          <p className="text-neon-blue font-rajdhani tracking-[0.3em] text-sm mb-6 uppercase">Backend & AI Architect</p>
          
          <div className="flex gap-4 mt-auto w-full justify-center">
             <button className="group relative p-3 overflow-hidden border border-gray-600 hover:border-neon-pink transition-all rounded-sm">
                <div className="absolute inset-0 bg-neon-pink/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <Github size={22} className="text-gray-400 group-hover:text-neon-pink relative z-10" />
             </button>
             <button className="group relative p-3 overflow-hidden border border-gray-600 hover:border-neon-blue transition-all rounded-sm">
                <div className="absolute inset-0 bg-neon-blue/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <Mail size={22} className="text-gray-400 group-hover:text-neon-blue relative z-10" />
             </button>
          </div>
        </div>

        {/* Bio & Stats Column */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-10">
           {/* About Section */}
           <div>
             <h3 className="flex items-center gap-3 text-xl font-orbitron text-neon-yellow mb-6">
                <Terminal size={24} />
                <span className="tracking-widest">ROOT_ACCESS_GRANTED</span>
                <div className="h-px flex-grow bg-gradient-to-r from-neon-yellow/50 to-transparent"></div>
             </h3>
             <p className="text-gray-300 font-rajdhani text-lg leading-relaxed tracking-wide">
               我是 Young，專注於後端架構與人工智慧解決方案的工程師。
               在這個數據驅動的荒野中，我擅長構建高併發的伺服器系統、優化資料庫效能，並將 AI 模型部署至生產環境。
               對我來說，DevOps 不僅是運維，更是確保代碼在數位混沌中穩定運行的生存法則。
             </p>
             <div className="mt-6 flex items-center gap-6 text-sm text-gray-500 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-neon-red" />
                  <span>Taipei, Sector 7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-neon-blue" />
                  <span>Uptime: 99.99%</span>
                </div>
             </div>
           </div>

           {/* Skills Matrix */}
           <div>
             <h3 className="flex items-center gap-3 text-xl font-orbitron text-neon-pink mb-6">
                <Cpu size={24} />
                <span className="tracking-widest">NEURAL_CAPABILITIES</span>
                <div className="h-px flex-grow bg-gradient-to-r from-neon-pink/50 to-transparent"></div>
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  {skills.slice(0,3).map((skill, idx) => (
                     <SkillBar key={idx} skill={skill} />
                  ))}
                </div>
                {/* Column 2 */}
                <div className="space-y-4">
                   {skills.slice(3).map((skill, idx) => (
                     <SkillBar key={idx} skill={skill} />
                  ))}
                   {/* Extra decorative item */}
                   <div className="flex items-center justify-between p-3 border border-gray-800 bg-black/30 rounded-sm">
                      <div className="flex items-center gap-2 text-gray-400 font-rajdhani">
                        <Database size={16} />
                        <span>Redis / Kafka</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-neon-green"></div>
                        <div className="w-1.5 h-1.5 bg-neon-green"></div>
                        <div className="w-1.5 h-1.5 bg-neon-green animate-pulse"></div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const SkillBar = ({ skill }: { skill: { name: string, level: number, color: string } }) => (
  <div>
    <div className="flex justify-between text-xs font-orbitron mb-2 text-gray-400 uppercase tracking-wider">
      <span>{skill.name}</span>
      <span className={skill.color.replace('bg-', 'text-')}>{skill.level}%</span>
    </div>
    <div className="w-full h-2 bg-gray-800 overflow-hidden relative">
      {/* Grid background inside bar */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
      <div 
        className={`h-full ${skill.color} shadow-[0_0_15px_currentColor] relative`} 
        style={{ width: `${skill.level}%` }}
      >
        <div className="absolute right-0 top-0 h-full w-1 bg-white mix-blend-overlay"></div>
      </div>
    </div>
  </div>
);