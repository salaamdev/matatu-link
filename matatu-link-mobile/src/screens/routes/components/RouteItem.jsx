// src/screens/routes/components/RouteItem.jsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const RouteItem = ({ route, onPress, selectionMode, selected }) => {
  return (
    <TouchableOpacity onPress={() => onPress(route)}>
      <Card style={[styles.card, selected && styles.selectedCard]}>
        <Card.Title
          title={route.route_name || "Unnamed Route"}
          subtitle={`Fare: KES ${route.fare || "N/A"}`}
          left={(props) => (
            <Ionicons
              name="route"
              size={24}
              color={selected ? "#007AFF" : "#666666"}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Description: {route.description || "No description provided."}
          </Text>
          <Text style={styles.detailText}>
            Status: {route.is_active ? "Active" : "Inactive"}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  detailText: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default RouteItem;
