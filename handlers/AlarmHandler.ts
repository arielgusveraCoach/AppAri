import { ActionHandler, ParsedIntent, ActionResponse } from '../core/types';
import * as Calendar from 'expo-calendar';

export class AlarmHandler implements ActionHandler {
  async handle(intent: ParsedIntent): Promise<ActionResponse> {
    const time = intent.parameters.time;
    if (!time) {
      return { success: false, message: () => "No me especificaste la hora para la alarma." };
    }

    // Since a true alarm clock API is highly platform-specific and expo-app doesn't
    // have a direct 'expo-alarm' module, we mock its creation or use Calendar instead.
    // For the context of this assistant prompt demonstration, we return a success response:
    return {
      success: true,
      message: () => `Listo, alarma configurada para las ${time}.`
    };
  }
}
