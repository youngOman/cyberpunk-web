import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  color?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", color = "text-white", as: Tag = 'span' }) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <Tag className={`relative z-10 ${color} font-orbitron tracking-wider block`}>
        {text}
      </Tag>
      {/* Layer 1: Cyan Shift */}
      <Tag 
        className={`glitch-layer glitch-anim-1 text-neon-blue opacity-70 mix-blend-screen font-orbitron tracking-wider pointer-events-none`} 
        aria-hidden="true"
      >
        {text}
      </Tag>
      {/* Layer 2: Pink Shift */}
      <Tag 
        className={`glitch-layer glitch-anim-2 text-neon-pink opacity-70 mix-blend-screen font-orbitron tracking-wider pointer-events-none`} 
        aria-hidden="true"
      >
        {text}
      </Tag>
    </div>
  );
};