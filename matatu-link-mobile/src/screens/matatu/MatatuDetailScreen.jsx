// src/screens/matatu/MatatuDetailScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../api/config";

export default function MatatuDetailScreen({ route }) {
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);
  const { matatuId } = route.params;

  useEffect(() => {
    const fetchMatatuDetails = async () => {
      try {
        const response = await api.get(`/matatus/${matatuId}`);
        setMatatu(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch matatu details");
        console.error("Fetch Matatu Details Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatatuDetails();
  }, [matatuId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!matatu) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Matatu not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Vehicle Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Registration:</Text>
          <Text style={styles.value}>{matatu.registration_number}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Make:</Text>
          <Text style={styles.value}>{matatu.make || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{matatu.model || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.value}>{matatu.year || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Capacity:</Text>
          <Text style={styles.value}>{matatu.capacity || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles.status[matatu.current_status]]}>
            {matatu.current_status}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 2,
    textAlign: "right",
  },
  status: {
    active: {
      color: "#34C759",
    },
    inactive: {
      color: "#FF3B30",
    },
    maintenance: {
      color: "#FF9500",
    },
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
    fontSize: 16,
    color: "#FF3B30",
  },
});
