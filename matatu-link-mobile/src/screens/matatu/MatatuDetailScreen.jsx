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
import { Card } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import api from "../../api/config";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://192.168.40.219:5000"; // Replace with your backend Socket.io URL

const MatatuDetailScreen = ({ route, navigation }) => {
  const { matatuId } = route.params;
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !matatu) {
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
            Route: {matatu?.assignedRoute?.route_name || "Not Assigned"}
          </Text>
          <Text style={styles.detailText}>
            Operator: {matatu?.matatu_operator?.name || "Not Assigned"}
          </Text>
          <Text style={styles.detailText}>
            Status: {matatu?.current_status || "Unknown"}
          </Text>
        </Card.Content>
      </Card>

      {matatu?.location && (
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
                matatu?.route?.route_name || "Not Assigned"
              }`}
            />
          </MapView>
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
  mapContainer: {
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MatatuDetailScreen;
