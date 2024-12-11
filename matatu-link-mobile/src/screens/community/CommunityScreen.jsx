// src/screens/community/CommunityScreen.jsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ContributionsTab from "./tabs/ContributionsTab";
import ReportsTab from "./tabs/ReportsTab";

const initialLayout = { width: "100%" };

const CommunityScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "contributions", title: "Contributions" },
    { key: "reports", title: "Reports" },
  ]);

  const renderScene = SceneMap({
    contributions: ContributionsTab,
    reports: ReportsTab,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#007AFF" }}
            style={{ backgroundColor: "#ffffff" }}
            activeColor="#007AFF" // Color for active tab text
            inactiveColor="#666666" // Color for inactive tab text
            labelStyle={{ fontWeight: "600" }} // Optional: makes text a bit bolder
          />

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CommunityScreen;

{/* <TabBar
  {...props}
  indicatorStyle={{ backgroundColor: "#007AFF" }}
  style={{ backgroundColor: "#ffffff" }}
  activeColor="#007AFF" // Color for active tab text
  inactiveColor="#666666" // Color for inactive tab text
  labelStyle={{ fontWeight: "600" }} // Optional: makes text a bit bolder
/>; */}
