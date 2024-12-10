// src/navigation/CommunityStackNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityScreen from "../screens/community/CommunityScreen";
import ContributionDetailScreen from "../screens/community/ContributionDetailScreen";
import ReportDetailScreen from "../screens/community/ReportDetailScreen";
import CreateEditContribution from "../screens/community/forms/CreateEditContribution";
import CreateEditReport from "../screens/community/forms/CreateEditReport";

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
        options={{ title: "Contribution Details" }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: "Report Details" }}
      />
      <Stack.Screen
        name="CreateEditContribution"
        component={CreateEditContribution}
        options={({ route }) => ({
          title: route.params?.contributionId
            ? "Edit Contribution"
            : "New Contribution",
        })}
      />
      <Stack.Screen
        name="CreateEditReport"
        component={CreateEditReport}
        options={({ route }) => ({
          title: route.params?.reportId ? "Edit Report" : "New Report",
        })}
      />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
