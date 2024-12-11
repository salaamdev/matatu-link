import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
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
      {/* Basic Route Information Card */}
      <Card style={styles.card}>
        <Card.Title
          title={routeData.route_name || "Unnamed Route"}
          subtitle={`Route ID: ${routeData.route_id}`}
          left={(props) => <Ionicons name="route" size={24} color="#007AFF" />}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Description: {routeData.description || "No description provided."}
          </Text>
          <Text style={styles.detailText}>
            Status: {routeData.is_active ? "Active" : "Inactive"}
          </Text>
        </Card.Content>
      </Card>

      {/* Fare Information Card */}
      <Card style={[styles.card, styles.cardSpacing]}>
        <Card.Title
          title="Fare Information"
          left={(props) => (
            <MaterialIcons name="payments" size={24} color="#34C759" />
          )}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Base Fare: KES {routeData.fare || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Peak Hour Fare: KES {(routeData.fare * 1.2).toFixed(2) || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Off-Peak Fare: KES {(routeData.fare * 0.9).toFixed(2) || "N/A"}
          </Text>
        </Card.Content>
      </Card>

      {/* Connected Stops Card */}
      <Card style={[styles.card, styles.cardSpacing]}>
        <Card.Title
          title="Connected Stops"
          left={(props) => (
            <MaterialIcons name="route" size={24} color="#FF9500" />
          )}
        />
        <Card.Content>
          {routeData.connectedStops && routeData.connectedStops.length > 0 ? (
            routeData.connectedStops.map((stop) => (
              <List.Item
                key={stop.stop_id}
                title={stop.stop_name}
                description={stop.description || "No description"}
                left={(props) => (
                  <MaterialIcons name="location-on" size={24} color="#007AFF" />
                )}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No stops assigned to this route
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Assigned Matatus Card */}
      <Card style={[styles.card, styles.cardSpacing]}>
        <Card.Title
          title="Operating Matatus"
          left={(props) => <Ionicons name="bus" size={24} color="#5856D6" />}
        />
        <Card.Content>
          {routeData.routeMatatus && routeData.routeMatatus.length > 0 ? (
            routeData.routeMatatus.map((matatu) => (
              <List.Item
                key={matatu.matatu_id}
                title={matatu.registration_number}
                description={`Model: ${matatu.model || "N/A"} | Capacity: ${
                  matatu.capacity || "N/A"
                }`}
                left={(props) => (
                  <Ionicons name="bus-outline" size={24} color="#007AFF" />
                )}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No matatus assigned to this route
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Statistics Card */}
      <Card style={[styles.card, styles.cardSpacing]}>
        <Card.Title
          title="Route Statistics"
          left={(props) => (
            <MaterialIcons name="analytics" size={24} color="#FF3B30" />
          )}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Total Distance: {routeData.distance || "N/A"} km
          </Text>
          <Text style={styles.detailText}>
            Average Travel Time: {routeData.avg_travel_time || "N/A"} minutes
          </Text>
          <Text style={styles.detailText}>
            Daily Passengers: {routeData.daily_passengers || "N/A"}
          </Text>
        </Card.Content>
      </Card>

      {/* Admin Actions */}
      {user?.roleName === "admin" && (
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
    padding: 15,
    backgroundColor: "#F9F9F9",
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  cardSpacing: {
    marginTop: 16,
  },
  detailText: {
    fontSize: 15,
    marginVertical: 4,
    color: "#333333",
  },
  emptyText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 12,
  },
  adminActions: {
    marginTop: 25,
    alignItems: "center",
  },
  button: {
    width: "80%",
    marginVertical: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RouteDetailScreen;
