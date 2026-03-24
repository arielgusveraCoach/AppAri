import { ActionHandler, ParsedIntent, ActionResponse } from '../core/types';

export class WeatherHandler implements ActionHandler {
  async handle(intent: ParsedIntent): Promise<ActionResponse> {
    // We would normally call OpenWeatherMap API here.
    // Simulating API response for prototype/offline demo.
    return {
      success: true,
      message: () => "Hoy se esperan 22 grados, cielo despejado y viento suave.",
      data: {
        temp: 22,
        condition: 'Sunny',
        wind: 'Light'
      }
    };
  }
}
