import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from 'react-native-paper';

interface OTPVerificationScreenProps {
  phoneNumber: string;
  onNavigateToDashboard: () => void;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ 
  phoneNumber, 
  onNavigateToDashboard 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const inputs = useRef<TextInput[]>([]);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (value: string, index: number) => {
    if (!value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const validateOTP = () => {
    const otpString = otp.join('');
    return otpString.length === 6;
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleVerify = async () => {
    if (!validateOTP()) {
      shakeAnimation();
      Alert.alert('Invalid OTP', 'Please enter all 6 digits');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call - accept any 6-digit OTP
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success!',
        'Phone number verified successfully',
        [
          {
            text: 'Continue',
            onPress: onNavigateToDashboard,
          },
        ],
        { cancelable: false }
      );
    }, 1500);
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
    
    Alert.alert('OTP Resent', 'A new verification code has been sent to your number');
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={48} color="#2E7D32" />
          </View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* OTP Input Boxes */}
          <Animated.View 
            style={[
              styles.otpContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref!)}
                style={[
                  styles.otpInput,
                  {
                    borderColor: otp[index] ? '#2E7D32' : '#E0E0E0',
                    backgroundColor: otp[index] ? '#E8F5E8' : '#FFFFFF',
                  }
                ]}
                maxLength={1}
                keyboardType="numeric"
                textAlign="center"
                placeholder="0"
                placeholderTextColor="#CCC"
                value={otp[index]}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(otp[index], index);
                  }
                }}
                autoFocus={index === 0}
              />
            ))}
          </Animated.View>
          
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {otp.filter(digit => digit).length}/6 digits entered
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(otp.filter(digit => digit).length / 6) * 100}%` }
                ]}
              />
            </View>
          </View>
          
          {/* Resend Text */}
          <View style={styles.resendContainer}>
            {resendDisabled ? (
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.countdownText}>{countdown}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendLink}>
                  Didn't receive code? Resend
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Verify Button */}
          <Button
            mode="contained"
            style={[
              styles.verifyButton,
              { 
                backgroundColor: loading ? '#A5D6A7' : (validateOTP() ? '#2E7D32' : '#C8E6C9'),
                opacity: validateOTP() ? 1 : 0.7,
              }
            ]}
            labelStyle={styles.verifyButtonText}
            onPress={handleVerify}
            loading={loading}
            disabled={loading || !validateOTP()}
            icon={loading ? undefined : "check-circle"}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
          
          <View style={styles.helpContainer}>
            <Ionicons name="information-circle" size={16} color="#666" />
            <Text style={styles.helpText}>
              For testing, enter any 6-digit code
            </Text>
          </View>
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
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 58,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '60%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  countdownText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
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
  verifyButtonText: {
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
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default OTPVerificationScreen;
