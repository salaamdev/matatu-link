// src/screens/profile/PaymentScreen.jsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  FAB,
  List,
  IconButton,
  Portal,
  Modal,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { getPaymentMethods, deletePaymentMethod } from "../../api/payment";

const PaymentMethodIcons = {
  "Credit Card": "credit-card",
  "Mobile Money": "phone-android",
  "Bank Transfer": "account-balance",
  Cash: "payments",
};

const PaymentScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchPaymentMethods();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      Alert.alert("Error", "Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMethod = async () => {
    try {
      await deletePaymentMethod(selectedMethod.id);
      setPaymentMethods((methods) =>
        methods.filter((m) => m.id !== selectedMethod.id)
      );
      Alert.alert("Success", "Payment method deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete payment method");
    } finally {
      setDeleteModalVisible(false);
      setSelectedMethod(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment Methods</Title>
            <Text style={styles.cardDescription}>
              Manage your payment methods for seamless transactions
            </Text>
          </Card.Content>
        </Card>

        {paymentMethods.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No payment methods added yet</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("AddPaymentMethod")}
                style={styles.addButton}
              >
                Add Payment Method
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.methodsCard}>
            <Card.Content>
              {paymentMethods.map((method) => (
                <List.Item
                  key={method.id}
                  title={method.method_type}
                  description={method.details}
                  left={() => (
                    <MaterialIcons
                      name={PaymentMethodIcons[method.method_type] || "payment"}
                      size={24}
                      color="#007AFF"
                      style={styles.methodIcon}
                    />
                  )}
                  right={() => (
                    <IconButton
                      icon="delete"
                      color="#FF3B30"
                      onPress={() => {
                        setSelectedMethod(method);
                        setDeleteModalVisible(true);
                      }}
                    />
                  )}
                  style={styles.methodItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Delete Payment Method</Title>
          <Text style={styles.modalText}>
            Are you sure you want to delete this payment method?
          </Text>
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setDeleteModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleDeleteMethod}
              style={[styles.modalButton, styles.deleteButton]}
            >
              Delete
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Payment Method"
        onPress={() => navigation.navigate("AddPaymentMethod")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  addButton: {
    marginTop: 8,
  },
  methodsCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  methodItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  methodIcon: {
    marginRight: 8,
    alignSelf: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  modalText: {
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    minWidth: 120,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});

export default PaymentScreen;
