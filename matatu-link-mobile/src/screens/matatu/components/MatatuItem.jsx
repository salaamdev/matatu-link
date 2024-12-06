// src/screens/matatu/components/MatatuItem.jsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text, Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const MatatuItem = ({ matatu, onPress, selectionMode, selected }) => {
  return (
    <TouchableOpacity onPress={() => onPress(matatu)}>
      <Card style={styles.card}>
        <Card.Title
          title={matatu.registration_number || "Unknown"}
          subtitle={`Model: ${matatu.model || "N/A"} | Capacity: ${
            matatu.capacity || "N/A"
          }`}
          left={(props) => <Ionicons name="bus" size={24} color="#007AFF" />}
          right={(props) =>
            selectionMode ? (
              <Checkbox.Android
                status={selected ? "checked" : "unchecked"}
                onPress={() => onPress(matatu)}
              />
            ) : null
          }
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Route: {matatu.matatuRoute?.route_name || "Not Assigned"}
          </Text>
          <Text style={styles.detailText}>
            Operator: {matatu.matatu_operator?.name || "Not Assigned"}
          </Text>
          <Text style={styles.detailText}>
            Status: {matatu.current_status || "Unknown"}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// src/screens/matatu/components/MatatuItem.jsx
const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#555555",
    marginTop: 4,
  },
});

export default MatatuItem;
