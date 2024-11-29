// src/navigation/AppNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MatatuListScreen from "../screens/matatu/MatatuListScreen";
import MatatuDetailScreen from "../screens/matatu/MatatuDetailScreen";
import RouteListScreen from "../screens/routes/RouteListScreen";
import RouteDetailScreen from "../screens/routes/RouteDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MatatuList">
      <Stack.Screen
        name="MatatuList"
        component={MatatuListScreen}
        options={{ title: "Matatu List" }}
      />
      <Stack.Screen
        name="MatatuDetail"
        component={MatatuDetailScreen}
        options={{ title: "Matatu Detail" }}
      />
      <Stack.Screen
        name="RouteList"
        component={RouteListScreen}
        options={{ title: "Route List" }}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{ title: "Route Detail" }}
      />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
}
