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

// Enterprise Feedback types
export interface FeedbackPayload {
  sentiment: 'upvote' | 'downvote';
  rasiId: string;
  predictionType: string;
  comment?: string;
}

// Enterprise Telemetry logs
export interface LogMetric {
  endpoint: string;
  latencyMs: number;
  status: number;
  provider: 'primary' | 'secondary' | 'local_fallback';
  tokensUsed?: number;
  timestamp: string;
  errorMessage?: string;
}
