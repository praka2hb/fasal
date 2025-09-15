import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';

interface LandingScreenProps {
  onNavigateToLogin: () => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigateToLogin }) => {
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const modalFadeAnim = React.useRef(new Animated.Value(0)).current;
  const modalSlideAnim = React.useRef(new Animated.Value(100)).current;

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  ];

  React.useEffect(() => {
    if (showLanguageModal) {
      // Show modal animation
      Animated.parallel([
        Animated.timing(modalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Show main screen animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showLanguageModal]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    
    // Hide modal with animation
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLanguageModal(false);
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Ionicons name="leaf" size={120} color="#E8F5E8" style={styles.leafIcon1} />
        <Ionicons name="leaf" size={80} color="#E8F5E8" style={styles.leafIcon2} />
        <Ionicons name="sunny" size={100} color="#FFF3E0" style={styles.sunIcon} />
      </View>
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* App Name */}
        <View style={styles.titleContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={40} color="#2E7D32" />
            <Text style={styles.appName}>Fasal</Text>
          </View>
          <View style={styles.accent} />
        </View>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          Smart Farming Advisory in your language.
        </Text>
        
        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color="#2E7D32" />
            <Text style={styles.featureText}>Crop Insights</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cloud" size={24} color="#2E7D32" />
            <Text style={styles.featureText}>Weather Alerts</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={24} color="#2E7D32" />
            <Text style={styles.featureText}>Disease Prevention</Text>
          </View>
        </View>
        
        {/* Selected Language Display */}
        {selectedLanguage && (
          <TouchableOpacity 
            style={styles.languageDisplay}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageFlag}>{selectedLanguage.flag}</Text>
            <Text style={styles.languageText}>{selectedLanguage.nativeName}</Text>
            <Ionicons name="chevron-down" size={16} color="#2E7D32" />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
          onPress={onNavigateToLogin}
          icon="arrow-right"
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
        
        <Text style={styles.supportText}>
          Join thousands of farmers already using Fasal
        </Text>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: modalFadeAnim,
                transform: [{ translateY: modalSlideAnim }],
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="language" size={32} color="#2E7D32" />
              </View>
              <Text style={styles.modalTitle}>Choose Your Language</Text>
              <Text style={styles.modalSubtitle}>
                Select your preferred language for the best farming experience
              </Text>
            </View>

            {/* Language List */}
            <ScrollView 
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            >
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    index === languages.length - 1 && styles.lastLanguageOption
                  ]}
                  onPress={() => handleLanguageSelect(language)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageOptionFlag}>{language.flag}</Text>
                  <View style={styles.languageOptionText}>
                    <Text style={styles.languageOptionName}>{language.name}</Text>
                    <Text style={styles.languageOptionNative}>{language.nativeName}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>
                You can change this later in settings
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  leafIcon1: {
    position: 'absolute',
    top: 100,
    right: -30,
    transform: [{ rotate: '15deg' }],
  },
  leafIcon2: {
    position: 'absolute',
    bottom: 200,
    left: -20,
    transform: [{ rotate: '-25deg' }],
  },
  sunIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 8,
    textAlign: 'center',
  },
  accent: {
    width: 80,
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 32,
    alignItems: 'center',
    zIndex: 1,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    borderRadius: 16,
    width: '100%',
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  supportText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  languageDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  languageList: {
    maxHeight: 300,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastLanguageOption: {
    borderBottomWidth: 0,
  },
  languageOptionFlag: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  languageOptionText: {
    flex: 1,
  },
  languageOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  languageOptionNative: {
    fontSize: 14,
    color: '#666',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  modalFooterText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LandingScreen;
