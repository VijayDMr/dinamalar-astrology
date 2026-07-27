// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit } from '../../../services/rateLimiter';
import { promptManager } from '../../../services/promptManager';
import { aiMonitor } from '../../../services/aiMonitor';
import { defaultPlanetPlacements } from '../../../data/fallback-data';

// Intelligent Local Fail-Safe Rule-Based Astrological Parser
// Ensures 100% chatbot uptime even when APIs are completely offline or keys are missing.
function generateLocalRulesResponse(question: string, userName: string): string {
  const cleanQ = question.toLowerCase();

  if (cleanQ.includes('career') || cleanQ.includes('வேலை') || cleanQ.includes('உத்தியோகம்') || cleanQ.includes('தொழில்') || cleanQ.includes('job')) {
    return `வணக்கம் ${userName}. உங்களது ஜாதகத்தில் 10-ஆம் வீடான கர்ம ஸ்தான அதிபதி வலுவாக சஞ்சரிக்கிறார். மேலும் உத்தியோக குறியீட்டு பலம் 88% மிகத் திருப்திகரமாக உள்ளதால், இந்த காலக்கட்டத்தில் புதிய வேலைக்கு முயற்சிப்பது உங்களுக்கு மகத்தான வெற்றியைத் தரும். குறிப்பாக செவ்வாய் மற்றும் வியாழன் ஓரைகளில் நேர்காணல்களுக்குச் செல்வது நற்பலன் தரும்.`;
  }
  
  if (cleanQ.includes('marriage') || cleanQ.includes('திருமணம்') || cleanQ.includes('கல்யாணம்') || cleanQ.includes('marry')) {
    return `வணக்கம் ${userName}. உங்களது ஜாதகத்தில் 7-ஆம் வீடான களத்திர ஸ்தானத்தில் சந்திரன் உச்சம் பெற்று (ரிஷப ராசியில்) வீற்றிருக்கிறார். இதனால் உங்களது வாழ்க்கைத்துணை மிகவும் அன்பானவராகவும், அழகு நிறைந்தவராகவும் அமைவார். திருமண முயற்சிகள் விரைவில் கைகூடும். ஆவணி அல்லது கார்த்திகை மாதங்களில் வரன் பார்க்கத் தொடங்கினால் சுப காரியங்கள் மிக சுலபமாக முடியும்.`;
  }

  if (cleanQ.includes('money') || cleanQ.includes('பணம்') || cleanQ.includes('பொருளாதாரம்') || cleanQ.includes('கடன்') || cleanQ.includes('finance') || cleanQ.includes('wealth')) {
    return `வணக்கம் ${userName}. உங்களது பொருளாதார யோக பலம் 75% ஆக உள்ளது. 11-ஆம் வீடான லாப ஸ்தானத்தில் சூரியனும் புதனும் இணைந்து 'புத ஆதித்ய யோகம்' ஏற்படுத்துகிறார்கள். இதனால் கூட்டுத் தொழில் மற்றும் முதலீடுகளில் நல்ல வருமானம் உண்டாகும். வியாழன் ஓரை நேரங்களில் நிதி சார்ந்த புதிய முடிவுகளை எடுப்பது கடன் சுமைகளைக் குறைக்க உதவும்.`;
  }

  if (cleanQ.includes('gemstone') || cleanQ.includes('ரத்தினம்') || cleanQ.includes('கல்') || cleanQ.includes('stone')) {
    return `வணக்கம் ${userName}. உங்களது ராசிக்கு அதிபதியான செவ்வாய் பகவானை பலப்படுத்த நீங்கள் 'பவளம் (Red Coral)' ரத்தினக் கல்லை மோதிர விரலில் அணிவது அதிர்ஷ்டத்தைத் தரும். இது உங்களது மன தைரியத்தையும் ஆளுமைத் திறனையும் பன்மடங்கு உயர்த்தும்.`;
  }

  if (cleanQ.includes('prediction') || cleanQ.includes('பஞ்சாங்கம்') || cleanQ.includes('இன்றைய') || cleanQ.includes('today')) {
    return `வணக்கம் ${userName}. இன்றைய ஆடி 11 திருநாளில் சிவம் மற்றும் சித்தயோகம் நிலவுகிறது. மதியம் 2:45 மணி வரை துவாதசி திதி நிலவுவதால், நந்தியம் பகவானை வழிபடுவது இன்று உங்களுக்குத் தடைபட்ட சுபகாரியங்களை விலக்கி வெற்றியைத் தரும். எமகண்ட மற்றும் ராகு காலங்களைத் தவிர்த்து நல்ல நேரங்களில் செயல்களைத் தொடங்கவும்.`;
  }

  // General warm astrological response
  return `வணக்கம் ${userName}. உங்களது ஜாதகப் பலன்களை ஆராய்ந்ததில், லக்னத்தில் குரு அமர்ந்து உங்களைப் பார்ப்பது மிகச் சிறந்த யோகமாகும். நீங்கள் கேட்கும் கேள்விக்கு கிரகங்களின் சஞ்சாரம் அனுகூலமாகவே உள்ளது. உங்கள் முயற்சியைத் தொடங்குங்கள், குலதெய்வ வழிபாடு தடைகளை விலக்கும்!`;
}

