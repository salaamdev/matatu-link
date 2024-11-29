// src/screens/routes/RouteDetailScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Card, Button, List } from "react-native-paper";
import { getRouteById, deleteRoute } from "../../api/routes";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const RouteDetailScreen = ({ route, navigation }) => {
  const { routeId } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRouteDetails();
  }, []);

  const fetchRouteDetails = async () => {
    try {
      const data = await getRouteById(routeId);
      setRouteData(data);
    } catch (error) {
      console.error("Error fetching route details:", error.message);
      Alert.alert("Error", "Failed to load route details.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoute = () => {
    navigation.navigate("AddEditRoute", { isEdit: true, routeData });
  };

  const handleDeleteRoute = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this route?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoute(routeId);
              Alert.alert("Success", "Route deleted successfully.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting route:", error.message);
              Alert.alert("Error", "Failed to delete route.");
            }
          },
        },
      ]
    );
  };

  if (loading || !routeData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={routeData.route_name || "Unnamed Route"}
          subtitle={`Fare: KES ${routeData.fare || "N/A"}`}
          left={(props) => <Ionicons name="route" size={24} color="#007AFF" />}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Description: {routeData.description || "No description provided."}
          </Text>
          <Text style={styles.detailText}>
            Status: {routeData.is_active ? "Active" : "Inactive"}
          </Text>
          {/* Display connected stops if available */}
          {routeData.connectedStops && routeData.connectedStops.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Connected Stops:</Text>
              {routeData.connectedStops.map((stop) => (
                <List.Item
                  key={stop.stop_id}
                  title={stop.stop_name}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                />
              ))}
            </View>
          )}
          {/* Display assigned matatus if available */}
          {routeData.routeMatatus && routeData.routeMatatus.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Assigned Matatus:</Text>
              {routeData.routeMatatus.map((matatu) => (
                <List.Item
                  key={matatu.matatu_id}
                  title={matatu.registration_number}
                  description={`Model: ${matatu.model || "N/A"}`}
                  left={(props) => <List.Icon {...props} icon="bus" />}
                />
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {user?.userRole?.role_name === "admin" && (
        <View style={styles.adminActions}>
          <Button
            mode="contained"
            icon="pencil"
            onPress={handleEditRoute}
            style={styles.button}
          >
            Edit Route
          </Button>
          <Button
            mode="contained"
            icon="delete"
            onPress={handleDeleteRoute}
            style={[styles.button, styles.deleteButton]}
          >
            Delete Route
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    marginTop: 5,
  },
  listContainer: {
    marginTop: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  adminActions: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: "80%",
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});

export default RouteDetailScreen;
