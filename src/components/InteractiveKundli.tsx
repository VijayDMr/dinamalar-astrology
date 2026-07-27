'use client';

// src/components/InteractiveKundli.tsx

import React, { useState, useRef } from 'react';
import { Eye, HelpCircle, Download, Printer, Layers, Compass, Sparkles } from 'lucide-react';
import { PlanetStatus } from '../types/astrology';
import { defaultPlanetPlacements } from '../data/fallback-data';

const houseMeaningsTamil: Record<number, { title: string; desc: string }> = {
  1: { title: '1-ஆம் வீடு (லக்னம் - சரீரம்)', desc: 'உடல் ஆரோக்கியம், தோற்றம், குணம், சுய சிந்தனை மற்றும் ஆயுள் பலம்.' },
  2: { title: '2-ஆம் வீடு (தனம், வாக்கு, குடும்பம்)', desc: 'குடும்ப அமைதி, அசையாச் சொத்துக்கள், வாக்கு வன்மை, வலது கண் மற்றும் வருவாய் யோகம்.' },
  3: { title: '3-ஆம் வீடு (சகோதரம், வீரியம்)', desc: 'மன தைரியம், இளைய சகோதர உறவுகள், குறுகிய பயணங்கள், முயற்சி மற்றும் கலை ஆர்வம்.' },
  4: { title: '4-ஆம் வீடு (சுகம், மாத்ரு பாவம்)', desc: 'தாய் வழி சுகம், சொந்த வீடு, சொகுசு வாகன யோகம், உயர்கல்வி மற்றும் மன நிம்மதி.' },
  5: { title: '5-ஆம் வீடு (பூர்வ புண்ணியம், புத்திர யோகம்)', desc: 'புத்திர பாக்கியம், பூர்வ புண்ணிய யோகம், கலைத்துறை ஈடுபாடு, காதல் மற்றும் நுண் அறிவு.' },
  6: { title: '6-ஆம் வீடு (ருண, ரோக, சத்ரு)', desc: 'கடன் தொல்லைகள், உடல் உபாதைகள், எதிரிகள் கட்டுப்பாடு, போட்டி தேர்வுகள் மற்றும் உத்தியோக வெற்றி.' },
  7: { title: '7-ஆம் வீடு (களத்திரம், கூட்டாளி)', desc: 'திருமண வாழ்க்கை, வாழ்க்கைத்துணையின் குணம், கூட்டுத் தொழில் வியாபாரம், மற்றும் மக்கள் தொடர்பு.' },
  8: { title: '8-ஆம் வீடு (ஆயுள், அஷ்டம பாவம்)', desc: 'ஆயுள் ஆயுள் பலம், எதிர்பாராத விபத்துக்கள், காப்பீடு தொகைகள், மற்றும் மறைமுக ஞானம்.' },
  9: { title: '9-ஆம் வீடு (பாக்ய பாவம், தந்தை)', desc: 'தந்தையின் நற்பலன்கள், நீண்ட ஆன்மீகப் பயணங்கள், வெளிநாட்டு யோகம், மற்றும் அதிர்ஷ்ட வாய்ப்புகள்.' },
  10: { title: '10-ஆம் வீடு (ஜீவனம், கர்ம பாவம்)', desc: 'செய்யும் தொழில், உத்தியோகம், சமூக கௌரவம், ஆட்சி அதிகாரம், மற்றும் உழைப்பு உயர்வு.' },
  11: { title: '11-ஆம் வீடு (லாப பாவம்)', desc: 'தொழில் லாபங்கள், மூத்த சகோதரர் ஆதரவு, நீண்ட கால ஆசைகள் நிறைவேறுதல், மற்றும் வெற்றிகள்.' },
  12: { title: '12-ஆம் வீடு (விரயம், மோட்ச பாவம்)', desc: 'அயன சயன சுகம், வெளிநாட்டு யோகம், சுப விரயங்கள், மருத்துவச் செலவுகள், மற்றும் ஆன்மீக மோட்சம்.' }
};

