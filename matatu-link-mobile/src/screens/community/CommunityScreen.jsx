// src/screens/community/CommunityScreen.jsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ContributionsTab from "./tabs/ContributionsTab";
import ReportsTab from "./tabs/ReportsTab";
import { useAuth } from "../../contexts/AuthContext";
import { FAB } from "react-native-paper";

const initialLayout = { width: "100%" };

const CommunityScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "contributions", title: "Contributions" },
    { key: "reports", title: "Reports" },
  ]);

  // Function to navigate to Create Contribution screen
  const navigateToCreateContribution = () => {
    navigation.navigate("ContributionDetail", { isEdit: false });
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          contributions: ContributionsTab,
          reports: ReportsTab,
        })}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#007AFF" }}
            style={{ backgroundColor: "#ffffff" }}
            labelStyle={{ color: "#000000" }}
          />
        )}
      />

      {/* Floating Action Button to Add Contribution */}
      {index === 0 && (
        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={navigateToCreateContribution}
          label="Add Contribution"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#34C759",
  },
});

export default CommunityScreen;
