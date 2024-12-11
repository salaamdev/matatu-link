// src/navigation/ProfileStackNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import PaymentScreen from "../screens/profile/PaymentScreen";
import ReportsScreen from "../screens/profile/GenerateDBpdfsScreen";
import HelpScreen from "../screens/profile/HelpScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import AddPaymentMethodScreen from "../screens/profile/AddPaymentMethodScreen"; // Add this import

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
      <Stack.Screen // Add this screen
        name="AddPaymentMethod"
        component={AddPaymentMethodScreen}
        options={{ title: "Add Payment Method" }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: "Reports" }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: "Help" }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
