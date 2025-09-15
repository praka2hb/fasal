import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

// Import all the Fasal screens
import CropAdvisoryChatScreen from '../../screens/CropAdvisoryChatScreen';
import DashboardScreen from '../../screens/DashboardScreen';
import LandingScreen from '../../screens/LandingScreen';
import LoginScreen from '../../screens/LoginScreen';
import OTPVerificationScreen from '../../screens/OTPVerificationScreen';

export default function FasalApp() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userPhone, setUserPhone] = useState('');

  const navigateToScreen = (screen: string, phoneNumber?: string) => {
    if (phoneNumber) {
      setUserPhone(phoneNumber);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onNavigateToLogin={() => navigateToScreen('login')} />;
      case 'login':
        return <LoginScreen onNavigateToOTP={navigateToScreen} />;
      case 'otp':
        return <OTPVerificationScreen phoneNumber={userPhone} onNavigateToDashboard={() => navigateToScreen('dashboard')} />;
      case 'dashboard':
        return <DashboardScreen onNavigateToChat={(feature) => navigateToScreen(feature)} />;
      case 'crop-advisory':
        return <CropAdvisoryChatScreen onBack={() => navigateToScreen('dashboard')} />;
      default:
        return <LandingScreen onNavigateToLogin={() => navigateToScreen('login')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Current Screen */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
});
