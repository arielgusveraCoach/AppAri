import { IntentType, ParsedIntent } from '../core/types';

class IntentRecognizer {
  /**
   * Processes a spoken text and tries to map it to a specific intent using Regex/Keywords.
   */
  public parse(text: string): ParsedIntent {
    const t = text.toLowerCase();

    // 1. Weather
    if (t.includes('clima') || t.includes('tiempo hará') || t.includes('llover')) {
      return { intent: IntentType.WEATHER, parameters: { text }, confidence: 0.9 };
    }

    // 2. Alarm
    if (t.includes('alarma') || t.includes('despiértame')) {
      // Basic extraction of time if available
      const timeMatch = t.match(/a las (\d+)/);
      const time = timeMatch ? timeMatch[1] : null;
      return { intent: IntentType.ALARM, parameters: { time }, confidence: 0.9 };
    }

    // 3. Web Search
    if (t.includes('busca en') || t.includes('qué significa') || t.includes('quién es') || t.includes('buscar')) {
      const query = t.replace(/(busca en internet|buscar|qué significa|quién es)/gi, '').trim();
      return { intent: IntentType.WEB_SEARCH, parameters: { query }, confidence: 0.8 };
    }
    
    // 4. Time / Date
    if (t.includes('qué hora es') || t.includes('qué día es') || t.includes('fecha')) {
      return { intent: IntentType.TIME_DATE, parameters: {}, confidence: 0.9 };
    }
    
    // 5. App / System
    if (t.includes('abre') || t.includes('abrir')) {
      const appMatch = t.match(/abre (.*)/);
      return { intent: IntentType.OPEN_APP, parameters: { app: appMatch ? appMatch[1].trim() : '' }, confidence: 0.8 };
    }

    // Fallback
    return { intent: IntentType.UNKNOWN, parameters: { text }, confidence: 0.0 };
  }
}

export default new IntentRecognizer();
