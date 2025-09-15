import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DashboardScreenProps {
  onNavigateToChat: (feature: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToChat }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const featureCards = [
    {
      id: 1,
      icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Crop Advisory',
      subtitle: 'Get expert advice for your crops',
      bgColor: '#E8F5E8',
      iconColor: '#2E7D32',
    },
    {
      id: 2,
      icon: 'bug-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Pest & Disease Help',
      subtitle: 'Identify and treat crop issues',
      bgColor: '#FFF3E0',
      iconColor: '#F57C00',
    },
    {
      id: 3,
      icon: 'cloudy-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Weather Updates',
      subtitle: 'Stay updated with weather forecasts',
      bgColor: '#E3F2FD',
      iconColor: '#1976D2',
    },
  ];

  const quickStats = [
    { label: 'Active Crops', value: '3', icon: 'leaf' },
    { label: 'Alerts', value: '2', icon: 'warning' },
    { label: 'Reports', value: '15', icon: 'document-text' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.welcomeText}>Welcome to Fasal! 🌱</Text>
                <Text style={styles.subHeaderText}>
                  Your farming companion for better yields
                </Text>
              </View>
              <TouchableOpacity style={styles.profileIcon}>
                <Ionicons name="person-circle" size={40} color="#2E7D32" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons 
                  name={stat.icon as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color="#2E7D32" 
                />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          
          {/* Feature Cards */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Main Features</Text>
            {featureCards.map((card, index) => (
              <Animated.View
                key={card.id}
                style={{
                  transform: [{
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  }],
                  opacity: fadeAnim,
                }}
              >
                <TouchableOpacity
                  style={styles.featureCard}
                  onPress={() => {
                    if (card.title === 'Crop Advisory') {
                      onNavigateToChat('crop-advisory');
                    } else {
                      console.log(`${card.title} pressed`);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cardIcon, { backgroundColor: card.bgColor }]}>
                    <Ionicons 
                      name={card.icon} 
                      size={32} 
                      color={card.iconColor} 
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </View>
                  <View style={styles.cardArrow}>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color="#999" 
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          
          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.helpCard}>
              <Ionicons name="headset" size={32} color="#2E7D32" />
              <Text style={styles.helpTitle}>Need Expert Help?</Text>
              <Text style={styles.supportText}>
                Connect with our farming experts anytime
              </Text>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    maxWidth: '80%',
  },
  profileIcon: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2E7D32',
    marginTop: 12,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontWeight: '500',
  },
  cardArrow: {
    marginLeft: 12,
  },
  bottomSection: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 8,
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  contactButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default DashboardScreen;
