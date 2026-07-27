'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Star, Sparkles, AlertTriangle, 
  Home as HomeIcon, CheckCircle2, X, Sun, Moon, Info 
} from 'lucide-react';
import { 
  rasis, panchangam, virathangal, vasthuDays, 
  kariNaatkal, getHoraiList, gowriPanchangamMonday 
} from '../data/fallback-data';
import { RasiData } from '../types/astrology';

// Import our reusable modular components
import PredictionsPanel from '../components/PredictionsPanel';
import ToolkitGrid from '../components/ToolkitGrid';

// Dynamically import the WebGL 3D Rasi Chakram with SSR disabled and a solar-loader fallback
const RasiChakram3D = dynamic(() => import('../components/RasiChakram3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] sm:h-[450px] flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm rounded-2xl border border-red-950/20">
      <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-yellow-500/80 font-bold tracking-wider animate-pulse font-sans text-sm">
        பிரபஞ்ச சக்கரம் ஏற்றப்படுகிறது...
      </span>
      <span className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
        Loading Cosmic 3D Wheel
      </span>
    </div>
  )
});

export default function Home() {
  // Master state: Currently active Rasi metadata (Aries as default)
  const [selectedRasi, setSelectedRasi] = useState<RasiData>(rasis[0]);
  const [activeTool, setActiveTool] = useState<string | null>(null); // Controls active overlay drawer
  const [horaiDay, setHoraiDay] = useState<string>('திங்கள்'); // Default day for Horai calculator

  const handleRasiSelect = (rasi: RasiData) => {
    setSelectedRasi(rasi);
    // Subtle touch feedback on compatible mobile devices
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  // Pre-calculated Horai List for active day
  const currentHoraiList = getHoraiList(horaiDay);

  // Weekdays in Tamil for the Horai selector
  const weekdaysTamil = [
    { eng: 'sunday', tamil: 'ஞாயிறு' },
    { eng: 'monday', tamil: 'திங்கள்' },
    { eng: 'tuesday', tamil: 'செவ்வாய்' },
    { eng: 'wednesday', tamil: 'புதன்' },
    { eng: 'thursday', tamil: 'வியாழன்' },
    { eng: 'friday', tamil: 'வெள்ளி' },
    { eng: 'saturday', tamil: 'சனி' }
  ];

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-b from-slate-950 via-slate-950 to-red-950/20 text-slate-100 selection:bg-yellow-500 selection:text-red-950 relative overflow-x-hidden">
      
      {/* 1. DEEP SPACE COSMIC BACKGROUND & CONSTELLATION LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Pulsing Nebulas */}
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-red-950/10 filter blur-[120px] nebula-glow-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[55vw] h-[55vw] rounded-full bg-amber-950/8 filter blur-[140px] nebula-glow-2" />
        
        {/* Sparkling Star Nodes & Constellations (Vector SVG Overlay) */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing connecting constellation lines */}
          <line x1="10%" y1="15%" x2="22%" y2="28%" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.2" className="animate-pulse" />
          <line x1="22%" y1="28%" x2="18%" y2="46%" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.2" />
          <line x1="18%" y1="46%" x2="7%" y2="52%" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.2" className="animate-pulse" />
          <line x1="75%" y1="12%" x2="86%" y2="25%" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.2" />
          <line x1="86%" y1="25%" x2="80%" y2="44%" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.2" className="animate-pulse" />
          <line x1="80%" y1="44%" x2="92%" y2="60%" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.2" />

          {/* Glowing static/twinkling star dots */}
          <circle cx="10%" cy="15%" r="2" fill="#F59E0B" className="star-twinkle-fast" />
          <circle cx="22%" cy="28%" r="3.5" fill="#FEF08A" className="star-twinkle-slow" />
          <circle cx="18%" cy="46%" r="2" fill="#F59E0B" className="star-twinkle-fast" />
          <circle cx="7%" cy="52%" r="1.5" fill="#FFF" className="opacity-40" />
          <circle cx="75%" cy="12%" r="3" fill="#F59E0B" className="star-twinkle-slow" />
          <circle cx="86%" cy="25%" r="1.5" fill="#FFF" className="opacity-50" />
          <circle cx="80%" cy="44%" r="4" fill="#FEF08A" className="star-twinkle-fast" />
          <circle cx="92%" cy="60%" r="2.5" fill="#F59E0B" className="star-twinkle-slow" />
        </svg>
      </div>

      {/* 2. BRAND HEADER */}
      <header className="w-full bg-gradient-to-b from-red-950/80 to-transparent border-b border-red-900/30 backdrop-blur-md sticky top-0 z-45 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Main brand logo: sharing the exact same Ganesha-Sun logo as the 3D Chakram center */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-red-800 to-red-950 border border-yellow-400 flex items-center justify-center shadow-md shadow-red-950/50">
              <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 fill-current animate-pulse">
                <path d="M50,15 L53,35 L70,20 L60,40 L80,35 L65,48 L85,55 L65,58 L78,75 L58,63 L65,83 L51,68 L50,85 L49,68 L35,83 L42,63 L22,75 L35,58 L15,55 L35,48 L20,35 L40,40 L30,20 L47,35 Z M50,30 C39,30 30,39 30,50 C30,61 39,70 50,70 C61,70 70,61 70,50 C70,39 61,30 50,30 Z" />
                <circle cx="50" cy="50" r="10" className="text-red-800 fill-current" />
              </svg>
            </div>
            
            {/* Title text */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-wide leading-none text-gold-gradient drop-shadow-md">
                தினமலர் ஜோதிடம்
              </h1>
              <p className="text-[10px] text-yellow-500/80 tracking-widest font-mono font-bold uppercase mt-0.5 sm:mt-1 leading-none">
                Dinamalar Astrology
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden md:flex items-center gap-6 bg-red-950/40 px-4 py-2 rounded-xl border border-red-900/30">
            <div className="text-right">
              <div className="text-[12px] text-yellow-500 font-semibold">{panchangam.tamilDate}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">கௌரி பஞ்சாங்கம் - நல்ல நேரம் இன்று</div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>
      </header>

      {/* 3. MAIN PREDICTION DISPLAY GRID */}
      <div className="max-w-6xl mx-auto px-4 mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* HERO SECTION: 3D Rasi Palan Chakram Stage (Span 7) */}
        <div className="lg:col-span-7 bg-slate-900/20 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col items-center justify-center p-3 sm:p-5 relative shadow-xl shadow-black/80 border-gold-traditional">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-red-950/5 pointer-events-none" />
          
          <div className="w-full flex items-center justify-between mb-2 px-2 z-10">
            <span className="text-[11px] sm:text-[12px] bg-red-950/60 text-yellow-500 border border-red-900/40 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              த்ரிடி பிரபஞ்ச சக்கரம் (3D Cosmic Wheel)
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
              Drag to spin
            </span>
          </div>

          {/* 3D WebGL Canvas Loader/Wrapper */}
          <RasiChakram3D onSelectRasi={handleRasiSelect} selectedRasiId={selectedRasi.id} />

          {/* Quick Rasi Selector List for accessibility and fast desktop clicks */}
          <div className="w-full border-t border-slate-900/40 pt-4 mt-2 z-10">
            <div className="text-[11px] text-yellow-500/80 font-bold uppercase tracking-wider mb-2 text-center">
              விரைவுத் தேர்வு (Quick Select Rasi)
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 max-h-20 overflow-y-auto pr-1">
              {rasis.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRasiSelect(r)}
                  className={`px-3 py-1 text-xs rounded-lg border font-semibold transition-all duration-300 flex items-center gap-1 ${
                    selectedRasi.id === r.id
                      ? 'bg-red-950 border-yellow-400 text-yellow-400 shadow-md font-bold scale-105'
                      : 'bg-black/40 border-slate-900 hover:border-red-900/40 hover:bg-red-950/20 text-slate-300'
                  }`}
                >
                  <span className="text-sm">{r.symbol}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* REUSABLE PREDICTIONS PANEL WITH ASYNC DATA BINDING (Span 5) */}
        <PredictionsPanel selectedRasi={selectedRasi} />

      </div>

      {/* 4. REUSABLE INTERACTIVE ASTROLOGICAL TOOLKIT GRID */}
      <div className="max-w-6xl mx-auto px-4 mt-4 sm:mt-6">
        <ToolkitGrid selectedRasi={selectedRasi} onOpenTool={setActiveTool} />
      </div>

      {/* 5. SECURE DETAILS OVERLAY (SLIDE-UP DRAWER) */}
      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
            {/* Backdrop click close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTool(null)}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Slider Sheet */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full sm:max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-t sm:border rounded-t-3xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col relative z-10 border-gold-traditional"
            >
              {/* Overlay Header */}
              <div className="p-4 sm:p-5 border-b border-red-900/30 bg-gradient-to-r from-red-950/50 to-transparent flex items-center justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gold-gradient font-sans tracking-wide">
                    {activeTool === 'panchangam' && 'தினசரி பஞ்சாங்கம் (Daily Panchangam)'}
                    {activeTool === 'horai' && 'கிரக ஹோரை கணிப்பான் (Graha Horai Calculator)'}
                    {activeTool === 'gowri' && 'கௌரி பஞ்சாங்கம் (Gowri Panchangam)'}
                    {activeTool === 'muhurtham' && `${selectedRasi.name} சுப முகூர்த்த நாட்கள்`}
                    {activeTool === 'viratham' && 'முக்கிய விரதங்கள் (Important Viratham Days)'}
                    {activeTool === 'vasthu' && 'வாஸ்து நாட்கள் நாட்காட்டி (Vasthu Days)'}
                    {activeTool === 'karinaal' && 'கரி நாட்கள் எச்சரிக்கை (Inauspicious Kari Naal)'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider mt-0.5">
                    Dinamalar Traditional Astrology Data
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveTool(null)}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-red-950 border border-red-900/30 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Overlay Content Area (Scrollable) */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                
                {/* TOOL 1: PANCHANGAM CONTENT */}
                {activeTool === 'panchangam' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 bg-black/40 border border-slate-900 p-4 rounded-2xl">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">தமிழ் தேதி (Tamil Date)</span>
                        <span className="text-sm font-bold text-slate-100">{panchangam.tamilDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">ஆங்கில தேதி (English Date)</span>
                        <span className="text-sm font-mono font-bold text-yellow-500">{panchangam.date}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: 'திதி (Thithi)', desc: panchangam.thithi, color: 'text-amber-400' },
                        { title: 'நட்சத்திரம் (Nakshatram)', desc: panchangam.nakshatram, color: 'text-amber-400' },
                        { title: 'யோகம் (Yogam)', desc: panchangam.yogam, color: 'text-slate-200' },
                        { title: 'கரணம் (Karanam)', desc: panchangam.karanam, color: 'text-slate-200' },
                        { title: 'ராகு காலம் (Rahu Kalam)', desc: panchangam.rahuKalam, color: 'text-red-400 font-mono' },
                        { title: 'எமகண்டம் (Yamagandam)', desc: panchangam.yamagandam, color: 'text-red-400 font-mono' },
                        { title: 'குளிகை (Gulikai)', desc: panchangam.gulikai, color: 'text-teal-400 font-mono' },
                        { title: 'நல்ல நேரம் (Auspicious Time)', desc: panchangam.nallaNeram, color: 'text-emerald-400' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-red-950/20 flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-semibold">{item.title}</span>
                          <span className={`text-xs font-bold text-right ${item.color}`}>{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL 2: GRAHA HORAI CONTENT (DYNAMIC CALCULATOR) */}
                {activeTool === 'horai' && (
                  <div className="space-y-4">
                    {/* Day Selector Buttons */}
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-black/60 rounded-xl border border-slate-900 justify-center">
                      {weekdaysTamil.map((day) => (
                        <button
                          key={day.eng}
                          onClick={() => setHoraiDay(day.tamil)}
                          className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${
                            horaiDay === day.tamil
                              ? 'bg-gradient-to-r from-red-900 to-red-950 text-yellow-400 border border-yellow-500/30 shadow-md'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {day.tamil}
                        </button>
                      ))}
                    </div>

                    {/* Explanatory Banner */}
                    <div className="bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10 text-xs text-yellow-500/90 leading-relaxed flex items-start gap-2.5">
                      <Sun className="w-4 h-4 mt-0.5 shrink-0 animate-spin" />
                      <span>
                        தேர்ந்தெடுக்கப்பட்ட கிழமையின் சூரிய உதயம் (காலை 6:00 மணி) முதல் தொடங்கும் பகல் நேர கிரக ஓரைகள் கீழே பட்டியலிடப்பட்டுள்ளன. 
                        <strong> பச்சை (நன்மை), மஞ்சள் (சமநிலை), சிவப்பு (தவிர்க்கவும்)</strong> குறியீடுகள் அவற்றின் பலனைக் காட்டுகின்றன.
                      </span>
                    </div>

                    {/* Horai list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
                      {currentHoraiList.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                            item.status === 'good'
                              ? 'bg-emerald-950/20 border-emerald-900/30 hover:bg-emerald-950/30'
                              : item.status === 'bad'
                              ? 'bg-rose-950/20 border-rose-900/30 hover:bg-rose-950/30'
                              : 'bg-slate-950/60 border-slate-900 hover:bg-slate-950/80'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-mono font-bold text-slate-300 block">{item.time}</span>
                            <span className="text-[10px] text-slate-500">ஒரையின் நேரம் (Hour)</span>
                          </div>
                          
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <span className={`text-xs font-bold ${
                                item.status === 'good' ? 'text-emerald-400' : item.status === 'bad' ? 'text-rose-400' : 'text-yellow-400'
                              }`}>
                                {item.planet} ஓரை
                              </span>
                              <p className="text-[8.5px] text-slate-500">
                                {item.status === 'good' ? 'அதிசுபம்' : item.status === 'bad' ? 'அசுபம்' : 'சமநிலை'}
                              </p>
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              item.status === 'good' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : item.status === 'bad' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL 3: GOWRI PANCHANGAM CONTENT */}
                {activeTool === 'gowri' && (
                  <div className="space-y-4">
                    <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-xs text-amber-500/90 leading-relaxed flex items-start gap-2.5">
                      <Sun className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        திங்கட்கிழமைகளில் வரக்கூடிய பாரம்பரிய கௌரி பஞ்சாங்கம் (பகல் பொழுது) நல்ல நேரக் கணக்கீடுகள் கீழே கொடுக்கப்பட்டுள்ளது.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {gowriPanchangamMonday.map((item, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            item.status === 'good'
                              ? 'bg-emerald-950/20 border-emerald-900/30'
                              : 'bg-rose-950/20 border-rose-900/30'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-mono font-bold text-slate-300 block">{item.time}</span>
                            <span className="text-[10px] text-slate-500">கௌரி நேரம் (Gowri Time)</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-bold ${item.status === 'good' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {item.gowri.split(' ')[0]}
                            </span>
                            <p className="text-[8.5px] text-slate-500">
                              {item.status === 'good' ? 'உகந்த நேரம்' : 'விலக்கவும்'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL 4: SUBHA MUHURTHAM CONTENT */}
                {activeTool === 'muhurtham' && (
                  <div className="space-y-4">
                    <div className="bg-red-950/50 p-4 rounded-2xl border border-red-900/30 flex items-center gap-3">
                      <span className="text-4xl">{selectedRasi.symbol}</span>
                      <div>
                        <h5 className="text-sm font-bold text-yellow-400 font-sans">{selectedRasi.name} ராசிக்காரர்களுக்கான முகூர்த்தங்கள்</h5>
                        <p className="text-xs text-slate-400 mt-1">கீழே குறிப்பிடப்பட்டுள்ள திருமண மற்றும் சுபகாரிய முகூர்த்த நாட்கள் இந்த ராசிக்கு மிகவும் உகந்தது.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedRasi.subhaMuhurtham.map((date, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-red-950/20 flex items-center justify-between hover:border-yellow-500/30 transition-all group">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-950 text-yellow-500 border border-red-900/30 flex items-center justify-center text-xs font-bold font-mono">
                              0{idx + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-100 group-hover:text-yellow-400 transition-colors">{date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold bg-black/40 px-3 py-1 rounded-full border border-slate-900">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>ஆவணி/புரட்டாசி மாத சுபமுகூர்த்தம்</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL 5: VIRATHAM CONTENT */}
                {activeTool === 'viratham' && (
                  <div className="space-y-3">
                    {virathangal.map((v, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-red-950/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-yellow-400 font-sans">{v.name}</span>
                          <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-900/30 px-2.5 py-0.5 rounded-full">
                            {v.date}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{v.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TOOL 6: VASTHU DAYS CONTENT */}
                {activeTool === 'vasthu' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-950/10 p-3 rounded-xl border border-emerald-900/20 text-xs text-emerald-400 leading-relaxed">
                      புதிதாக வீடு கட்டுபவர்கள் மற்றும் பூமி பூஜை போடுபவர்கள் வாஸ்து புருஷன் விழித்திருக்கும் கீழ்க்கண்ட சுப நேரங்களைத் தேர்வு செய்ய உகந்தது.
                    </div>

                    <div className="space-y-3">
                      {vasthuDays.map((v, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-red-950/20 space-y-3">
                          <div className="flex items-center justify-between border-b border-red-950/10 pb-2">
                            <span className="text-xs text-yellow-500 font-bold font-sans">வாஸ்து நாள் - {v.tamilMonth}</span>
                            <span className="text-xs font-mono text-slate-400 font-semibold">{v.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-lg w-fit border border-emerald-900/30 font-sans">
                            <Clock className="w-4 h-4" />
                            <span>நல்ல நேரம்: {v.time}</span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{v.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL 7: KARI NAAL CONTENT */}
                {activeTool === 'karinaal' && (
                  <div className="space-y-4">
                    <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-900/30 text-xs text-rose-400 leading-relaxed flex items-start gap-2.5">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                      <span>
                        <strong>எச்சரிக்கை:</strong> ஜோதிட சாஸ்திரப்படி கரி நாட்கள் என்பது சுப காரியங்களைத் தொடங்குவதற்கு உகந்ததாக கருதப்படுவதில்லை. 
                        இங்கு பட்டியலிடப்பட்டுள்ள தேதிகளில் புதிய தொழில், பயணம், அல்லது திருமணம் சார்ந்த விவாதங்களைத் தவிர்ப்பது நல்லது.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {kariNaatkal.map((date, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-rose-950/10 flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                          <span className="text-xs font-bold text-slate-200">{date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Overlay Footer */}
              <div className="p-4 border-t border-slate-900/40 bg-black/40 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Dinamalar Astrology • Tamil Traditional Calculations
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
