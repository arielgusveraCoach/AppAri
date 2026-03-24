# Asistente de Voz Inteligente

Aplicación móvil multiplataforma (iOS & Android) construida con React Native (Expo). Actúa como asistente de voz capaz de escuchar, procesar (NLP local), ejecutar comandos y hablar la respuesta de forma natural.

## 🚀 Requisitos Técnicos Principales

- React Native con Expo `npx create-expo-app`
- Reanimated para UI fluida
- Módulos nativos (`expo-speech`, `expo-speech-recognition`, `expo-calendar`)

## 🛠 Instalación y Configuración

1. **Instalar Dependencias**
   Abre la terminal en este directorio y ejecuta:
   ```bash
   npm install
   ```
2. **Construir Cliente Nativo (Requerido para Speech Recognition)**
   La librería `expo-speech-recognition` requiere ser compilada de forma nativa. No funciona en *Expo Go*.
   - **Para Android:** 
     Requiere *Android Studio*. Ejecuta: `npx expo run:android` o `npm run android`
   - **Para iOS:** 
     Requiere *macOS* y *Xcode*. Ejecuta `npx expo run:ios` o `npm run ios`

## 🧠 Arquitectura Modular

- **`/core`**: Interfaces typescript base.
- **`/intents`**: Motor de reconocimiento de lenguaje e intenciones offline usando Regex Extractor centralizado.
- **`/handlers`**: Ejecutores de la acción (Clima, Buscador web, Ajustes).
- **`/services`**: Envoltorios de APIs Nativas (TTSService para hablar).

## 📊 Entrenamiento (Opcional)
Se ha adjuntado el archivo `/training/dataset.json` con ejemplos en formato intent-entity. Estos pueden importarse a plataformas como Dialogflow, Wit.ai o finetuning offline (Whisper+LLaMa) para mejorar la comprensión de intenciones complejas del asistente sin alterar la arquitectura, modificando la clase `IntentRecognizer`.

## 🔒 Privacidad y Seguridad
Este código **no guarda ninguna transcripción** en la nube. El procesamiento de audios es interceptado localmente, y la transcripción se hace a través del motor del Sistema Operativo sin ser enviada a nuestros servidores. Los handlers accionan localmente sin almacenar el historial del usuario permanentemente.