export default function InteractiveKundli() {
  const [chartStyle, setChartStyle] = useState<'south' | 'north'>('south');
  const [selectedHouse, setSelectedRasiHouse] = useState<number | null>(1);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetStatus | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Group planets by their respective houses for easy chart rendering
  const planetsByHouse = React.useMemo(() => {
    const map: Record<number, PlanetStatus[]> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    defaultPlanetPlacements.forEach(p => {
      map[p.house].push(p);
    });
    return map;
  }, []);

  const handleHouseClick = (houseNo: number) => {
    setSelectedRasiHouse(houseNo);
  };

  // Convert SVG container directly into a downloadable PNG asset
  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const DOMURL = window.URL || window.webkitURL || window;
    const blobURL = DOMURL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#06020a'; // Premium background matching body gradient
        context.fillRect(0, 0, 600, 600);
        context.drawImage(image, 0, 0, 600, 600);
        
        const pngURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngURL;
        downloadLink.download = `Astrology_Chart_${chartStyle.toUpperCase()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      DOMURL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. South Indian 4x4 Grid coordinates builder
  const renderSouthIndianGrid = () => {
    // Row/Col maps to South Indian Rasis clockwise:
    // House 12 is top-left corner (Meenam), but let's map houses logically.
    // In South Indian Chart:
    // Row 1: Meenam (12), Mesham (1), Rishabam (2), Mithunam (3)
    // Row 2: Kumbam (11), [Center 2x2], Kadagam (4)
    // Row 3: Magaram (10), [Center 2x2], Simmam (5)
    // Row 4: Dhanusu (9), Viruchigam (8), Thulaam (7), Kanni (6)
    const gridPositions = [
      { rasiId: 'mesham', rasiName: 'மேஷம் (Aries)', x: 1, y: 0, house: 1 },
      { rasiId: 'rishabam', rasiName: 'ரிஷபம் (Taurus)', x: 2, y: 0, house: 2 },
      { rasiId: 'mithunam', rasiName: 'மிதுனம் (Gemini)', x: 3, y: 0, house: 3 },
      { rasiId: 'kadagam', rasiName: 'கடகம் (Cancer)', x: 3, y: 1, house: 4 },
      { rasiId: 'simmam', rasiName: 'சிம்மம் (Leo)', x: 3, y: 2, house: 5 },
      { rasiId: 'kanni', rasiName: 'கன்னி (Virgo)', x: 3, y: 3, house: 6 },
      { rasiId: 'thulaam', rasiName: 'துலாம் (Libra)', x: 2, y: 3, house: 7 },
      { rasiId: 'viruchigam', rasiName: 'விருச்சிகம் (Scorpio)', x: 1, y: 3, house: 8 },
      { rasiId: 'dhanusu', rasiName: 'தனுசு (Sagittarius)', x: 0, y: 3, house: 9 },
      { rasiId: 'magaram', rasiName: 'மகரம் (Capricorn)', x: 0, y: 2, house: 10 },
      { rasiId: 'kumbam', rasiName: 'கும்பம் (Aquarius)', x: 0, y: 1, house: 11 },
      { rasiId: 'meenam', rasiName: 'மீனம் (Pisces)', x: 0, y: 0, house: 12 }
    ];

    const boxSize = 125; // 4x4 scale

    return (
      <g>
        {/* Draw outer borders */}
        <rect x="0" y="0" width="500" height="500" fill="none" stroke="rgba(217,119,6,0.5)" strokeWidth="3" />
        
        {/* Center medallion block */}
        <rect x="125" y="125" width="250" height="250" fill="rgba(10,3,15,0.85)" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5" />
        
        {/* Dynamic Center Medallion text info */}
        <text x="250" y="210" fill="#FEF08A" textAnchor="middle" className="text-[13px] font-bold tracking-widest font-mono">
          ஜாதக சக்கரம்
        </text>
        <text x="250" y="235" fill="rgba(156,163,175,0.7)" textAnchor="middle" className="text-[10px] uppercase font-semibold font-mono tracking-widest">
          {selectedHouse ? `HOUSE #${selectedHouse} ACTIVE` : 'CLICK TO CHOOSE HOUSE'}
        </text>
        <circle cx="250" cy="275" r="22" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
        <text x="250" y="280" fill="#F59E0B" textAnchor="middle" className="text-sm font-sans font-bold">
          ॐ
        </text>

        {/* Draw 12 Rasi grids */}
        {gridPositions.map((pos) => {
          const rx = pos.x * boxSize;
          const ry = pos.y * boxSize;
          const isHouseSelected = selectedHouse === pos.house;

          return (
            <g 
              key={pos.rasiId}
              onClick={() => handleHouseClick(pos.house)}
              className="cursor-pointer group"
            >
              {/* Outer boundary box */}
              <rect
                x={rx}
                y={ry}
                width={boxSize}
                height={boxSize}
                fill={isHouseSelected ? "rgba(127,29,29,0.35)" : "rgba(15,7,23,0.6)"}
                stroke={isHouseSelected ? "#F59E0B" : "rgba(217,119,6,0.25)"}
                strokeWidth={isHouseSelected ? "2.5" : "1.2"}
                className="transition-all duration-300 group-hover:fill-red-950/20"
              />

              {/* Rasi Index overlay */}
              <text
                x={rx + 12}
                y={ry + 20}
                fill={isHouseSelected ? "#F59E0B" : "rgba(156,163,175,0.4)"}
                className="text-[9.5px] font-bold font-mono tracking-wider"
              >
                H{pos.house}
              </text>

              {/* Rasi Name label */}
              <text
                x={rx + boxSize - 12}
                y={ry + 20}
                textAnchor="end"
                fill="rgba(156,163,175,0.6)"
                className="text-[8.5px] font-sans font-bold opacity-80"
              >
                {pos.rasiName.split(' ')[0]}
              </text>

              {/* Planets placed inside this house */}
              {planetsByHouse[pos.house].map((planet, pIdx) => {
                const px = rx + 20 + (pIdx % 2) * 50;
                const py = ry + 50 + Math.floor(pIdx / 2) * 32;

                return (
                  <g 
                    key={planet.name}
                    onPointerOver={() => setHoveredPlanet(planet)}
                    onPointerOut={() => setHoveredPlanet(null)}
                    className="cursor-help"
                  >
                    <rect
                      x={px - 6}
                      y={py - 12}
                      width={42}
                      height={20}
                      rx="4"
                      fill={planet.isRetrograde ? "rgba(120,53,4,0.4)" : "rgba(0,0,0,0.4)"}
                      stroke={planet.isRetrograde ? "#D97706" : "rgba(156,163,175,0.15)"}
                      strokeWidth="1"
                    />
                    <text
                      x={px + 15}
                      y={py + 2}
                      textAnchor="middle"
                      fill={planet.isRetrograde ? "#F59E0B" : "#FFF"}
                      className="text-[10px] font-bold font-mono tracking-wide"
                    >
                      {planet.name.split(' ')[1].substring(0, 3)}
                      {planet.isRetrograde && 'R'}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
    );
  };

  // 2. North Indian crossed-diagonal diamonds coordinates builder
  const renderNorthIndianGrid = () => {
    // Setup 12 diamond lines for North Indian Chart
    return (
      <g>
        {/* Draw outer bounds */}
        <rect x="0" y="0" width="500" height="500" fill="none" stroke="rgba(217,119,6,0.5)" strokeWidth="3" />
        
        {/* Crossed large diagonals */}
        <line x1="0" y1="0" x2="500" y2="500" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5" />
        <line x1="500" y1="0" x2="0" y2="500" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5" />
        
        {/* Inner rotated diamond */}
        <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5" />

        {/* Center OM Emblem */}
        <circle cx="250" cy="250" r="18" fill="rgba(6,2,10,0.9)" stroke="#D97706" strokeWidth="1" />
        <text x="250" y="254" fill="#F59E0B" textAnchor="middle" className="text-xs font-sans font-bold">ॐ</text>

        {/* North Indian Houses are mapped to geometric triangles/diamonds:
            Lagna (1st House) is the top central triangle.
            We will draw clickable text groups for houses 1 to 12. */}
        {[
          { house: 1, cx: 250, cy: 110, name: 'H1' },
          { house: 2, cx: 160, cy: 50, name: 'H2' },
          { house: 3, cx: 50, cy: 160, name: 'H3' },
          { house: 4, cx: 110, cy: 250, name: 'H4' },
          { house: 5, cx: 50, cy: 340, name: 'H5' },
          { house: 6, cx: 160, cy: 450, name: 'H6' },
          { house: 7, cx: 250, cy: 390, name: 'H7' },
          { house: 8, cx: 340, cy: 450, name: 'H8' },
          { house: 9, cx: 450, cy: 340, name: 'H9' },
          { house: 10, cx: 390, cy: 250, name: 'H10' },
          { house: 11, cx: 450, cy: 160, name: 'H11' },
          { house: 12, cx: 340, cy: 50, name: 'H12' },
        ].map((h) => {
          const isHouseSelected = selectedHouse === h.house;
          const planets = planetsByHouse[h.house];

          return (
            <g 
              key={h.house}
              onClick={() => handleHouseClick(h.house)}
              className="cursor-pointer group"
            >
              {/* Pulse backing for active house */}
              {isHouseSelected && (
                <circle cx={h.cx} cy={h.cy} r="32" fill="rgba(127,29,29,0.25)" className="animate-pulse" />
              )}

              {/* Label */}
              <text
                x={h.cx}
                y={h.cy - 12}
                textAnchor="middle"
                fill={isHouseSelected ? "#F59E0B" : "rgba(156,163,175,0.5)"}
                className="text-[10px] font-bold font-mono tracking-wider"
              >
                {h.name}
              </text>

              {/* Placed Planets inline block */}
              {planets.length > 0 ? (
                <g transform={`translate(${h.cx}, ${h.cy + 10})`}>
                  {planets.map((planet, pIdx) => {
                    const offset = (pIdx - (planets.length - 1) / 2) * 26;
                    return (
                      <text
                        key={planet.name}
                        x={offset}
                        y={0}
                        textAnchor="middle"
                        onPointerOver={() => setHoveredPlanet(planet)}
                        onPointerOut={() => setHoveredPlanet(null)}
                        fill={planet.isRetrograde ? "#F59E0B" : "#FFF"}
                        className="text-[9.5px] font-bold font-mono tracking-wide cursor-help"
                      >
                        {planet.name.split(' ')[1].substring(0, 2)}
                      </text>
                    );
                  })}
                </g>
              ) : (
                <text x={h.cx} y={h.cy + 10} textAnchor="middle" fill="rgba(156,163,175,0.2)" className="text-[8.5px] font-mono">
                  -
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 p-4 sm:p-5 bg-slate-900/35 backdrop-blur-md rounded-3xl border border-red-900/15 shadow-xl shadow-black/80">
      
      {/* 1. INTERACTIVE SVG CANVAS CHART (Span 7) */}
      <div className="md:col-span-7 flex flex-col items-center justify-between gap-4">
        
        {/* Top Controls Row */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-slate-900">
            <button
              onClick={() => setChartStyle('south')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                chartStyle === 'south' ? 'bg-red-950 text-yellow-400 border border-yellow-500/20 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>தென்னிந்திய முறை</span>
            </button>
            <button
              onClick={() => setChartStyle('north')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                chartStyle === 'north' ? 'bg-red-950 text-yellow-400 border border-yellow-500/20 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>வடஇந்திய முறை</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-black/50 border border-slate-900 hover:border-yellow-500/35 text-slate-400 hover:text-yellow-400 transition-colors shadow-sm"
              title="Print Birth Chart PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPNG}
              className="p-2 rounded-xl bg-black/50 border border-slate-900 hover:border-yellow-500/35 text-slate-400 hover:text-yellow-400 transition-colors shadow-sm"
              title="Download Chart PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Vector canvas */}
        <div className="w-full flex items-center justify-center max-w-[420px] aspect-square relative bg-gradient-to-br from-black/80 to-slate-950/90 rounded-2xl border border-red-900/10 p-4 shadow-inner shadow-black">
          <svg
            ref={svgRef}
            viewBox="0 0 500 500"
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(217,119,6,0.15)]"
          >
            {chartStyle === 'south' ? renderSouthIndianGrid() : renderNorthIndianGrid()}
          </svg>

          {/* Floated dynamic coordinate hover card */}
          {hoveredPlanet && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-yellow-500/40 p-2.5 rounded-xl shadow-lg shadow-black/80 text-xs animate-fade-in z-30">
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  {hoveredPlanet.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider font-semibold uppercase">
                  {hoveredPlanet.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1 text-[11px] text-slate-300">
                <div>இராசி: {hoveredPlanet.sign.split(' ')[0]}</div>
                <div className="font-mono">பாகை: {hoveredPlanet.degree}</div>
                <div>நட்சத்திரம்: {hoveredPlanet.nakshatram} ({hoveredPlanet.padha}-ஆம் பாதம்)</div>
                <div className="font-mono">வலிமை: {hoveredPlanet.strength}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SECURE HOUSE ANALYSIS DETAIL CARD (Span 5) */}
      <div className="md:col-span-5 flex flex-col justify-between bg-black/45 rounded-2xl border border-red-950/20 p-4 shadow-md h-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/5 to-transparent pointer-events-none rounded-2xl" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 border-b border-red-950/25 pb-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Eye className="w-4.5 h-4.5" />
            </div>
            <div>
              <h5 className="text-[13px] font-bold text-yellow-400 tracking-wide font-sans">வீட்டு பலன்கள் (House Analysis)</h5>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Interactive Astro Deep-Dive</p>
            </div>
          </div>

          {selectedHouse !== null ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-sm font-bold text-slate-100 block">{houseMeaningsTamil[selectedHouse].title}</span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">{houseMeaningsTamil[selectedHouse].desc}</p>
              </div>

              {/* Show placed planets in selected house */}
              <div>
                <span className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-wider block mb-2">இந்த வீட்டில் அமர்ந்த கிரகங்கள் (Planets Placed):</span>
                {planetsByHouse[selectedHouse].length > 0 ? (
                  <div className="space-y-2">
                    {planetsByHouse[selectedHouse].map((planet) => (
                      <div key={planet.name} className="p-2.5 bg-slate-950/60 rounded-xl border border-red-950/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{planet.name.includes('சூரியன்') ? '☀️' : planet.name.includes('சந்திரன்') ? '🌙' : planet.name.includes('செவ்வாய்') ? '🔴' : '🪐'}</span>
                          <div>
                            <span className="text-xs font-bold text-slate-200">{planet.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono block">{planet.nakshatram} ({planet.padha})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-yellow-500">{planet.degree}</span>
                          <span className="text-[9.5px] text-slate-500 block leading-none font-semibold uppercase">{planet.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-950/30 p-4 rounded-xl text-center border border-dashed border-red-950/15 text-xs text-slate-500 font-semibold uppercase">
                    கிரகங்கள் ஏதுமில்லை (Empty House)
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 h-48 border border-dashed border-red-950/15 rounded-xl bg-slate-950/20 text-slate-500 text-xs">
              <HelpCircle className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
              <span>சக்கரத்தில் ஏதேனும் ஒரு வீட்டைத் தேர்வு செய்க</span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-900/40 pt-3 mt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider relative z-10 text-center">
          Dinamalar Birth Chart Engine • 2026.7
        </div>
      </div>

    </div>
  );
}
