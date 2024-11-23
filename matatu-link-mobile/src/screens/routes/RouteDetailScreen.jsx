// src/screens/routes/RouteDetailScreen.jsx
import {React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import api from "../../api/config";

export default function RouteDetailScreen({ route }) {
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { routeId } = route.params;

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const response = await api.get(`/routes/${routeId}`);
        setRouteDetails(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch route details");
        console.error("Fetch Route Details Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [routeId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!routeDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Route not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{routeDetails.name}</Text>
      <Text style={styles.description}>{routeDetails.description}</Text>
      <FlatList
        data={routeDetails.stops}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.stopContainer}>
            <Text style={styles.stopName}>{item.name}</Text>
            <Text style={styles.stopDescription}>{item.description}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  stopContainer: {
    marginBottom: 10,
  },
  stopName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stopDescription: {
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

