import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

// Import Screens
import CompanyScreen from '../screens/company/CompanyScreen';
import Dashboard from '../screens/Dashboard';
import SettingScreen from '../screens/SettingScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'grid';

          if (route.name === 'Dashboard') {
            iconName = 'grid';
          } else if (route.name === 'Company') {
            iconName = 'briefcase';
          } else if (route.name === 'Subscription') {
            iconName = 'credit-card';
          } else if (route.name === 'Setting') {
            iconName = 'settings';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9A9EA7',
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Company" component={CompanyScreen} />
      <Tab.Screen name="Subscription" component={SubscriptionScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
