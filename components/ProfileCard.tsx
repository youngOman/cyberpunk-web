
import React, { useEffect, useState } from 'react';
import { User, Terminal, MapPin, Github, Mail, Server, Database, Cloud, Cpu, Activity, Code, Share2, Shield, Zap } from 'lucide-react';
import { GlitchText } from './GlitchText';

export const ProfileCard: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8 md:mt-16 p-4 md:p-8 relative">
      
      {/* Main Card Container with Holographic Border */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-gray-800 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
         
         {/* Animated Background Grid */}
         <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         </div>
         
         {/* Top Decorative Bar */}
         <div className="h-2 w-full bg-gradient-to-r from-neon-blue via-neon-pink to-neon-yellow relative z-10">
            <div className="absolute top-0 right-10 w-20 h-full bg-black transform skew-x-12"></div>
            <div className="absolute top-0 left-10 w-10 h-full bg-black transform -skew-x-12"></div>
         </div>

         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-6 md:p-10">
            
            {/* LEFT COLUMN: IDENTITY */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start border-b lg:border-b-0 lg:border-r border-gray-800 pb-8 lg:pb-0 lg:pr-8">
                <HoloAvatar />
                
                <div className="mt-8 text-center lg:text-left w-full">
                   <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]"></div>
                      <span className="text-neon-green text-xs font-mono tracking-widest">AVAILABLE FOR HIRE</span>
                   </div>
                   <GlitchText text="YOUNG" as="h1" className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter" />
                   <div className="bg-neon-blue/10 border-l-2 border-neon-blue px-3 py-1 inline-block shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                      <p className="text-neon-blue font-orbitron tracking-[0.2em] text-sm uppercase font-bold">BACKEND & AI ARCHITECT</p>
                   </div>
                </div>

                {/* Social Actions */}
                <div className="flex gap-3 mt-8 w-full">
                   <SocialButton icon={Github} label="GITHUB" color="hover:text-white hover:border-white hover:shadow-[0_0_15px_white] hover:bg-white/10" />
                   <SocialButton icon={Mail} label="CONTACT" color="hover:text-neon-pink hover:border-neon-pink hover:shadow-[0_0_15px_#ff00ff] hover:bg-neon-pink/10" />
                   <SocialButton icon={Share2} label="SHARE" color="hover:text-neon-yellow hover:border-neon-yellow hover:shadow-[0_0_15px_#ffe600] hover:bg-neon-yellow/10" />
                </div>
                
                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-4 w-full mt-8 border-t border-gray-800 pt-6">
                   <StatBox label="PROJECTS" value="42+" icon={Code} />
                   <StatBox label="EXPERIENCE" value="5 YRS" icon={Activity} />
                </div>
            </div>

            {/* RIGHT COLUMN: DATA STREAM */}
            <div className="lg:col-span-8 flex flex-col space-y-10 pt-8 lg:pt-0">
                
                {/* Terminal Bio */}
                <div className="bg-black/60 border border-gray-700 rounded p-4 relative overflow-hidden group hover:border-gray-500 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-6 bg-gray-800 flex items-center px-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-[10px] text-gray-400 font-mono">user@young-mainframe:~/bio.txt</span>
                    </div>
                    <div className="mt-6 font-mono text-sm md:text-base text-neon-green/90 leading-relaxed">
                       <span className="text-neon-pink mr-2">➜</span>
                       <TypewriterText text="Hello, World. 我是 Young。專注於打造高併發、高效能演算法、自動化流程、全端服務及微服務，並將 AI/ML 深度整合至系統架構中，並擅長 k8s 叢集、CI/CD 與雲端架構至落地；以精準工程提升系統效能與擴展性為核心。或以 Python & Go 構建低延遲服務、使用 Kafka 打造高吞吐事件流平台，或將 AI 模型導入生產環境。" />
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-50 transition-opacity">
                       <Terminal size={48} />
                    </div>
                </div>

                {/* Tech Stack HUD */}
                <div>
                   <SectionHeader icon={Cpu} title="NEURAL_SKILL_MATRIX" color="text-neon-blue" />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                      <AnimatedSkillBar name="Python / AI / PyTorch" level={98} color="bg-neon-yellow" delay={0} icon={Zap} />
                      <AnimatedSkillBar name="Rust (Systems)" level={85} color="bg-neon-red" delay={100} icon={Shield} />
                      <AnimatedSkillBar name="Go (Golang)" level={92} color="bg-neon-blue" delay={200} icon={Server} />
                      <AnimatedSkillBar name="PostgreSQL / Redis" level={90} color="bg-blue-400" delay={300} icon={Database} />
                      <AnimatedSkillBar name="DevOps / K8s / Docker" level={88} color="bg-neon-pink" delay={400} icon={Cloud} />
                      <AnimatedSkillBar name="System Architecture" level={82} color="bg-neon-green" delay={500} icon={Code} />
                   </div>
                </div>

                {/* Footer Decor */}
                <div className="flex items-center justify-between text-[10px] text-gray-600 font-orbitron border-t border-gray-800 pt-2 mt-auto">
                    <span>SECTOR 7 // TAIPEI</span>
                    <span>ID: 992-441-X</span>
                    <span>SYNC: 100%</span>
                </div>

            </div>
         </div>
         
         {/* Decorative Corners */}
         <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-blue rounded-tl-lg"></div>
         <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-pink rounded-tr-lg"></div>
         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-yellow rounded-bl-lg"></div>
         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green rounded-br-lg"></div>

      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const HoloAvatar = () => {
    return (
        <div className="relative w-48 h-48 group mx-auto lg:mx-0">
            {/* Rotating Rings */}
            <div className="absolute inset-0 border border-neon-blue/30 rounded-full animate-spin-slow border-dashed"></div>
            <div className="absolute inset-2 border border-neon-pink/30 rounded-full animate-spin-reverse-slow"></div>
            
            {/* Avatar Container */}
            <div className="absolute inset-4 rounded-full bg-gray-900 overflow-hidden border-2 border-gray-700 relative shadow-[0_0_30px_rgba(0,243,255,0.15)] group-hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] transition-shadow duration-500">
                {/* Image Placeholder */}
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <User size={80} className="text-gray-500 relative z-10 group-hover:text-white transition-colors" />
                </div>
                
                {/* Scanning Laser */}
                <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/80 shadow-[0_0_10px_#00f3ff] animate-scan opacity-0 z-20 pointer-events-none"></div>
                
                {/* Glitch Overlay */}
                <div className="absolute inset-0 bg-neon-blue/10 opacity-0 group-hover:opacity-100 animate-pulse z-10 mix-blend-overlay"></div>
            </div>
            
            {/* Floating Label */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border border-neon-blue px-3 py-1 rounded-sm z-30 shadow-[0_0_15px_rgba(0,243,255,0.3)] whitespace-nowrap">
                <span className="text-neon-blue text-[10px] font-bold font-orbitron tracking-widest">SYS_ADMIN</span>
            </div>
        </div>
    )
}

const SocialButton = ({ icon: Icon, label, color }: any) => (
    <button className={`flex-1 flex items-center justify-center gap-2 border border-gray-700 bg-black/50 py-3 text-gray-400 transition-all duration-300 group ${color}`}>
        <Icon size={16} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-orbitron tracking-widest hidden md:inline">{label}</span>
    </button>
)

const StatBox = ({ label, value, icon: Icon }: any) => (
    <div className="bg-gray-900/50 p-3 border border-gray-800 rounded flex items-center gap-3 hover:border-gray-600 hover:bg-gray-800 transition-colors">
        <div className="p-2 bg-black rounded border border-gray-700 text-neon-yellow shadow-[0_0_10px_rgba(255,230,0,0.1)]">
            <Icon size={18} />
        </div>
        <div>
            <div className="text-[10px] text-gray-500 font-orbitron">{label}</div>
            <div className="text-white font-bold font-rajdhani text-lg">{value}</div>
        </div>
    </div>
)

const SectionHeader = ({ icon: Icon, title, color }: any) => (
    <div className="flex items-center gap-3 mb-4">
        <Icon className={color} size={20} />
        <h3 className={`font-orbitron font-bold tracking-widest ${color} drop-shadow-[0_0_5px_currentColor]`}>{title}</h3>
        <div className={`h-[1px] flex-grow bg-gradient-to-r from-${color.replace('text-', '')}/50 to-transparent`}></div>
    </div>
)

const AnimatedSkillBar = ({ name, level, color, delay, icon: Icon }: any) => {
    const [width, setWidth] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => setWidth(level), delay + 100);
        return () => clearTimeout(timer);
    }, [level, delay]);

    return (
        <div className="group">
            <div className="flex justify-between text-xs font-orbitron mb-2 text-gray-400 group-hover:text-white transition-colors">
                <div className="flex items-center gap-2">
                    <Icon size={12} className={color.replace('bg-', 'text-')} />
                    <span>{name}</span>
                </div>
                <span className="font-mono">{width}%</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-sm overflow-hidden relative">
                 {/* Grid pattern bg */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                 
                 {/* Fill Bar */}
                 <div 
                    className={`h-full ${color} relative transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]`}
                    style={{ width: `${width}%` }}
                 >
                     <div className="absolute right-0 top-0 h-full w-[1px] bg-white/50 shadow-[0_0_5px_white]"></div>
                 </div>
            </div>
        </div>
    )
}

const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(0, index + 1));
            index++;
            if (index > text.length) clearInterval(intervalId);
        }, 20); // Typing speed (fast)
        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <span>
            {displayedText}
            <span className="inline-block w-2 h-4 bg-neon-green ml-1 animate-blink align-middle"></span>
        </span>
    );
}
