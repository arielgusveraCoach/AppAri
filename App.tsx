import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Mic, MicOff, Settings, Activity } from './core/icons';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';

// Core Services
import IntentRecognizer from './intents/IntentRecognizer';
import ActionHandlerRegistry from './services/ActionHandlerRegistry';
import TTSService from './services/TTSService';

const { width } = Dimensions.get('window');

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Animations
  const pulseScale = useSharedValue(1);

  // Check Permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (status === 'granted') {
          setHasPermissions(true);
        }
      } catch (e) {
        console.warn('Speech permission error', e);
      }
    })();
  }, []);

  // Events
  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    setTranscript('');
    pulseScale.value = withRepeat(withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    pulseScale.value = withTiming(1);
    // Process on End
    if (transcript.length > 0 && !isProcessing) {
      processCommand(transcript);
    }
  });

  useSpeechRecognitionEvent('result', (event) => {
    const speechResult = event.results[0]?.alternatives[0]?.transcript;
    if (speechResult) {
      setTranscript(speechResult);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech recognition error:', event);
    setIsListening(false);
    pulseScale.value = withTiming(1);
  });

  const toggleListening = async () => {
    if (!hasPermissions) {
      alert("Se requieren permisos de micrófono.");
      return;
    }

    try {
      if (isListening) {
        ExpoSpeechRecognitionModule.stop();
      } else {
        await TTSService.stop();
        ExpoSpeechRecognitionModule.start({
          lang: 'es-ES',
          interimResults: true,
          maxAlternatives: 1
        });
      }
    } catch (e) {
      console.warn("Speech start error", e);
    }
  };

  const processCommand = async (text: string) => {
    setIsProcessing(true);
    // User message
    const msgs = [...messages, { role: 'user' as const, text }];
    setMessages(msgs);

    // AI Intent and Handle
    const intent = IntentRecognizer.parse(text);
    const response = await ActionHandlerRegistry.execute(intent);

    // AI Response
    const responseText = response.message();
    setMessages([...msgs, { role: 'assistant' as const, text: responseText }]);

    // Speak
    await TTSService.speak(responseText, { language: 'es-ES', rate: 1.0 });
    
    setIsProcessing(false);
    setTranscript('');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hola, soy tu asistente</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings color="#E0E0E0" size={24} />
        </TouchableOpacity>
      </View>

      {/* History Area */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        {messages.map((m, idx) => (
          <View key={idx} style={[styles.messageBubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={styles.messageText}>{m.text}</Text>
          </View>
        ))}
        {transcript.length > 0 && (
          <View style={[styles.messageBubble, styles.userBubble, { opacity: 0.6 }]}>
            <Text style={styles.messageText}>{transcript}...</Text>
          </View>
        )}
      </ScrollView>

      {/* Voice Button Area */}
      <View style={styles.bottomArea}>
        {isListening && <Text style={styles.statusText}>Escuchando...</Text>}
        {isProcessing && <Text style={styles.statusText}>Procesando...</Text>}
        
        <View style={styles.micContainer}>
          <Animated.View style={[styles.pulseCircle, animatedStyle, { backgroundColor: isListening ? 'rgba(78,205,196,0.3)' : 'transparent' }]} />
          <TouchableOpacity 
            style={[styles.micButton, isListening && styles.micButtonListening]} 
            onPress={toggleListening}
          >
            {isListening ? (
              <Activity stroke="#FFF" width={32} height={32} />
            ) : (
              <Mic stroke="#FFF" width={32} height={32} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 30, // SafeArea fallback
  },
  headerTitle: {
    color: '#E0E0E0',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsBtn: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    marginVertical: 8,
  },
  userBubble: {
    backgroundColor: '#3A3A3C',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#262626',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#F0F0F0',
    fontSize: 16,
    lineHeight: 24,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(18,18,18,0.85)',
  },
  statusText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 10,
    letterSpacing: 1,
  },
  micContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  micButtonListening: {
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
  }
});
