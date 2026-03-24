import * as Speech from 'expo-speech';

class TTSService {
  public async speak(text: string, options?: Speech.SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      Speech.speak(text, {
        ...options,
        onDone: () => resolve(),
        onError: (error) => reject(new Error(`TTS Error: ${error.message || error}`)),
      });
    });
  }

  public async stop(): Promise<void> {
    await Speech.stop();
  }

  public async getAvailableVoices(): Promise<Speech.Voice[]> {
    return await Speech.getAvailableVoicesAsync();
  }
}

export default new TTSService();
