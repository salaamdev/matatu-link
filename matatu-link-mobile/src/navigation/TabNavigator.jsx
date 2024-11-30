import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator";
import MatatusStackNavigator from "./MatatusStackNavigator";
import RoutesStackNavigator from "./RoutesStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import CommunityStackNavigator from "./CommunityStackNavigator";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
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
              iconName = "route";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Community":
              iconName = focused ? "people" : "people-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
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
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Matatus" component={MatatusStackNavigator} />
      <Tab.Screen name="Routes" component={RoutesStackNavigator} />
      <Tab.Screen name="Community" component={CommunityStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
