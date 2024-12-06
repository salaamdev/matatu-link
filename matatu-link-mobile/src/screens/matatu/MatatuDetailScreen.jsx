// src/screens/matatu/MatatuDetailScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Card, Button } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";
import api from "../../api/config";
import { useAuth } from "../../contexts/AuthContext";

const SOCKET_SERVER_URL = "http://192.168.0.198:5000"; // Replace with your backend Socket.io URL

const MatatuDetailScreen = ({ route, navigation }) => {
  const { matatuId } = route.params;
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Accessing user from AuthContext

  useEffect(() => {
    fetchMatatuDetails();
  }, []);

  useEffect(() => {
    if (!matatu) return;

    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("joinMatatuRoom", matatuId); // Assuming backend handles rooms per Matatu
    });

    socket.on("matatuLocationUpdate", (data) => {
      if (data.matatu_id === matatuId) {
        setMatatu((prev) => ({
          ...prev,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        }));
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    return () => {
      socket.emit("leaveMatatuRoom", matatuId);
      socket.disconnect();
    };
  }, [matatu]);

  const fetchMatatuDetails = async () => {
    try {
      const response = await api.get(`/matatus/${matatuId}`);
      setMatatu(response.data);
    } catch (error) {
      console.error("Error fetching matatu details:", error.message);
      Alert.alert("Error", "Failed to load Matatu details.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Handler function to delete a matatu
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this matatu?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/matatus/${matatuId}`);
              Alert.alert("Success", "Matatu deleted successfully");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting matatu:", error.message);
              Alert.alert("Error", "Failed to delete matatu");
            }
          },
        },
      ]
    );
  };

  // Handler function to edit a matatu
  const handleEdit = () => {
    navigation.navigate("AddEditMatatu", {
      matatu,
      isEdit: true,
    });
  };

  if (loading || !matatu) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Basic Details Card */}
      <Card style={styles.card}>
        <Card.Title
          title={matatu?.registration_number || "Unknown"}
          subtitle={`Model: ${matatu?.model || "N/A"} | Capacity: ${
            matatu?.capacity || "N/A"
          }`}
          left={(props) => <Ionicons name="bus" size={24} color="#007AFF" />}
        />
        <Card.Content>
          <Text style={styles.detailText}>Make: {matatu?.make || "N/A"}</Text>
          <Text style={styles.detailText}>Year: {matatu?.year || "N/A"}</Text>
          <Text style={styles.detailText}>
            Status: {matatu?.current_status || "Unknown"}
          </Text>
        </Card.Content>
      </Card>

      {/* Route Information Card */}
      <Card style={[styles.card, styles.cardSpacing]}>
        <Card.Title
          title="Route Information"
          left={(props) => <Ionicons name="map" size={24} color="#34C759" />}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Route Name: {matatu?.matatuRoute?.route_name || "Not Assigned"}
          </Text>
          <Text style={styles.detailText}>
            Route Description: {matatu?.matatuRoute?.description || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Fare: KES {matatu?.matatuRoute?.fare || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Route Status:{" "}
            {matatu?.matatuRoute?.is_active ? "Active" : "Inactive"}
          </Text>
        </Card.Content>
      </Card>

      {/* Operator Information Card */}
      <Card style={[styles.card, styles.cardSpacing]}>
        <Card.Title
          title="Operator Information"
          left={(props) => <Ionicons name="person" size={24} color="#FF9500" />}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Operator Name: {matatu?.matatu_operator?.name || "Not Assigned"}
          </Text>
          <Text style={styles.detailText}>
            Contact Info: {matatu?.matatu_operator?.contact_info || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Address: {matatu?.matatu_operator?.address || "N/A"}
          </Text>
        </Card.Content>
      </Card>

      {/* Location Information Card */}
      {matatu?.location && (
        <Card style={[styles.card, styles.cardSpacing]}>
          <Card.Title
            title="Current Location"
            left={(props) => (
              <Ionicons name="location" size={24} color="#FF3B30" />
            )}
          />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: matatu.location.latitude,
                longitude: matatu.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
            >
              <Marker
                coordinate={{
                  latitude: matatu.location.latitude,
                  longitude: matatu.location.longitude,
                }}
                title={matatu.registration_number}
                description={`Route: ${
                  matatu?.matatuRoute?.route_name || "Not Assigned"
                }`}
              />
            </MapView>
          </View>
        </Card>
      )}

      {/* Admin Actions: Edit and Delete Buttons */}
      {user?.userRole?.role_name === "admin" && (
        <View style={styles.adminActions}>
          <Button
            mode="contained"
            icon="pencil"
            onPress={handleEdit}
            style={styles.button}
          >
            Edit Matatu
          </Button>
          <Button
            mode="contained"
            icon="delete"
            onPress={handleDelete}
            style={[styles.button, styles.deleteButton]}
            color="#FF3B30"
          >
            Delete Matatu
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
    paddingBottom: 20,
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
  cardSpacing: {
    marginTop: 15,
  },
  detailText: {
    fontSize: 14,
    marginVertical: 4,
    color: "#333333",
  },
  mapContainer: {
    height: 300,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // Styles for Admin Actions
  adminActions: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});

export default MatatuDetailScreen;
