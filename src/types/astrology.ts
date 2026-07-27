// src/types/astrology.ts

export interface RasiData {
  id: string;
  name: string;
  englishName: string;
  lord: string; // அதிபதி
  luckyNumber: string; // அதிர்ஷ்ட எண்
  luckyColor: string; // அதிர்ஷ்ட வண்ணம்
  symbol: string;
  today: string; // இன்றைய ராசிபலன்
  weekly: string; // வாராந்திர ராசிபலன்
  monthly: string; // மாதாந்திர ராசிபலன்
  guruPairchi: string; // குரு பெயர்ச்சி பலன்
  saniPairchi: string; // சனி பெயர்ச்சி பலன்
  raguKetuPairchi: string; // ராகு கேது பெயர்ச்சி பலன்
  tamilNewYear: string; // தமிழ் புத்தாண்டு பலன்
  englishNewYear: string; // ஆங்கில புத்தாண்டு பலன்
  subhaMuhurtham: string[]; // சுப முகூர்த்த நாட்கள்
}

export interface PanchangamData {
  date: string;
  tamilDate: string; // தமிழ் தேதி
  thithi: string; // திதி
  nakshatram: string; // நட்சத்திரம்
  yogam: string; // யோகம்
  karanam: string; // கரணம்
  rahuKalam: string; // ராகு காலம்
  yamagandam: string; // எமகண்டம்
  gulikai: string; // குளிகை
  nallaNeram: string; // நல்ல நேரம்
}

export interface VirathamData {
  name: string;
  date: string;
  description: string;
}

export interface VasthuData {
  date: string;
  tamilMonth: string;
  time: string; // வாஸ்து நேரம்
  description: string;
}

export interface HoraiItem {
  time: string;
  planet: string;
  status: 'good' | 'bad' | 'neutral';
}

export interface GowriPanchangamItem {
  time: string;
  gowri: string;
  status: 'good' | 'bad' | 'neutral';
}

// ------------------------------------------------
// LUXURY 2026 COMMERCIAL ASTROLOGY PLATFORM TYPES
// ------------------------------------------------

// User birth parameters for high-end chart generation
export interface BirthDetails {
  name: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM (24h)
  location: string;   // City, Country
  latitude: number;   // e.g. 13.0827 (Chennai)
  longitude: number;  // e.g. 80.2707
  timezone: number;   // e.g. 5.5
}

// Planet Placement details for real-time planet status
export interface PlanetStatus {
  name: string;       // e.g. "சூரியன் (Sun)"
  sign: string;       // e.g. "ரிஷபம் (Taurus)"
  degree: string;     // e.g. "14° 25' 12\""
  house: number;      // e.g. 1, 2, 3...
  nakshatram: string; // e.g. "ரோகிணி"
  padha: number;      // e.g. 1, 2, 3, 4
  strength: number;   // 0 to 100 percentage strength
  isRetrograde: boolean;
  status: 'Exalted' | 'Debilitated' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Enemy';
}

// Dasha Node for timeline predictions
export interface DashaNode {
  planet: string;     // e.g. "Sani"
  startDate: string;  // YYYY-MM-DD
  endDate: string;
  type: 'mahadasha' | 'antardasha' | 'pratyantardasha';
  subDashas?: DashaNode[];
}

// AI Astrology Dialogue Interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    latencyMs?: number;
    tokensUsed?: number;
    source?: 'gemini_reasoning' | 'local_fallback_rules';
    isFallback?: boolean;
  };
}

export interface SavedHoroscope {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDetails: BirthDetails;
  notes?: string;
  createdAt: string;
}

// Feedback logging
export interface FeedbackPayload {
  sentiment: 'upvote' | 'downvote';
  rasiId: string;
  predictionType: string;
  comment?: string;
}

// Telemetry logs
export interface LogMetric {
  endpoint: string;
  latencyMs: number;
  status: number;
  provider: string;
  tokensUsed?: number;
  timestamp: string;
  errorMessage?: string;
}
