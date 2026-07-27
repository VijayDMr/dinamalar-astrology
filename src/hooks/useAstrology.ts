// src/hooks/useAstrology.ts

import { useState, useEffect } from 'react';
import { rasis } from '../data/fallback-data';

interface UseAstrologyResult {
  prediction: string;
  loading: boolean;
  error: string | null;
  provider: 'primary' | 'secondary' | 'local_fallback' | null;
  latencyMs: number;
  refetch: () => void;
}

/**
 * Reusable Custom Hook to asynchronously fetch secure prediction data from your backend API.
 * Guarantees 100% uptime: if the secure API route is unreachable (e.g. on static hosts like GitHub Pages),
 * it silently falls back to compiling predictions directly from local fallback data on the client.
 */
export function useAstrology(rasiId: string, type: string): UseAstrologyResult {
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'primary' | 'secondary' | 'local_fallback' | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [trigger, setTrigger] = useState<number>(0);

  const refetch = () => setTrigger(prev => prev + 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    // Helper to resolve prediction locally on the client-side (Zero-Downtime Fallback)
    const getLocalClientFallback = (): string => {
      const matchedRasi = rasis.find(r => r.id === rasiId);
      if (!matchedRasi) return "பலன்கள் தற்போது கிடைக்கவில்லை.";
      
      // Clean request type
      const cleanType = type.toLowerCase();

      switch (cleanType) {
        case 'today': return matchedRasi.today;
        case 'weekly': return matchedRasi.weekly;
        case 'monthly': return matchedRasi.monthly;
        case 'guru': return matchedRasi.guruPairchi;
        case 'sani': return matchedRasi.saniPairchi;
        case 'raguketu': return matchedRasi.raguKetuPairchi;
        case 'tamilnewyear': return matchedRasi.tamilNewYear;
        case 'englishnewyear': return matchedRasi.englishNewYear;
        default: return matchedRasi.today;
      }
    };

    async function loadData() {
      const startTime = Date.now();
      try {
        const response = await fetch(
          `/api/astrology?rasiId=${encodeURIComponent(rasiId)}&type=${encodeURIComponent(type)}`,
          { 
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
          }
        );

        // If the server returns a 404 (static host has no API routes) or server errors,
        // trigger the secure local client fallback
        if (response.status === 404 || response.status >= 500) {
          if (!active) return;
          setPrediction(getLocalClientFallback());
          setProvider('local_fallback');
          setLatencyMs(Date.now() - startTime);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!active) return;

        if (!response.ok) {
          throw new Error(data.error || 'API Fetch failed.');
        }

        setPrediction(data.prediction || '');
        setProvider(data.provider || 'local_fallback');
        setLatencyMs(data.latencyMs || 0);

      } catch (err: any) {
        if (!active) return;
        if (err.name === 'AbortError') return;

        // If network request failed completely (offline or CORS), load client fallback
        console.warn(`[HOOK-WARN] Secure API Route unreachable. Activating zero-downtime client fallback: ${err.message}`);
        setPrediction(getLocalClientFallback());
        setProvider('local_fallback');
        setLatencyMs(Date.now() - startTime);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [rasiId, type, trigger]);

  return { prediction, loading, error, provider, latencyMs, refetch };
}
