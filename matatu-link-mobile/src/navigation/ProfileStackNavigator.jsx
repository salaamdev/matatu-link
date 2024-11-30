// src/navigation/ProfileStackNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import PaymentScreen from "../screens/profile/PaymentScreen";
import AddPaymentMethodScreen from "../screens/profile/AddPaymentMethodScreen"; // Import AddPaymentMethodScreen
import ReportDetailScreen from "../screens/profile/ReportDetailScreen"; // Import ReportDetailScreen

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileMain">
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: "Payment" }}
      />
      <Stack.Screen
        name="AddPaymentMethod"
        component={AddPaymentMethodScreen}
        options={{ title: "Add Payment Method" }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: "Report Detail" }}
      />
      {/* Add more screens here if needed */}
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
