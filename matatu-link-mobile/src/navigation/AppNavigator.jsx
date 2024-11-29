// src/navigation/AppNavigator.jsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TrackMatatusScreen from '../screens/TrackMatatusScreen'; // Placeholder
import RoutesScreen from '../screens/RoutesScreen'; // Placeholder
import FarePaymentScreen from '../screens/FarePaymentScreen'; // Placeholder
import ReportIssueScreen from '../screens/ReportIssueScreen'; // Placeholder
import ProfileScreen from '../screens/ProfileScreen'; // Placeholder
import { AuthProvider } from '../contexts/AuthContext';
import RootNavigator from './RootNavigator';

const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* Home Screen */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Hiding header as HomeScreen has its own header
      />

      {/* Quick Action Screens */}
      <Stack.Screen
        name="TrackMatatus"
        component={TrackMatatusScreen}
        options={{ title: "Track Matatus" }}
      />
      <Stack.Screen
        name="Routes"
        component={RoutesScreen}
        options={{ title: "Routes" }}
      />
      <Stack.Screen
        name="FarePayment"
        component={FarePaymentScreen}
        options={{ title: "Fare Payment" }}
      />
      <Stack.Screen
        name="ReportIssue"
        component={ReportIssueScreen}
        options={{ title: "Report Issue" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />

      {/* Add other screens as needed */}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <MainStackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
