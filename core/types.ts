export enum IntentType {
  WEATHER = 'WEATHER',
  ALARM = 'ALARM',
  WEB_SEARCH = 'WEB_SEARCH',
  MESSAGE = 'MESSAGE',
  CALL = 'CALL',
  SYSTEM_CONTROL = 'SYSTEM_CONTROL',
  TIME_DATE = 'TIME_DATE',
  OPEN_APP = 'OPEN_APP',
  UNKNOWN = 'UNKNOWN',
}

export interface ParsedIntent {
  intent: IntentType;
  parameters: Record<string, any>;
  confidence: number;
}

export interface ActionResponse {
  success: boolean;
  message: () => string; // Response to speak
  data?: any;
}

export interface ActionHandler {
  handle(intent: ParsedIntent): Promise<ActionResponse>;
}
