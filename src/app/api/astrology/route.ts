// src/app/api/astrology/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../services/rateLimiter';
import { promptManager } from '../../../services/promptManager';
import { aiMonitor } from '../../../services/aiMonitor';
import { fetchAstrologyPrediction } from '../../../services/astrologyProvider';

/**
 * GET handler to fetch validated and resilient astrology predictions.
 * Endpoint: /api/astrology?rasiId=mesham&type=today
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  // Extract client IP address for rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
  
  let rasiId = '';
  let type = '';

  try {
    // 1. Enforce Token-Bucket Rate Limiting
    const isAllowed = checkRateLimit(ip);
    if (!isAllowed) {
      const errorResponse = { error: 'சற்று பொறுக்கவும். வினாடிக்கு அதிக கோரிக்கைகள் வந்துள்ளன (Too Many Requests).' };
      aiMonitor.logTransaction({
        endpoint: '/api/astrology',
        latencyMs: Date.now() - startTime,
        status: 429,
        provider: 'local_fallback',
        timestamp: new Date().toISOString(),
        errorMessage: 'Rate limit exceeded by IP: ' + ip
      });
      return NextResponse.json(errorResponse, { status: 429 });
    }

    // 2. Validate URL search parameters
    const { searchParams } = new URL(req.url);
    rasiId = searchParams.get('rasiId') || '';
    type = searchParams.get('type') || '';

    if (!rasiId || !type) {
      throw new Error('Missing required query parameters: "rasiId" and "type".');
    }

    // 3. Prevent Prompt Injection & Enforce Input Validation
    const validated = promptManager.validateParams(rasiId, type);
    
    // 4. Formulate the secure system prompt
    const securePrompt = promptManager.getSecurePrompt(validated.rasiId, validated.type);

    // 5. Fetch prediction through cache, retry-backoff, and failover mechanics
    const result = await fetchAstrologyPrediction(validated.rasiId, validated.type, securePrompt);

    // 6. Log transaction to telemetry
    aiMonitor.logTransaction({
      endpoint: `/api/astrology?rasiId=${validated.rasiId}&type=${validated.type}`,
      latencyMs: result.latencyMs,
      status: 200,
      provider: result.provider,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      rasiId: validated.rasiId,
      type: validated.type,
      prediction: result.prediction,
      provider: result.provider,
      latencyMs: result.latencyMs
    }, { status: 200 });

  } catch (err: any) {
    // Graceful error boundaries and telemetry logging
    const errMessage = err.message || 'Unknown Server Error';
    console.error(`[API-ERROR] /api/astrology crashed: ${errMessage}`);

    aiMonitor.logTransaction({
      endpoint: `/api/astrology?rasiId=${rasiId}&type=${type}`,
      latencyMs: Date.now() - startTime,
      status: 400,
      provider: 'local_fallback',
      timestamp: new Date().toISOString(),
      errorMessage: errMessage
    });

    return NextResponse.json(
      { error: errMessage },
      { status: 400 }
    );
  }
}
