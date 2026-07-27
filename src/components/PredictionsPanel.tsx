// src/components/PredictionsPanel.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, AlertCircle, Info, Database } from 'lucide-react';
import { rasis } from '../data/fallback-data';
import { RasiData } from '../types/astrology';
import { useAstrology } from '../hooks/useAstrology';
import FeedbackWidget from './FeedbackWidget';

// Helper function to render a highly stylized vector SVG representation of the Rasi Lord Planet
function getPlanetIcon(lord: string) {
  const cleanLord = lord.split(' ')[0].toLowerCase();
  
  if (cleanLord.includes('சூரியன்') || cleanLord.includes('sun')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] fill-current animate-spin" style={{ animationDuration: '30s' }}>
        <circle cx="50" cy="50" r="16" />
        <path d="M50,8 L50,22 M50,78 L50,92 M8,50 L22,50 M78,50 L92,50 M20,20 L31,31 M69,69 L80,80 M20,80 L31,69 M69,20 L80,31" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }
  if (cleanLord.includes('சந்திரன்') || cleanLord.includes('moon')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-yellow-100 drop-shadow-[0_0_8px_rgba(254,240,138,0.6)] fill-current">
        <path d="M72,25 C54,25 36,43 36,63 C36,75 42,85 50,90 C31,85 16,65 16,45 C16,25 31,10 50,5 C60,10 68,18 72,25 Z" />
        <circle cx="48" cy="22" r="2.5" fill="#FFF" className="opacity-40" />
      </svg>
    );
  }
  if (cleanLord.includes('செவ்வாய்') || cleanLord.includes('mars')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] fill-current">
        <circle cx="50" cy="50" r="20" />
        <path d="M50,10 L50,25 M35,17 L65,17" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M42,50 L58,50 M50,42 L50,58" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  if (cleanLord.includes('புதன்') || cleanLord.includes('mercury')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] fill-current">
        <circle cx="50" cy="50" r="18" />
        <path d="M33,18 C41,10 59,10 67,18" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <path d="M50,68 L50,85 M38,76 L62,76" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  if (cleanLord.includes('வியாழன்') || cleanLord.includes('jupiter')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] fill-current">
        <circle cx="50" cy="50" r="24" className="opacity-15" />
        <path d="M35,28 L65,28 L50,10 Z M50,28 L50,75 M36,60 L64,60" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <circle cx="50" cy="45" r="4.5" fill="#FFF" />
      </svg>
    );
  }
  if (cleanLord.includes('சுக்கிரன்') || cleanLord.includes('venus')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-teal-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.6)] fill-current">
        <path d="M50,12 L58,36 L84,36 L64,50 L72,74 L50,59 L28,74 L36,50 L16,36 L42,36 Z" />
        <circle cx="50" cy="46" r="3" className="text-red-950 fill-current" />
      </svg>
    );
  }
  if (cleanLord.includes('சனி') || cleanLord.includes('saturn')) {
    return (
      <svg viewBox="0 0 100 100" className="w-9 h-9 text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)] fill-current">
        <circle cx="50" cy="50" r="14" />
        <ellipse cx="50" cy="50" rx="38" ry="7.5" stroke="currentColor" strokeWidth="4.5" fill="none" transform="rotate(-15 50 50)" />
      </svg>
    );
  }

  // Default celestial stars
  return (
    <svg viewBox="0 0 100 100" className="w-9 h-9 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] fill-current">
      <path d="M50,15 L62,38 L88,38 L68,52 L76,78 L50,62 L24,78 L32,52 L12,38 L38,38 Z" />
    </svg>
  );
}

interface PredictionsPanelProps {
  selectedRasi: RasiData;
}

