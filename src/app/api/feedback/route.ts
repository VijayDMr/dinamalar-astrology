// src/app/api/feedback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../services/rateLimiter';
import { promptManager } from '../../../services/promptManager';
import { aiMonitor } from '../../../services/aiMonitor';
import { FeedbackPayload } from '../../../types/astrology';

// Simulated in-memory database of feedback logs
const feedbackDatabase: FeedbackPayload[] = [];

/**
 * POST handler to receive and secure user sentiment ratings on predictions.
 * Endpoint: /api/feedback
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

  try {
    // 1. Enforce Token-Bucket Rate Limiting
    const isAllowed = checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'அதிக கோரிக்கைகள் வந்துள்ளன (Too Many Requests). சற்று பொறுக்கவும்.' },
        { status: 429 }
      );
    }

    // 2. Parse payload and apply strict type validation
    const body = await req.json();
    const { sentiment, rasiId, predictionType, comment } = body as FeedbackPayload;

    if (!sentiment || !rasiId || !predictionType) {
      return NextResponse.json(
        { error: 'Missing required feedback attributes.' },
        { status: 400 }
      );
    }

    if (sentiment !== 'upvote' && sentiment !== 'downvote') {
      return NextResponse.json(
        { error: 'Invalid sentiment value.' },
        { status: 400 }
      );
    }

    // 3. Prevent Injection: Sanitize text comments thoroughly
    const cleanComment = comment ? promptManager.sanitizeInput(comment) : undefined;

    const validatedPayload: FeedbackPayload = {
      sentiment,
      rasiId: promptManager.sanitizeInput(rasiId),
      predictionType: promptManager.sanitizeInput(predictionType),
      comment: cleanComment
    };

    // 4. Persist feedback (Simulated DB push)
    feedbackDatabase.push(validatedPayload);
    
    // Maintain cache memory limit
    if (feedbackDatabase.length > 5000) {
      feedbackDatabase.shift();
    }

    // 5. Log metric event
    aiMonitor.logTransaction({
      endpoint: '/api/feedback',
      latencyMs: Date.now() - startTime,
      status: 201,
      provider: 'local_fallback',
      timestamp: new Date().toISOString()
    });

    console.log(
      `[FEEDBACK] Captured User Sentiment: ${sentiment.toUpperCase()} | ` +
      `Rasi: ${rasiId} | Tab: ${predictionType} | ` +
      (cleanComment ? `Comment: "${cleanComment}"` : 'No text comment.')
    );

    return NextResponse.json({
      success: true,
      message: 'நன்றி! உங்கள் கருத்து வெற்றிகரமாகப் பதிவு செய்யப்பட்டது (Feedback Saved).'
    }, { status: 201 });

  } catch (err: any) {
    const errMsg = err.message || 'Server Error';
    console.error(`[API-ERROR] Feedback submission crashed: ${errMsg}`);

    aiMonitor.logTransaction({
      endpoint: '/api/feedback',
      latencyMs: Date.now() - startTime,
      status: 500,
      provider: 'local_fallback',
      timestamp: new Date().toISOString(),
      errorMessage: errMsg
    });

    return NextResponse.json(
      { error: 'கருத்துச் சேமிப்பில் பிழை ஏற்பட்டது.' },
      { status: 500 }
    );
  }
}
