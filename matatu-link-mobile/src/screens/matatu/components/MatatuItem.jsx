// src/screens/matatu/components/MatatuItem.jsx

import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper"; // Import Text from react-native-paper
import { Ionicons } from "@expo/vector-icons";

const MatatuItem = ({ matatu, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(matatu)}>
      <Card style={styles.card}>
        <Card.Title
          title={matatu.registration_number || "Unknown"}
          subtitle={`Model: ${matatu.model || 'N/A'} | Capacity: ${matatu.capacity || 'N/A'}`}
          left={(props) => <Ionicons name="bus" size={24} color="#007AFF" />}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Route: {matatu.route?.route_name || 'Not Assigned'}
          </Text>
          <Text style={styles.detailText}>
            Operator: {matatu.operator?.name || 'Not Assigned'}
          </Text>
          <Text style={styles.detailText}>
            Status: {matatu.current_status || 'Unknown'}
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
  detailText: {
    fontSize: 14,
    marginTop: 2,
  },
});
export default MatatuItem;
