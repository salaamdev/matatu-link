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

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  detailText: {
    fontSize: 14,
    color: "#333333",
    marginVertical: 2,
  },
});


export default MatatuItem;
