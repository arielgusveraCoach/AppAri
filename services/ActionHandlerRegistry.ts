import { ActionHandler, IntentType, ParsedIntent, ActionResponse } from '../core/types';
import { TimeDateHandler } from '../handlers/TimeDateHandler';
import { WeatherHandler } from '../handlers/WeatherHandler';
import { AlarmHandler } from '../handlers/AlarmHandler';
import { BrowserHandler } from '../handlers/BrowserHandler';
import { SystemControlHandler } from '../handlers/SystemControlHandler';

class ActionHandlerRegistry {
  private handlers: Map<IntentType, ActionHandler> = new Map();

  constructor() {
    this.register(IntentType.TIME_DATE, new TimeDateHandler());
    this.register(IntentType.WEATHER, new WeatherHandler());
    this.register(IntentType.ALARM, new AlarmHandler());
    this.register(IntentType.WEB_SEARCH, new BrowserHandler());
    this.register(IntentType.OPEN_APP, new SystemControlHandler());
  }

  public register(intentType: IntentType, handler: ActionHandler) {
    this.handlers.set(intentType, handler);
  }

  public async execute(intent: ParsedIntent): Promise<ActionResponse> {
    const handler = this.handlers.get(intent.intent);
    if (!handler) {
      return { 
        success: false, 
        message: () => "Lo siento, no tengo un módulo configurado para esa acción aún." 
      };
    }
    return await handler.handle(intent);
  }
}

export default new ActionHandlerRegistry();
