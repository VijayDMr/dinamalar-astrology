// src/components/ToolkitGrid.tsx

import React from 'react';
import { Calendar, Clock, Sun, CheckCircle2, Star, Home as HomeIcon, AlertTriangle } from 'lucide-react';
import { RasiData } from '../types/astrology';

interface ToolkitGridProps {
  selectedRasi: RasiData;
  onOpenTool: (toolId: string) => void;
}

/**
 * Reusable Astrological Toolkit Card Grid.
 * Lists the 7 major secondary utilities as beautiful card buttons.
 */
export default function ToolkitGrid({ selectedRasi, onOpenTool }: ToolkitGridProps) {
  
  const tools = [
    {
      id: 'panchangam',
      title: 'தினசரி பஞ்சாங்கம்',
      english: 'Daily Panchangam',
      tag: 'ஆடி 11',
      icon: <Calendar className="w-5 h-5" />,
      colorClass: 'text-yellow-500 bg-yellow-500/10 group-hover:bg-yellow-500/20'
    },
    {
      id: 'horai',
      title: 'கிரக ஹோரை',
      english: 'Graha Horai',
      tag: 'கணிப்பான்',
      icon: <Clock className="w-5 h-5" />,
      colorClass: 'text-orange-500 bg-orange-500/10 group-hover:bg-orange-500/20'
    },
    {
      id: 'gowri',
      title: 'கௌரி பஞ்சாங்கம்',
      english: 'Gowri Panchangam',
      tag: 'நல்ல நேரம்',
      icon: <Sun className="w-5 h-5" />,
      colorClass: 'text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/20'
    },
    {
      id: 'muhurtham',
      title: 'சுப முகூர்த்தம்',
      english: 'Subha Muhurtham',
      tag: selectedRasi.name,
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: 'text-rose-500 bg-rose-500/10 group-hover:bg-rose-500/20'
    },
    {
      id: 'viratham',
      title: 'முக்கிய விரதங்கள்',
      english: 'Viratham Days',
      tag: 'நோன்புகள்',
      icon: <Star className="w-5 h-5" />,
      colorClass: 'text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/20'
    },
    {
      id: 'vasthu',
      title: 'வாஸ்து நாட்கள்',
      english: 'Vasthu Days',
      tag: 'மனைப் பூஜை',
      icon: <HomeIcon className="w-5 h-5" />,
      colorClass: 'text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/20'
    },
    {
      id: 'karinaal',
      title: 'கரி நாட்கள்',
      english: 'Kari Naal',
      tag: 'தவிர்க்கவும்',
      icon: <AlertTriangle className="w-5 h-5" />,
      colorClass: 'text-red-500 bg-red-500/10 group-hover:bg-red-500/20'
    }
  ];

  return (
    <section className="mt-8 relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-5 bg-red-800 rounded-sm" />
        <h3 className="text-lg sm:text-xl font-bold text-yellow-500 font-sans tracking-wide">
          ஜோதிட உபகரணங்கள் (Interactive Astrological Toolkit)
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onOpenTool(tool.id)}
            className="bg-gradient-to-b from-slate-900/60 to-slate-950/80 hover:to-red-950/20 border border-slate-900 hover:border-yellow-500/40 p-3 sm:p-4 rounded-2xl text-center flex flex-col items-center justify-between gap-2.5 group transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5 hover:-translate-y-1"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${tool.colorClass}`}>
              {tool.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{tool.title}</div>
              <p className="text-[9px] text-slate-500 mt-0.5 leading-none font-mono font-semibold uppercase">{tool.english}</p>
            </div>
            <span className="text-[10px] font-bold text-slate-300 bg-red-950/40 border border-red-900/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {tool.tag}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
