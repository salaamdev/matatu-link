// src/navigation/CommunityStackNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../screens/community/CommunityScreen";
import ContributionDetailScreen from "../screens/community/ContributionDetailScreen";
import ReportDetailScreen from "../screens/community/ReportDetailScreen"; // Add this import

const Stack = createNativeStackNavigator();

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommunityMain"
        component={CommunityScreen}
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="ContributionDetail"
        component={ContributionDetailScreen}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: "Report Details" }}
      />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
