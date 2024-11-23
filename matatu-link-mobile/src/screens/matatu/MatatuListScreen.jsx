// src/screens/matatu/MatatuListScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../api/config";

export default function MatatuListScreen({ navigation }) {
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatatus = async () => {
    try {
      const response = await api.get("/matatus");
      setMatatus(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch matatus");
      console.error("Fetch Matatus Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchMatatus();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("MatatuDetail", { matatuId: item.matatu_id })
      }
    >
      <View>
        <Text style={styles.registrationNumber}>
          {item.registration_number}
        </Text>
        <Text style={styles.details}>
          {item.make} {item.model} ({item.year || "N/A"})
        </Text>
        <Text style={styles.status}>Status: {item.current_status}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={matatus}
      keyExtractor={(item) => item.matatu_id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No matatus available</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registrationNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#888",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
