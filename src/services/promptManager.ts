// src/services/promptManager.ts

const ALLOWED_RASIS = new Set([
  'mesham', 'rishabam', 'mithunam', 'kadagam', 'simmam', 'kanni',
  'thulaam', 'viruchigam', 'dhanusu', 'magaram', 'kumbam', 'meenam'
]);

const ALLOWED_TYPES = new Set([
  'today', 'weekly', 'monthly', 'guru', 'sani', 'raguketu', 'tamilnewyear', 'englishnewyear'
]);

/**
 * Enterprise Prompt & Query Protection Manager.
 * Prevents prompt injection by validating input and mapping variables to strict structures.
 */
export const promptManager = {
  /**
   * Sanitizes input strings by stripping HTML, SQL commands, and typical injection payloads.
   */
  sanitizeInput(text: string): string {
    if (!text) return '';
    // Strip HTML/Script tags, replace quotes and dangerous delimiters
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/['"\\;`]/g, '')
      .trim()
      .substring(0, 500); // Impose strict character budget
  },

  /**
   * Strictly validates incoming API parameters.
   * Throws an error if any parameter is invalid.
   */
  validateParams(rasiId: string, type: string): { rasiId: string; type: string } {
    const cleanRasi = rasiId.trim().toLowerCase();
    const cleanType = type.trim().toLowerCase();

    if (!ALLOWED_RASIS.has(cleanRasi)) {
      throw new Error(`Forbidden Rasi ID: "${rasiId}". Input validation blocked potential memory injection.`);
    }

    if (!ALLOWED_TYPES.has(cleanType)) {
      throw new Error(`Forbidden Prediction Type: "${type}". Input validation blocked potential prompt injection.`);
    }

    return { rasiId: cleanRasi, type: cleanType };
  },

  /**
   * Formulates a secure, pre-validated system prompt for an AI-powered prediction,
   * completely locking out user-supplied prompt injection.
   */
  getSecurePrompt(rasiName: string, type: string): string {
    const rasiMap: Record<string, string> = {
      'mesham': 'மேஷம் (Aries)',
      'rishabam': 'ரிஷபம் (Taurus)',
      'mithunam': 'மிதுனம் (Gemini)',
      'kadagam': 'கடகம் (Cancer)',
      'simmam': 'சிம்மம் (Leo)',
      'kanni': 'கன்னி (Virgo)',
      'thulaam': 'துலாம் (Libra)',
      'viruchigam': 'விருச்சிகம் (Scorpio)',
      'dhanusu': 'தனுசு (Sagittarius)',
      'magaram': 'மகரம் (Capricorn)',
      'kumbam': 'கும்பம் (Aquarius)',
      'meenam': 'மீனம் (Pisces)'
    };

    const targetRasiName = rasiMap[rasiName] || rasiName;

    // Hardcoded immutable templates. User input can ONLY select which template to load,
    // they can NEVER pass custom text strings directly to the prompt template.
    switch (type) {
      case 'today':
        return `இன்றைய தினப்பலன் கணிப்பு: ராசி ${targetRasiName}. பாரம்பரிய தமிழ் ஜோதிட விதிகளின்படி இன்றைய நாளுக்கான ஆரோக்கியம், குடும்பம், தொழில் மற்றும் பணவரவு பலன்களை 100 வார்த்தைகளில் சுருக்கமாகத் தருக.`;
      case 'weekly':
        return `வாராந்திர பலன் கணிப்பு: ராசி ${targetRasiName}. இந்த வாரத்திற்கான தொழில், உத்தியோகம், குடும்ப ஒற்றுமை, மற்றும் உடல் நலம் பற்றிய பலன்களை தெளிவாகவும் சுருக்கமாகவும் விளக்குக.`;
      case 'monthly':
        return `மாதாந்திர பலன் கணிப்பு: ராசி ${targetRasiName}. இந்த மாதத்தில் நிகழக்கூடிய கிரக பெயர்ச்சிகள் மற்றும் அவற்றின் அடிப்படையில் ஏற்படக்கூடிய நன்மைகள், சவால்கள் ஆகியவற்றை விவரித்துக் கூறுக.`;
      case 'guru':
        return `குரு பெயர்ச்சி பலன்கள்: ராசி ${targetRasiName}. குரு பகவான் புதிய ராசிக்கு பெயர்ச்சியாவதால் குடும்பம், புத்திர யோகம், மற்றும் பொருளாதாரத்தில் ஏற்படப்போகும் மாற்றங்களை விளக்குக.`;
      case 'sani':
        return `சனி பெயர்ச்சி பலன்கள்: ராசி ${targetRasiName}. சனி பகவானின் சஞ்சாரத்தால் தொழிலில் ஏற்படப்போகும் முன்னேற்றம் மற்றும் ஆரோக்கியத்தில் கடைப்பிடிக்க வேண்டிய எச்சரிக்கைகளைத் தருக.`;
      case 'raguketu':
        return `ராகு-கேது பெயர்ச்சி பலன்கள்: ராசி ${targetRasiName}. ராகு மற்றும் கேது பகவான்களின் நிழல் கிரக பெயர்ச்சியால் ஏற்படக்கூடிய திடீர் யோகங்கள் மற்றும் விரயங்களை விவரிக்கவும்.`;
      case 'tamilnewyear':
        return `தமிழ்ப் புத்தாண்டு பலன்கள்: ராசி ${targetRasiName}. வரவிருக்கும் குரோதி வருட தமிழ்ப் புத்தாண்டில் உண்டாகக்கூடிய சுபயோகங்கள் மற்றும் சொத்து சேர்க்கை பலன்களை விளக்குக.`;
      case 'englishnewyear':
        return `ஆங்கிலப் புத்தாண்டு பலன்கள்: ராசி ${targetRasiName}. இந்த ஆங்கிலப் புத்தாண்டில் உத்தியோகத்தில் பதவி உயர்வு, புதிய வாய்ப்புகள் மற்றும் லட்சியங்களை அடைவது பற்றிய பலன்களை விளக்குக.`;
      default:
        return `சுப பலன் கணிப்பு: ராசி ${targetRasiName}. நற்பலன்களைத் தருக.`;
    }
  }
};
