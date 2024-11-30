// src/screens/profile/tabs/components/PaymentMethodItem.jsx

import React from "react";
import { StyleSheet, Alert } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { deletePaymentMethod } from "../../../../api/payment";
import { useAuth } from "../../../../contexts/AuthContext";

const PaymentMethodItem = ({ method }) => {
  const { user } = useAuth();

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePaymentMethod(method.method_id);
              Alert.alert("Success", "Payment method deleted successfully.");
              // Optionally, trigger a refresh in the parent component
            } catch (error) {
              console.error("Error deleting payment method:", error.message);
              Alert.alert("Error", "Failed to delete payment method.");
            }
          },
        },
      ]
    );
  };

  // Determine the icon based on the payment method type
  const getIconName = (type) => {
    switch (type.toLowerCase()) {
      case "credit card":
        return "card";
      case "mobile money":
        return "phone-portrait-outline";
      case "bank transfer":
        return "wallet-outline";
      default:
        return "cash-outline";
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={method.method_type || "Unknown Method"}
        subtitle={`Last used: ${new Date(
          method.last_used
        ).toLocaleDateString()}`}
        left={(props) => (
          <Ionicons
            name={getIconName(method.method_type)}
            size={24}
            color="#007AFF"
          />
        )}
        right={() =>
          user?.userRole?.role_name === "admin" ? (
            <IconButton
              icon="delete"
              color="#FF3B30"
              size={24}
              onPress={handleDelete}
            />
          ) : null
        }
      />
      <Card.Content>
        <Text style={styles.detailText}>
          {method.details || "No details provided."}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 10,
    borderRadius: 10,
    elevation: 3,
  },
  detailText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default PaymentMethodItem;
