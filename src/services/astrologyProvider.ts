// src/services/astrologyProvider.ts

import { rasis } from '../data/fallback-data';
import { aiMonitor } from './aiMonitor';

// Simple in-memory cache bucket
const predictionCache = new Map<string, { prediction: string; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // Cache predictions for 10 minutes

/**
 * Delay execution helper for exponential backoff retries.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FetchResult {
  prediction: string;
  provider: 'primary' | 'secondary' | 'local_fallback';
  latencyMs: number;
}

/**
 * Core Enterprise Astrology Provider.
 * Orchestrates caching, retry-with-backoff, secondary failover, and local high-fidelity fallbacks.
 */
export async function fetchAstrologyPrediction(
  rasiId: string,
  type: string,
  securePrompt: string
): Promise<FetchResult> {
  const cacheKey = `${rasiId}_${type}`;
  const now = Date.now();
  
  // 1. Resolve Cache Hit
  const cached = predictionCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return {
      prediction: cached.prediction,
      provider: 'local_fallback', // Served from local memory
      latencyMs: 0
    };
  }

  const startTime = Date.now();
  const primaryUrl = process.env.PRIMARY_ASTROLOGY_API_URL;
  const primaryKey = process.env.PRIMARY_ASTROLOGY_API_KEY;
  const secondaryUrl = process.env.SECONDARY_ASTROLOGY_API_URL;
  const secondaryKey = process.env.SECONDARY_ASTROLOGY_API_KEY;

  // Helper to fetch prediction locally from our high-fidelity fallback database
  const getLocalFallback = (): string => {
    const matchedRasi = rasis.find(r => r.id === rasiId);
    if (!matchedRasi) return "பலன்கள் தற்போது கிடைக்கவில்லை.";
    
    // Map request type to fallback data field
    switch (type) {
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

  // 2. Try Fetching from Primary Provider with 3x Exponential Backoff Retries
  if (primaryUrl && primaryKey) {
    let retries = 3;
    let backoffDelay = 100; // start with 100ms delay
    
    while (retries > 0) {
      try {
        const response = await fetch(primaryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${primaryKey}`
          },
          body: JSON.stringify({ prompt: securePrompt }),
          signal: AbortSignal.timeout(3000) // 3 seconds timeout
        });

        if (response.ok) {
          const data = await response.json();
          const prediction = data.prediction || data.text || '';
          
          if (prediction) {
            // Write to cache
            predictionCache.set(cacheKey, {
              prediction,
              expiry: Date.now() + CACHE_TTL_MS
            });

            return {
              prediction,
              provider: 'primary',
              latencyMs: Date.now() - startTime
            };
          }
        }
        
        throw new Error(`Primary API returned status: ${response.status}`);
      } catch (err: any) {
        retries--;
        if (retries === 0) {
          console.warn(`[API-WARN] Primary provider failed after 3 retries. Error: ${err.message}. Initiating failover...`);
        } else {
          await delay(backoffDelay);
          backoffDelay *= 2; // double the wait time for the next retry (exponential backoff)
        }
      }
    }
  }

  // 3. Failover to Secondary Provider if Primary fails or is unconfigured
  if (secondaryUrl && secondaryKey) {
    try {
      const response = await fetch(secondaryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secondaryKey}`
        },
        body: JSON.stringify({ prompt: securePrompt }),
        signal: AbortSignal.timeout(4000) // 4 seconds timeout for failover
      });

      if (response.ok) {
        const data = await response.json();
        const prediction = data.prediction || data.text || '';
        
        if (prediction) {
          predictionCache.set(cacheKey, {
            prediction,
            expiry: Date.now() + CACHE_TTL_MS
          });

          return {
            prediction,
            provider: 'secondary',
            latencyMs: Date.now() - startTime
          };
        }
      }
    } catch (err: any) {
      console.error(`[API-ERROR] Failover secondary provider also failed. Error: ${err.message}. Falling back to high-fidelity local database...`);
    }
  }

  // 4. Fallback to Local High-Fidelity Static Database if both APIs are down/unconfigured
  const localPrediction = getLocalFallback();
  
  // Cache the local prediction to prevent file parsing on consecutive spam requests
  predictionCache.set(cacheKey, {
    prediction: localPrediction,
    expiry: Date.now() + CACHE_TTL_MS
  });

  return {
    prediction: localPrediction,
    provider: 'local_fallback',
    latencyMs: Date.now() - startTime
  };
}
