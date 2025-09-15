import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

interface LoginScreenProps {
  onNavigateToOTP: (screen: string, phoneNumber: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToOTP }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length === 10;
  };

  const handleSendOTP = async () => {
    setError('');
    
    if (!phoneNumber) {
      setError('Please enter your mobile number');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'OTP Sent!',
        `Verification code sent to +91 ${phoneNumber}`,
        [
          {
            text: 'OK',
            onPress: () => onNavigateToOTP('otp', phoneNumber),
          },
        ],
        { cancelable: false }
      );
    }, 1500);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait" size={48} color="#2E7D32" />
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to continue your farming journey
          </Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  mode="outlined"
                  label="Mobile Number"
                  placeholder="Enter 10-digit number"
                  style={styles.input}
                  outlineColor={error ? "#FF5252" : "#E0E0E0"}
                  activeOutlineColor={error ? "#FF5252" : "#2E7D32"}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  error={!!error}
                  right={phoneNumber.length === 10 ? 
                    <TextInput.Icon icon="check-circle" iconColor="#2E7D32" /> : null
                  }
                />
              </View>
            </View>
            
            <View style={styles.helperTextContainer}>
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
              
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <HelperText type="info">
                  {10 - phoneNumber.length} more digits needed
                </HelperText>
              )}
            </View>
          </View>
          
          <Button
            mode="contained"
            style={[
              styles.otpButton,
              { backgroundColor: loading ? '#A5D6A7' : '#2E7D32' }
            ]}
            labelStyle={styles.otpButtonText}
            onPress={handleSendOTP}
            loading={loading}
            disabled={loading}
            icon={loading ? undefined : "send"}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
          
          <View style={styles.helpContainer}>
            <Ionicons name="information-circle" size={16} color="#666" />
            <Text style={styles.helpText}>
              We'll send a 6-digit verification code to your number
            </Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 32,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 56,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  textInputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  helperTextContainer: {
    minHeight: 40,
    justifyContent: 'flex-start',
  },
  otpButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    borderRadius: 16,
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
  otpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  linkText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});

export default LoginScreen;
