import React, { useState, useEffect } from 'react';
import { Sparkles, Diamond } from 'lucide-react';

export const SapphireGemAccent = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto cursor-pointer group select-none"
      title="Sapphire Royal Crystal"
    >
      {/* Outer ambient sapphire glow rings */}
      <div className="absolute inset-0 rounded-full bg-blue-500/25 blur-2xl group-hover:bg-blue-400/40 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
      <div className="absolute -inset-2 rounded-full bg-amber-400/15 blur-xl group-hover:bg-amber-400/25 transition-all duration-700 pointer-events-none" />

      {/* 3D Prism Container */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `perspective(600px) rotateX(${rotate.y}deg) rotateY(${rotate.x}deg)`,
        }}
      >
        {/* Animated Crystalline Diamond Shape */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-900 via-sky-500 to-blue-700 p-1 shadow-2xl shadow-blue-600/40 transform rotate-45 group-hover:rotate-[50deg] transition-transform duration-500 border border-sky-300/60">
          {/* Inner crystal facet */}
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            {/* Center Crown/Diamond Symbol */}
            <div className="transform -rotate-45 flex flex-col items-center justify-center">
              <Diamond className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 mt-1 font-mono">
                ROYAL
              </span>
            </div>
          </div>
        </div>

        {/* Floating orbital spark points */}
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400/90 text-dark-950 text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
          ✨
        </div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-sky-400/90 text-dark-950 text-[8px] font-black flex items-center justify-center shadow-lg animate-pulse">
          💎
        </div>
      </div>
    </div>
  );
};
