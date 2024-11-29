// src/navigation/TabNavigator.jsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import MatatuListScreen from "../screens/matatu/MatatusScreen";
import RoutesScreen from "../screens/routes/RoutesScreen";
import PaymentScreen from "../screens/payment/PaymentScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import ProfileScreen from "../screens/profiles/ProfileScreen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for all tabs
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            case "Matatus":
              iconName = focused ? "bus" : "bus-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            case "Routes":
              iconName = focused ? "route" : "route";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Payment":
              iconName = focused ? "payment" : "payment";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Reports":
              iconName = focused ? "report" : "report-gmailerrorred";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            default:
              return (
                <Ionicons name="ellipse-outline" size={size} color={color} />
              );
          }
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matatus" component={MatatuListScreen} />
      <Tab.Screen name="Routes" component={RoutesScreen} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
