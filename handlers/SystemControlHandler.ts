import { ActionHandler, ParsedIntent, ActionResponse } from '../core/types';
import { Linking } from 'react-native';

export class SystemControlHandler implements ActionHandler {
  async handle(intent: ParsedIntent): Promise<ActionResponse> {
    const app = intent.parameters.app?.toLowerCase() || '';

    if (!app) {
      return { success: false, message: () => "No especificaste qué aplicación abrir." };
    }

    // Mapping known apps to their URL Schemes
    const urlSchemes: Record<string, string> = {
      'whatsapp': 'whatsapp://',
      'spotify': 'spotify://',
      'youtube': 'youtube://',
      'calendario': 'calshow://',
      'mensajes': 'sms://',
      'ajustes': 'app-settings:'
    };

    let urlToOpen = undefined;
    
    // Find matching scheme
    for (const [key, scheme] of Object.entries(urlSchemes)) {
      if (app.includes(key)) {
        urlToOpen = scheme;
        break;
      }
    }

    if (urlToOpen) {
      try {
        await Linking.openURL(urlToOpen);
        return { success: true, message: () => `Abriendo ${app}.` };
      } catch (e) {
        return { success: false, message: () => `No pude abrir la aplicación ${app}. Puede que no esté instalada.` };
      }
    } else {
       return { success: false, message: () => `No tengo configurado el acceso directo a la aplicación ${app}.` };
    }
  }
}