export default function PredictionsPanel({ selectedRasi }: PredictionsPanelProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'monthly' | 'guru' | 'sani' | 'raguketu' | 'newyear'>('today');
  const [newYearType, setNewYearType] = useState<'tamil' | 'english'>('tamil');

  // Core API binding hook logic
  const { prediction, loading, error, provider, latencyMs, refetch } = useAstrology(
    selectedRasi.id,
    activeTab === 'newyear' ? (newYearType === 'tamil' ? 'tamilnewyear' : 'englishnewyear') : activeTab
  );

  return (
    <div className="lg:col-span-5 flex flex-col bg-slate-900/20 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl shadow-black/80 border-gold-traditional group hover:shadow-yellow-500/5 transition-all duration-300">
      
      {/* 1. SELECTED RASI DETAILS HEADER */}
      <div className="p-4 bg-gradient-to-r from-red-950/50 to-slate-950/60 border-b border-red-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <span className="text-4.5xl sm:text-5xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-300">
            {selectedRasi.symbol}
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-gold-gradient drop-shadow-sm">
              {selectedRasi.name} ராசிபலன்கள்
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono mt-0.5 leading-none">
              {selectedRasi.englishName} Predictions
            </p>
          </div>
        </div>

        {/* Lord Planet Stylized Vector SVG Icon */}
        <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 bg-black/40 rounded-xl border border-red-900/25">
          {getPlanetIcon(selectedRasi.lord)}
        </div>
      </div>

      {/* 2. LORD / LUCKY NUMBERS STATS BANNER */}
      <div className="grid grid-cols-3 divide-x divide-red-900/20 bg-black/45 border-b border-red-900/20 text-center py-2 px-3">
        <div>
          <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider block">அதிபதி (Lord)</span>
          <span className="text-[11px] font-bold text-yellow-500/90">{selectedRasi.lord.split(' ')[0]}</span>
        </div>
        <div>
          <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider block">அதிர்ஷ்ட எண்</span>
          <span className="text-xs font-bold text-yellow-400 font-mono">{selectedRasi.luckyNumber}</span>
        </div>
        <div>
          <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider block">வண்ணம் (Color)</span>
          <span className="text-[11px] font-bold text-slate-100">{selectedRasi.luckyColor.split(' ')[0]}</span>
        </div>
      </div>

      {/* 3. TABS SELECTOR BAR */}
      <div className="flex bg-black/60 border-b border-red-900/10 overflow-x-auto scrollbar-none pr-2">
        {[
          { id: 'today', label: 'இன்று' },
          { id: 'weekly', label: 'வாரம்' },
          { id: 'monthly', label: 'மாதம்' },
          { id: 'guru', label: 'குரு' },
          { id: 'sani', label: 'சனி' },
          { id: 'raguketu', label: 'ராகு-கேது' },
          { id: 'newyear', label: 'புத்தாண்டு' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all duration-300 whitespace-nowrap leading-none ${
              activeTab === tab.id
                ? 'border-yellow-500 text-yellow-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. PREDICTIONS CORE TEXT AREA */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedRasi.id}-${activeTab}-${newYearType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4 flex-1 flex flex-col justify-center"
          >
            {/* New year sub-toggle */}
            {activeTab === 'newyear' && (
              <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-lg w-fit border border-red-950/20 mb-1">
                <button
                  onClick={() => setNewYearType('tamil')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    newYearType === 'tamil' ? 'bg-red-950 text-yellow-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  தமிழ் புத்தாண்டு
                </button>
                <button
                  onClick={() => setNewYearType('english')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    newYearType === 'english' ? 'bg-red-950 text-yellow-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ஆங்கிலப் புத்தாண்டு
                </button>
              </div>
            )}

            {/* A. LOADING STATE SKELETON */}
            {loading && (
              <div className="space-y-3 animate-pulse py-4">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-800 rounded w-11/12"></div>
              </div>
            )}

            {/* B. NETWORK ERROR STATE */}
            {error && !loading && (
              <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-2xl flex flex-col items-center text-center gap-3">
                <AlertCircle className="w-8 h-8 text-rose-500 animate-bounce" />
                <div>
                  <h5 className="text-xs font-bold text-slate-200">தரவுப் பிழை (Connection Error)</h5>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">{error}</p>
                </div>
                <button
                  onClick={refetch}
                  className="px-4 py-1.5 rounded-xl border border-red-950/50 hover:border-yellow-500/40 bg-red-950/40 hover:bg-red-950 text-yellow-500 hover:text-yellow-400 flex items-center gap-1.5 text-xs font-bold transition-all shadow-md mt-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>மீண்டும் முயற்சிக்கவும் (Retry)</span>
                </button>
              </div>
            )}

            {/* C. SUCCESS REVELATION (PREDICTION TEXT) */}
            {!loading && !error && (
              <div className="text-[13.5px] sm:text-[14.5px] leading-relaxed text-slate-200 text-justify relative">
                <span className="text-3xl text-yellow-500/25 absolute -top-4 -left-1 select-none font-serif font-bold">“</span>
                <p className="indent-4 font-sans leading-relaxed tracking-wide text-slate-100">
                  {prediction}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 5. USER SENTIMENT CAPTURE WIDGET */}
        {!loading && !error && (
          <FeedbackWidget 
            rasiId={selectedRasi.id} 
            predictionType={activeTab === 'newyear' ? (newYearType === 'tamil' ? 'tamilnewyear' : 'englishnewyear') : activeTab} 
          />
        )}

        {/* 6. TELEMETRY & SYSTEM DETAILS CAPTION */}
        <div className="border-t border-red-950/20 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold">
            <Info className="w-3.5 h-3.5 text-yellow-600" />
            Dinamalar.com காப்புரிமை
          </span>
          
          {/* Real-time server telemetry status tag */}
          {provider && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-black/40 border border-slate-900 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
              <Database className="w-3 h-3 text-yellow-500" />
              <span>{provider.replace('_', ' ')}</span>
              {latencyMs > 0 && <span>({latencyMs}ms)</span>}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
