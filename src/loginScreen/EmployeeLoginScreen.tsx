import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAdminLogin } from '../api/hook/useAdmin';
import { useAuthStore } from '../store/useAuthStore';

// Define the navigation param list locally or import it
type RootStackParamList = {
  EmployeeLoginScreen: undefined;
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmployeeLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useAdminLogin();

  const handleSignIn = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (data) => {
          if (data.token) {
            setToken(data.token);
            // AppStack handles the switch to MainTabs
          }
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || err?.message || 'Login failed';
          setError(errorMsg);
          Alert.alert('Login Error', errorMsg);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Branding Section */}
          <View style={styles.brandSection}>
            <Text style={styles.brandTitle}>Admin Panel</Text>
            <Text style={styles.brandSubtitle}>
              Sign in to manage your attendance system
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, error && !email ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color="#2FAED7" style={styles.inputIconPrefix} />
              <TextInput
                style={styles.textInput}
                placeholder="admin@example.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                editable={!loginMutation.isPending}
              />
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <View style={[styles.inputWrapper, error && !password ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color="#2FAED7" style={styles.inputIconPrefix} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                editable={!loginMutation.isPending}
              />
              <TouchableOpacity 
                style={styles.inputIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#A0AEC0" 
                />
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.signInButton, loginMutation.isPending && styles.signInButtonDisabled]} 
            activeOpacity={0.8}
            onPress={handleSignIn}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => Alert.alert('Support', 'Please contact system admin for credentials.')}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#5F738C',
    textAlign: 'center',
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    paddingHorizontal: 15,
  },
  inputIconPrefix: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    height: '100%',
  },
  inputIcon: {
    padding: 5,
  },
  signInButton: {
    backgroundColor: '#2995C0',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#2995C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#2995C0',
    fontWeight: '600',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
});

export default EmployeeLoginScreen;