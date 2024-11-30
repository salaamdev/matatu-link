// src/screens/profile/tabs/components/PaymentHistoryItem.jsx

import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const PaymentHistoryItem = ({ payment }) => {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Transaction ID: ${payment.transaction_id}`}
        subtitle={`Amount: KES ${payment.amount}`}
        left={(props) => (
          <MaterialIcons name="payment" size={24} color="#34C759" />
        )}
      />
      <Card.Content>
        <Text style={styles.detailText}>
          Date: {new Date(payment.date).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>
          Method: {payment.method_type || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          Status: {payment.status || "Pending"}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  detailText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default PaymentHistoryItem;
