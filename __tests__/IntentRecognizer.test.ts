import IntentRecognizer from '../intents/IntentRecognizer';
import { IntentType } from '../core/types';

describe('IntentRecognizer', () => {
  it('identifica correctamente la intención WEB_SEARCH', () => {
    const result = IntentRecognizer.parse('Busca en internet fotos de gatos');
    expect(result.intent).toBe(IntentType.WEB_SEARCH);
    expect(result.parameters.query).toBe('fotos de gatos');
  });

  it('identifica correctamente la intención WEATHER', () => {
    const result = IntentRecognizer.parse('¿qué tiempo hará mañana?');
    expect(result.intent).toBe(IntentType.WEATHER);
  });

  it('identifica la intención del despertador ALARM', () => {
    const result = IntentRecognizer.parse('Pon una alarma a las 8');
    expect(result.intent).toBe(IntentType.ALARM);
    expect(result.parameters.time).toBe('8');
  });

  it('devuelve UNKNOWN para comandos inconexos', () => {
    const result = IntentRecognizer.parse('asdfas dfasdf');
    expect(result.intent).toBe(IntentType.UNKNOWN);
  });
});
