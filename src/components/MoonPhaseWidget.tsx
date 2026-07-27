// src/components/MoonPhaseWidget.tsx

import React from 'react';
import { Moon, Eye, Compass, Info } from 'lucide-react';

/**
 * Dynamic Moon Phase Visualizer Widget.
 * Renders a glowing, layered vector SVG moon showing waxing/waning crescent details based on daily thithi.
 */
export default function MoonPhaseWidget() {
  // Current moon state matching ஆடி 11 (Thuvadhasi, Waxing Gibbous phase)
  const moonPhaseName = "சுக்ல பட்ச துவாதசி (Waxing Gibbous)";
  const moonIllumination = 89; // Percentage illuminated
  const moonAgeDays = 11.4; // Days into lunar cycle

  return (
    <div className="bg-slate-900/35 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-red-900/15 shadow-xl shadow-black/80 flex flex-col justify-between h-full group hover:border-yellow-500/25 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-950/25 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <Moon className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-yellow-400 tracking-wide font-sans">சந்திர கலை (Moon Phase)</h4>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Lunar Luminescence Dial</p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#F59E0B]" />
      </div>

      {/* Center Lunar Graphics */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-28 h-24 flex items-center justify-center">
          
          {/* Swirling celestial stardust background */}
          <div className="absolute inset-0 rounded-full bg-yellow-500/5 blur-xl group-hover:bg-yellow-500/10 transition-colors duration-500" />
          
          {/* Detailed Glowing Vector Moon Phase */}
          <svg className="w-24 h-24 filter drop-shadow-[0_0_12px_rgba(254,240,138,0.35)] transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
            {/* Dark background circle (unilluminated side) */}
            <circle cx="50" cy="50" r="40" fill="#0c0717" stroke="rgba(217,119,6,0.15)" strokeWidth="1" />
            
            {/* Glowing Golden Gibbous Moon overlay mask */}
            <path
              d="M50,10 A40,40 0 0,1 50,90 A22,40 0 0,1 50,10"
              fill="url(#goldMoonGrad)"
            />
            
            {/* Craters details */}
            <circle cx="58" cy="30" r="3.5" fill="rgba(0,0,0,0.15)" />
            <circle cx="68" cy="42" r="2" fill="rgba(0,0,0,0.15)" />
            <circle cx="54" cy="55" r="4.5" fill="rgba(0,0,0,0.15)" />
            <circle cx="64" cy="65" r="3" fill="rgba(0,0,0,0.15)" />
            <circle cx="76" cy="56" r="2.5" fill="rgba(0,0,0,0.15)" />

            <defs>
              <linearGradient id="goldMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE0" />
                <stop offset="50%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Labels */}
        <div className="text-center mt-3 space-y-1">
          <span className="text-[13px] font-bold text-slate-100 font-sans tracking-wide block">
            {moonPhaseName}
          </span>
          <span className="text-[10px] text-yellow-500 font-mono tracking-wider font-semibold block leading-none">
            {moonIllumination}% ILLUMINATED
          </span>
        </div>
      </div>

      {/* Bottom stats footer */}
      <div className="border-t border-red-950/20 pt-2.5 mt-2 flex items-center justify-between text-[9.5px] text-slate-500 font-semibold font-mono tracking-wider">
        <span className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-yellow-600" />
          இராசி: விருச்சிகம்
        </span>
        <span className="text-[10px] text-yellow-600">AGE: {moonAgeDays}d</span>
      </div>

    </div>
  );
}
