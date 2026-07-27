// src/components/PlanetStatusWidget.tsx

import React from 'react';
import { Compass, Sparkles, Activity, AlertCircle } from 'lucide-react';
import { defaultPlanetPlacements } from '../data/fallback-data';

/**
 * Premium Astrological Planet Status and Strength Table.
 * Renders complete coordinates, nakshatram padhas, and progress-bar strengths for all 9 celestial bodies.
 */
export default function PlanetStatusWidget() {
  return (
    <div className="bg-slate-900/35 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-red-900/15 shadow-xl shadow-black/80 space-y-4 group hover:border-yellow-500/25 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-950/25 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-yellow-400 tracking-wide font-sans">கிரகங்களின் பலம் & நிலைகள் (Planet Positions & Strength)</h4>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Real-time Planet Status Metrics</p>
          </div>
        </div>
        <span className="text-[10px] text-yellow-500 bg-red-950/50 border border-yellow-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          9 BODIES ACTIVE
        </span>
      </div>

      {/* Grid Table Container */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-900/60 text-slate-500 uppercase tracking-widest font-mono text-[9px]">
              <th className="py-2.5 px-3">கிரகம் (Planet)</th>
              <th className="py-2.5 px-3">ராசி (Zodiac Sign)</th>
              <th className="py-2.5 px-3">பாகை (Degree)</th>
              <th className="py-2.5 px-3">நட்சத்திரம் (Star & Padha)</th>
              <th className="py-2.5 px-3">ஆட்சி / உச்சம் (Dignity)</th>
              <th className="py-2.5 px-3 text-right">பலம் (Strength)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-950/10">
            {defaultPlanetPlacements.map((planet) => {
              const isLagna = planet.name.includes('லக்னம்');
              
              return (
                <tr 
                  key={planet.name} 
                  className="hover:bg-red-950/10 transition-colors duration-200 group/row"
                >
                  {/* Planet Name */}
                  <td className="py-3 px-3 font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-sm">
                      {planet.name.includes('சூரியன்') ? '☀️' : 
                       planet.name.includes('சந்திரன்') ? '🌙' : 
                       planet.name.includes('செவ்வாய்') ? '🔴' : 
                       planet.name.includes('புதன்') ? '🟢' : 
                       planet.name.includes('வியாழன்') ? '👑' : 
                       planet.name.includes('சுக்கிரன்') ? '🌟' : 
                       planet.name.includes('சனி') ? '🪐' : '⭐'}
                    </span>
                    <span className="font-sans leading-none">{planet.name}</span>
                    {planet.isRetrograde && (
                      <span className="text-[9px] bg-amber-950 border border-amber-500/40 text-amber-400 font-bold font-mono px-1 rounded" title="Retrograde (வக்ரம்)">
                        R
                      </span>
                    )}
                  </td>

                  {/* Zodiac Sign */}
                  <td className="py-3 px-3 text-slate-300 font-semibold">{planet.sign}</td>

                  {/* Degree Placement */}
                  <td className="py-3 px-3 text-yellow-500/90 font-mono font-bold">{planet.degree}</td>

                  {/* Nakshatram and Padha */}
                  <td className="py-3 px-3">
                    <span className="text-slate-200 font-bold font-sans">{planet.nakshatram}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold ml-1">({planet.padha}-ஆம் பாதம்)</span>
                  </td>

                  {/* Dignity / Status */}
                  <td className="py-3 px-3 font-semibold">
                    <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase ${
                      planet.status === 'Exalted' ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' :
                      planet.status === 'Own Sign' ? 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-400' :
                      planet.status === 'Friendly' ? 'bg-teal-950/60 border border-teal-500/30 text-teal-400' :
                      planet.status === 'Debilitated' || planet.status === 'Enemy' ? 'bg-rose-950/60 border border-rose-500/30 text-rose-400' :
                      'bg-slate-950/60 border border-slate-700/30 text-slate-400'
                    }`}>
                      {planet.status}
                    </span>
                  </td>

                  {/* Planet Strength Progress Bar */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-16 sm:w-20 bg-slate-950/50 h-1.5 rounded-full border border-slate-900 overflow-hidden relative shadow-inner">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${planet.strength}%`,
                            background: isLagna ? 'linear-gradient(to right, #3B82F6, #10B981)' : 'linear-gradient(to right, #D97706, #F59E0B)',
                            boxShadow: `0 0 4px ${isLagna ? '#10B981' : '#F59E0B'}`
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold font-mono text-slate-100 min-w-8">
                        {planet.strength}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
