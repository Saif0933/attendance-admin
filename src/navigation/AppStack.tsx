import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import EmployeeLoginScreen from '../loginScreen/EmployeeLoginScreen';
import InvoiceDetailsScreen from '../screens/company/InvoiceDetailsScreen';
import { useAuthStore } from '../store/useAuthStore';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const AppStack = () => { 
  const token = useAuthStore((state) => state.token);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if store has rehydrated from AsyncStorage
    const checkHydration = async () => {
      // Zustand persist rehydrates asynchronously on RN
      // We wait for it to be ready
      await useAuthStore.persist.rehydrate();
      setIsHydrated(true);
    };

    checkHydration();
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <ActivityIndicator size="large" color="#2D9CDB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen 
            name="EmployeeLoginScreen" 
            component={EmployeeLoginScreen} 
          />
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={BottomTabNavigator} 
            />
            <Stack.Screen 
              name="InvoiceDetails" 
              component={InvoiceDetailsScreen} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
