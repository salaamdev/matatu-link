// src/screens/profile/ProfileScreen.jsx

import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SettingsTab from "./tabs/SettingsTab";
import PaymentTab from "./tabs/PaymentTab";
import ReportsTab from "./tabs/ReportsTab"; // Import ReportsTab

const initialLayout = { width: Dimensions.get("window").width };

const ProfileScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "settings", title: "Settings" },
    { key: "payment", title: "Payment" },
    { key: "reports", title: "Reports" }, // Add Reports tab
  ]);

  const renderScene = SceneMap({
    settings: SettingsTab,
    payment: PaymentTab,
    reports: ReportsTab, // Map ReportsTab
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#007AFF" }}
      style={{ backgroundColor: "#ffffff" }}
      labelStyle={{ color: "#000000", fontWeight: "bold" }}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    marginTop: 0,
  },
});

export default ProfileScreen;
