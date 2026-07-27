// src/components/LifeScoresWidget.tsx

import React from 'react';
import { Heart, Briefcase, DollarSign, Users, Award, Sparkles } from 'lucide-react';

interface ScoreItem {
  name: string;
  english: string;
  score: number;
  color: string;
  icon: React.ReactNode;
}

/**
 * Reusable Circular Progress Score Gauge.
 * Renders high-end glowing circular progress meters inside glassmorphic panels.
 */
function CircularGauge({ name, english, score, color, icon }: ScoreItem) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-between p-3.5 bg-black/45 rounded-2xl border border-red-950/15 shadow-md hover:border-yellow-500/25 transition-all duration-300 group">
      
      {/* 1. Circle Ring container */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Swirling Background glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <svg className="w-full h-full transform -rotate-90">
          {/* Base trail track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Active progress track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}80)`
            }}
          />
        </svg>

        {/* Center icon / score percent value */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="group-hover:scale-110 transition-transform duration-300" style={{ color }}>
            {icon}
          </div>
          <span className="text-[14px] font-extrabold font-mono tracking-wide text-slate-100 mt-0.5 leading-none">
            {score}%
          </span>
        </div>
      </div>

      {/* 2. Text Meta Labels */}
      <div className="text-center mt-3">
        <span className="text-xs font-bold text-slate-200 block font-sans tracking-wide">
          {name}
        </span>
        <span className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold uppercase block mt-0.5">
          {english}
        </span>
      </div>

    </div>
  );
}

export default function LifeScoresWidget() {
  const scores: ScoreItem[] = [
    {
      name: 'உடல் ஆரோக்கியம்',
      english: 'Health Score',
      score: 82,
      color: '#10B981', // Emerald green
      icon: <Heart className="w-4 h-4" />
    },
    {
      name: 'தொழில் / உத்தியோகம்',
      english: 'Career Score',
      score: 88,
      color: '#3B82F6', // Sky blue
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      name: 'பொருளாதாரம்',
      english: 'Finance Score',
      score: 75,
      color: '#F59E0B', // Amber gold
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      name: 'உறவுகள்',
      english: 'Relationship Score',
      score: 90,
      color: '#EC4899', // Rose pink
      icon: <Users className="w-4 h-4" />
    },
    {
      name: 'ஆன்மீகம்',
      english: 'Spiritual Score',
      score: 94,
      color: '#8B5CF6', // Purple indigo
      icon: <Award className="w-4 h-4" />
    }
  ];

  return (
    <div className="bg-slate-900/35 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-red-900/15 shadow-xl shadow-black/80 space-y-4">
      
      {/* Header labels */}
      <div className="flex items-center gap-2 border-b border-red-950/25 pb-3">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <Sparkles className="w-4.5 h-4.5" />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-yellow-400 tracking-wide font-sans">வாழ்க்கை குறியீடுகள் (Life Scores)</h4>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Dynamic Astrological Strength Gauges</p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {scores.map((s) => (
          <CircularGauge key={s.english} {...s} />
        ))}
      </div>

    </div>
  );
}
