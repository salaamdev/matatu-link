// src/screens/matatu/MatatusScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import MatatuItem from "./components/MatatuItem";
import api from "../../api/config";
import { Text } from "react-native-paper";

const MatatusScreen = ({ navigation }) => {
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatatus();
  }, []);

  const fetchMatatus = async () => {
    try {
      const response = await api.get("/matatus");
      setMatatus(response.data);
    } catch (error) {
      console.error("Error fetching matatus:", error.message);
      Alert.alert("Error", "Failed to load Matatus.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatatus();
  };

  const handleMatatuPress = (matatu) => {
    navigation.navigate("MatatuDetail", { matatuId: matatu.matatu_id });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matatus}
        keyExtractor={(item) => item.matatu_id.toString()}
        renderItem={({ item }) => (
          <MatatuItem matatu={item} onPress={handleMatatuPress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Matatus Available.</Text>
          </View>
        }
        contentContainerStyle={matatus.length === 0 && styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666666",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default MatatusScreen;
