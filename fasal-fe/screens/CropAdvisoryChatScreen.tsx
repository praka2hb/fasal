import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SoilType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  characteristics: string[];
}

interface CropAdvisoryChatScreenProps {
  onBack: () => void;
}

const CropAdvisoryChatScreen: React.FC<CropAdvisoryChatScreenProps> = ({ onBack }) => {
  const [selectedSoil, setSelectedSoil] = useState<SoilType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSoilOptions, setShowSoilOptions] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const soilTypes: SoilType[] = [
    {
      id: 'clay',
      name: 'Clay Soil',
      description: 'Heavy, sticky soil that holds water well',
      icon: '🟤',
      color: '#8D6E63',
      characteristics: ['Heavy texture', 'Good water retention', 'Rich in nutrients', 'Hard when dry']
    },
    {
      id: 'sandy',
      name: 'Sandy Soil',
      description: 'Light, grainy soil that drains quickly',
      icon: '🟨',
      color: '#FFC107',
      characteristics: ['Light texture', 'Quick drainage', 'Easy to work', 'Low water retention']
    },
    {
      id: 'loamy',
      name: 'Loamy Soil',
      description: 'Perfect mix of clay, sand, and silt',
      icon: '🟫',
      color: '#795548',
      characteristics: ['Ideal texture', 'Good drainage', 'High fertility', 'Easy to cultivate']
    },
    {
      id: 'silty',
      name: 'Silty Soil',
      description: 'Smooth, fine particles with good fertility',
      icon: '🟩',
      color: '#689F38',
      characteristics: ['Fine texture', 'Good fertility', 'Moderate drainage', 'Smooth feel']
    },
    {
      id: 'peaty',
      name: 'Peaty Soil',
      description: 'Dark, organic-rich soil with high moisture',
      icon: '🟫',
      color: '#3E2723',
      characteristics: ['High organic matter', 'Very fertile', 'Dark color', 'High moisture']
    },
    {
      id: 'chalky',
      name: 'Chalky Soil',
      description: 'Alkaline soil with limestone content',
      icon: '⚪',
      color: '#9E9E9E',
      characteristics: ['Alkaline pH', 'Well draining', 'Rocky texture', 'Low fertility']
    }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Initialize chat with welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "Hello! I'm your farming assistant. I'm here to help you with personalized crop recommendations and farming advice. To get started, could you please tell me what type of soil you have?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Add keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedSoil) {
      const soilConfirmMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Great! I see you have ${selectedSoil.name}. This type of soil ${selectedSoil.description.toLowerCase()}. I'm here to help you with crop recommendations and farming advice. What would you like to know?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, soilConfirmMessage]);
      setShowSoilOptions(false);
    }
  }, [selectedSoil]);

  const handleSoilSelect = (soil: SoilType) => {
    // Dismiss keyboard if open
    Keyboard.dismiss();
    
    // Add user message showing selection
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I have ${soil.name}`,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setSelectedSoil(soil);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Dismiss keyboard
      Keyboard.dismiss();
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "Based on your soil type, I recommend these crops for the current season...",
          "That's a great question! For your soil type, you should consider...",
          "Here are some specific tips for managing your soil effectively...",
          "I understand your concern. Let me provide some practical solutions...",
        ];
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      Alert.alert(
        'Voice Input',
        'Voice recording started. Speak your question and tap the microphone again to stop.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Voice Input',
        'Voice recording stopped. Processing your message...',
        [{ text: 'OK' }]
      );
      
      // Simulate voice to text
      setTimeout(() => {
        setInputText('What crops should I plant in my soil?');
      }, 1500);
    }
  };

  const renderSoilOptions = () => (
    <View style={styles.soilOptionsContainer}>
      <Text style={styles.soilOptionsTitle}>Choose your soil type:</Text>
      <View style={styles.soilOptionsGrid}>
        {soilTypes.map((soil) => (
          <TouchableOpacity
            key={soil.id}
            style={[
              styles.soilOptionButton,
              { borderColor: soil.color, backgroundColor: soil.color + '10' }
            ]}
            onPress={() => handleSoilSelect(soil)}
            activeOpacity={0.7}
          >
            <Text style={styles.soilOptionEmoji}>{soil.icon}</Text>
            <Text style={[styles.soilOptionText, { color: soil.color }]}>
              {soil.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIcon}>
                <Ionicons name="leaf" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Fasal Assistant</Text>
                {selectedSoil && (
                  <Text style={styles.headerSubtitle}>
                    {selectedSoil.icon} {selectedSoil.name} • Online
                  </Text>
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.chatContent}
            contentContainerStyle={styles.chatContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
                ]}
              >
                {!message.isUser && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="leaf" size={16} color="#FFFFFF" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      message.isUser ? styles.userMessageTime : styles.aiMessageTime,
                    ]}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
            
            {/* Show soil options after initial message */}
            {showSoilOptions && messages.length > 0 && renderSoilOptions()}
          </ScrollView>
        </TouchableWithoutFeedback>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask about crops, fertilizers, farming tips..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => {
                if (inputText.trim()) {
                  handleSendMessage();
                }
              }}
              blurOnSubmit={true}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.voiceButton,
                { backgroundColor: isRecording ? '#FF5252' : '#E8F5E8' }
              ]}
              onPress={handleVoiceInput}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={20} 
                color={isRecording ? "#FFFFFF" : "#2E7D32"} 
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: inputText.trim() ? 1 : 0.5 }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#2E7D32',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#1B5E20',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#E8F5E8',
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.9,
  },
  menuButton: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  placeholder: {
    width: 40,
  },
  soilOptionsContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: '#E8F5E8',
  },
  soilOptionsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  soilOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  soilOptionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    minHeight: 60,
  },
  soilOptionEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  soilOptionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  chatContent: {
    flex: 1,
  },
  chatContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userMessageBubble: {
    backgroundColor: '#2E7D32',
    borderBottomRightRadius: 6,
  },
  aiMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#E8F5E8',
  },
  aiMessageTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
    alignItems: 'flex-end',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 80,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'flex-end',
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: '#E8F5E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  voiceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#1B5E20',
  },
});

export default CropAdvisoryChatScreen;

