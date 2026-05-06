import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// --- Navigation Types ---
type RootStackParamList = {
  EmployeeLoginScreen: undefined;
  MainTabs: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setToken = useAuthStore((state) => state.setToken);
  
  // Animation values for premium entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const { theme, toggleTheme, isDarkMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to exit the secure admin portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            setToken(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDarkMode ? '#121212' : '#4338CA'} />
      
      {/* Dynamic Corporate Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#4338CA' }]}>
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: '#FFF' }]}>Account</Text>
            <TouchableOpacity style={styles.headerAction} onPress={toggleTheme}>
              <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
        ]}
      >
        {/* Profile Identity Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarGradient, { backgroundColor: isDarkMode ? '#333' : '#EEF2FF' }]}>
              <View style={[styles.avatarBox, { backgroundColor: theme.card }]}>
                <Text style={[styles.avatarText, { color: isDarkMode ? theme.text : '#4F46E5' }]}>A</Text>
              </View>
            </View>
            <View style={[styles.activeStatus, { borderColor: theme.card }]} />
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>Admin User</Text>
          <View style={[styles.roleBadge, { backgroundColor: isDarkMode ? '#333' : '#F5F7FF' }]}>
            <MaterialIcons name="verified-user" size={14} color={isDarkMode ? theme.primary : "#6366F1"} />
            <Text style={[styles.userRole, { color: isDarkMode ? theme.text : "#6366F1" }]}>Master Administrator</Text>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.metricsBar, { borderTopColor: theme.border }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.text }]}>Active</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Status</Text>
            </View>
            <View style={[styles.metricItem, styles.metricBorder, { borderLeftColor: theme.border, borderRightColor: theme.border }]}>
              <Text style={[styles.metricVal, { color: theme.text }]}>Full</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Access</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.text }]}>v1.0.2</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Build</Text>
            </View>
          </View>
        </View>

        {/* Action Controls Section */}
        <View style={styles.sectionDivider}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Security & Access</Text>
        </View>

        <View style={[styles.actionCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity 
            style={styles.actionRow} 
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </View>
            <View style={styles.actionLabelContent}>
              <Text style={[styles.actionMainTitle, { color: theme.text }]}>Sign Out</Text>
              <Text style={[styles.actionSubTitle, { color: theme.textSecondary }]}>Securely end persistent session</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.border} />
          </TouchableOpacity>
        </View>

        {/* Brand Presence Footer */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={[styles.brandMark, { backgroundColor: isDarkMode ? theme.primary : '#4338CA' }]} />
            <Text style={[styles.brandName, { color: theme.text }]}>SYMBOSYS</Text>
          </View>
          <Text style={[styles.legalLabel, { color: theme.textSecondary }]}>Corporate Security Standards Certified</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 220,
    backgroundColor: '#4338CA',
    overflow: 'hidden',
  },
  headerCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -40,
    right: -40,
  },
  headerCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    left: -10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: 'serif',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  content: {
    flex: 1,
    marginTop: -100,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 3,
    backgroundColor: '#EEF2FF',
  },
  avatarBox: {
    flex: 1,
    borderRadius: 52,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#4F46E5',
    fontFamily: 'serif',
  },
  activeStatus: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'serif',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 20,
  },
  userRole: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'serif',
  },
  metricsBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
    width: '100%',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'serif',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    fontFamily: 'serif',
  },
  sectionDivider: {
    marginTop: 28,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'serif',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionLabelContent: {
    flex: 1,
  },
  actionMainTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'serif',
  },
  actionSubTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'serif',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandMark: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#4338CA',
    marginRight: 10,
    transform: [{ rotate: '45deg' }],
  },
  brandName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#374151',
    letterSpacing: 2,
    fontFamily: 'serif',
  },
  legalLabel: {
    fontSize: 11,
    color: '#D1D5DB',
    fontWeight: '500',
    fontFamily: 'serif',
  },
});

export default ProfileScreen;