// src/screens/home/HomeScreen.jsx

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapViewComponent from "./components/MapViewComponent";
import SearchBar from "./components/SearchBar";
import { Ionicons } from "@expo/vector-icons"; // For additional icons if needed

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = () => {
    if (searchQuery.trim() === "") {
      Alert.alert("Input Required", "Please enter a destination.");
      return;
    }

    // TODO: Implement search functionality
    // For example, navigate to a search results screen or fetch data from backend
    Alert.alert("Search", `You searched for: ${searchQuery}`);
  };

  return (
    <View style={styles.container}>
      <MapViewComponent />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmit={handleSearchSubmit}
      />
      {/* You can add more UI components here, such as buttons for quick actions */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
