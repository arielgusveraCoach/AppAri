import { ActionHandler, ParsedIntent, ActionResponse, IntentType } from '../core/types';

export class TimeDateHandler implements ActionHandler {
  async handle(intent: ParsedIntent): Promise<ActionResponse> {
    const now = new Date();
    
    // Check if user asked for time or date
    const text = intent.parameters.text?.toLowerCase() || '';
    
    if (text.includes('día') || text.includes('fecha')) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString('es-ES', options);
      return {
        success: true,
        message: () => `Hoy es ${dateString}.`
      };
    } else {
      const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      return {
        success: true,
        message: () => `Son las ${timeString}.`
      };
    }
  }
}
