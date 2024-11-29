// src/navigation/MatatusStackNavigator.jsx

import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MatatusScreen from "../screens/matatu/MatatusScreen";
import MatatuDetailScreen from "../screens/matatu/MatatuDetailScreen";

const Stack = createStackNavigator();

const MatatusStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MatatusList">
      <Stack.Screen
        name="MatatusList"
        component={MatatusScreen}
        options={{ title: "Matatus" }}
      />
      <Stack.Screen
        name="MatatuDetail"
        component={MatatuDetailScreen}
        options={{ title: "Matatu Details" }}
      />
    </Stack.Navigator>
  );
};

export default MatatusStackNavigator;
