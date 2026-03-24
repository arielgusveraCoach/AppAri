import { Linking } from 'react-native';
import { ActionHandler, ParsedIntent, ActionResponse } from '../core/types';

export class BrowserHandler implements ActionHandler {
  async handle(intent: ParsedIntent): Promise<ActionResponse> {
    const query = intent.parameters.query;
    if (!query) {
      return { success: false, message: () => "No entendí qué quieres buscar." };
    }

    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    try {
      await Linking.openURL(url);
      return {
        success: true,
        message: () => `Buscando ${query} en internet.`,
      };
    } catch (e) {
      return {
        success: false,
        message: () => "Hubo un error al intentar abrir el navegador.",
      };
    }
  }
}