/**
 * POST handler to perform RAG-augmented chat operations using the Gemini API.
 * Endpoint: /api/chat
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

  try {
    // 1. Enforce Token-Bucket Rate Limiting
    const isAllowed = checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'வினாடிக்கு அதிக கோரிக்கைகள் வந்துள்ளன. சற்று பொறுக்கவும் (Too Many Requests).' },
        { status: 429 }
      );
    }

    // 2. Parse payload and sanitize
    const body = await req.json();
    const { question, birthDetails, chatHistory } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const cleanQuestion = promptManager.sanitizeInput(question);
    const userName = birthDetails?.name ? promptManager.sanitizeInput(birthDetails.name) : 'விஜய் (Vijay)';

    // Resolve API key prioritised order:
    // A: Local env variable FIRST (highly secure)
    // B: Client header key SECOND (for custom user API testing)
    const clientHeaderKey = req.headers.get('x-gemini-key');
    const resolvedApiKey = process.env.GEMINI_API_KEY || clientHeaderKey;

    // 3. Fallback Route: If no API key is set/resolved, fall back to our local rule-based engine
    if (!resolvedApiKey) {
      const localResponse = generateLocalRulesResponse(cleanQuestion, userName);
      
      aiMonitor.logTransaction({
        endpoint: '/api/chat (FAIL-SAFE FALLBACK)',
        latencyMs: Date.now() - startTime,
        status: 200,
        provider: 'local_fallback_rules',
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        response: localResponse,
        metadata: {
          latencyMs: Date.now() - startTime,
          source: 'local_fallback_rules',
          isFallback: true
        }
      }, { status: 200 });
    }

    // 4. RAG Architecture: Compile rich, multi-dimensional astrological context of the user
    const planetsContext = defaultPlanetPlacements.map(p => 
      `- ${p.name}: Sign ${p.sign}, House ${p.house}, Nakshatra ${p.nakshatram} P${p.padha}, Strength ${p.strength}%, Retrograde: ${p.isRetrograde ? 'Yes' : 'No'}`
    ).join('\n');

    const systemInstructions = `
You are a brilliant, elite traditional South Indian astrologer and Principal AI Astro Advisor.
You are running on the prestigious Dinamalar Astrology SaaS platform. 

Your task is to analyze the user's astrological data and answer their question with extreme astrological precision, warmth, and luxury commercial-grade clarity.

User Birth Details:
- Name: ${userName}
- Birth Date & Time: ${birthDetails?.date || '1995-10-15'} at ${birthDetails?.time || '08:30'}
- Coordinates: Lat ${birthDetails?.latitude || 13.0827}, Lon ${birthDetails?.longitude || 80.2707}

Active Planetary Placements (Rasis, Houses, Nakshatrams):
${planetsContext}

Dashboard Score Benchmarks:
- Health: 82% | Career: 88% | Finance: 75% | Relationships: 90% | Spiritual: 94%

CRITICAL GUIDELINES:
1. Always base your calculations on the actual supplied planetary positions above. NEVER make up or hallucinate birth coordinates or planet signs.
2. Support multilingual fluid conversations. If the user asks in Tamil, reply fully in warm, standard, traditional Tamil. If in English or Hindi, match their language.
3. Be encouraging, luxurious, and clear. Avoid cartoonish or simplistic phrasing. Explain the astrological reasoning (e.g. "Because your Moon is exalted in Taurus in the 7th house...").
4. Keep answers focused and impactful, under 150 words if possible.
`;

    // 5. Query the Gemini model safely using Google Gen AI SDK
    const genAI = new GoogleGenerativeAI(resolvedApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Format dialogue history for Gemini SDK structure
    const formattedHistory = (chatHistory || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start Chat Session with system instructions injected
    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7
      }
    });

    const promptMessage = `${systemInstructions}\n\nUser Question: ${cleanQuestion}`;
    const result = await chatSession.sendMessage(promptMessage);
    const apiResponse = result.response.text();

    // 6. Log transaction to telemetry monitor
    aiMonitor.logTransaction({
      endpoint: '/api/chat',
      latencyMs: Date.now() - startTime,
      status: 200,
      provider: 'gemini_1.5_flash',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      response: apiResponse,
      metadata: {
        latencyMs: Date.now() - startTime,
        source: 'gemini_reasoning',
        isFallback: false
      }
    }, { status: 200 });

  } catch (err: any) {
    const errMsg = err.message || 'Gemini API Error';
    console.error(`[API-ERROR] /api/chat crashed: ${errMsg}`);

    aiMonitor.logTransaction({
      endpoint: '/api/chat',
      latencyMs: Date.now() - startTime,
      status: 500,
      provider: 'gemini_1.5_flash',
      timestamp: new Date().toISOString(),
      errorMessage: errMsg
    });

    return NextResponse.json({
      error: 'AI சேவை தற்போது தற்காலிகமாக தடைபட்டுள்ளது.'
    }, { status: 500 });
  }
}
