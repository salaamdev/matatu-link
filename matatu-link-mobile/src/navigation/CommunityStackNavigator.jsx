// src/navigation/CommunityStackNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../screens/community/CommunityScreen";
import ContributionDetailScreen from "../screens/community/ContributionDetailScreen";
import ReportDetailScreen from "../screens/community/ReportDetailScreen";

const Stack = createNativeStackNavigator();

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CommunityMain">
      <Stack.Screen
        name="CommunityMain"
        component={CommunityScreen}
        options={{ title: "Community" }}
      />
      <Stack.Screen
        name="ContributionDetail"
        component={ContributionDetailScreen}
        options={({ route }) => ({
          title: route.params?.isEdit
            ? "Edit Contribution"
            : "Contribution Detail",
        })}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: "Report Detail" }}
      />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
