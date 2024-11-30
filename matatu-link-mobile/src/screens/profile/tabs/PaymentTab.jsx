// src/screens/profile/tabs/PaymentTab.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Card, ActivityIndicator } from "react-native-paper";
import {
  getPaymentMethods,
  addPaymentMethod,
  getPaymentHistory,
} from "../../../api/payment";
import { useAuth } from "../../../contexts/AuthContext";
import PaymentMethodItem from "./components/PaymentMethodItem";
import PaymentHistoryItem from "./components/PaymentHistoryItem";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const PaymentTab = ({ navigation }) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingMethod, setAddingMethod] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
      const history = await getPaymentHistory();
      setPaymentHistory(history);
    } catch (error) {
      console.error("Error fetching payment data:", error.message);
      Alert.alert("Error", "Failed to load payment data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentData();
  };

  const handleAddPaymentMethod = () => {
    // Navigate to Add Payment Method Screen or open a modal
    navigation.navigate("AddPaymentMethod");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Payment Methods Section */}
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      {paymentMethods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Payment Methods Added.</Text>
        </View>
      ) : (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.method_id.toString()}
          renderItem={({ item }) => <PaymentMethodItem method={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paymentMethodsList}
        />
      )}

      <Button
        mode="contained"
        onPress={handleAddPaymentMethod}
        icon="plus"
        style={styles.addButton}
      >
        Add Payment Method
      </Button>

      {/* Payment History Section */}
      <Text style={styles.sectionTitle}>Payment History</Text>
      {paymentHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Payment History Available.</Text>
        </View>
      ) : (
        <FlatList
          data={paymentHistory}
          keyExtractor={(item) => item.payment_id.toString()}
          renderItem={({ item }) => <PaymentHistoryItem payment={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
            />
          }
          contentContainerStyle={
            paymentHistory.length === 0 && styles.flatListContainer
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#007AFF",
  },
  paymentMethodsList: {
    paddingVertical: 10,
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: "#34C759",
  },
  emptyContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default PaymentTab;
