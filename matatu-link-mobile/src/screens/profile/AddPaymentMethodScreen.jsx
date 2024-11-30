// src/screens/profile/AddPaymentMethodScreen.jsx

import React from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text, RadioButton } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addPaymentMethod } from "../../api/payment";
import { useAuth } from "../../contexts/AuthContext";

const AddPaymentMethodScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const paymentValidationSchema = Yup.object().shape({
    method_type: Yup.string()
      .oneOf(
        ["Credit Card", "Mobile Money", "Bank Transfer", "Cash"],
        "Invalid payment method"
      )
      .required("Payment method is required"),
    details: Yup.string().required("Payment details are required"),
    // Add more fields as necessary
  });

  const formik = useFormik({
    initialValues: {
      method_type: "Credit Card",
      details: "",
      // Add more fields as necessary
    },
    validationSchema: paymentValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await addPaymentMethod(values);
        Alert.alert("Success", "Payment method added successfully.");
        navigation.goBack();
      } catch (error) {
        console.error("Error adding payment method:", error.message);
        Alert.alert("Error", "Failed to add payment method.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>

      <RadioButton.Group
        onValueChange={(value) => formik.setFieldValue("method_type", value)}
        value={formik.values.method_type}
      >
        <RadioButton.Item label="Credit Card" value="Credit Card" />
        <RadioButton.Item label="Mobile Money" value="Mobile Money" />
        <RadioButton.Item label="Bank Transfer" value="Bank Transfer" />
        <RadioButton.Item label="Cash" value="Cash" />
      </RadioButton.Group>
      {formik.touched.method_type && formik.errors.method_type && (
        <Text style={styles.errorText}>{formik.errors.method_type}</Text>
      )}

      <TextInput
        label="Payment Details"
        value={formik.values.details}
        onChangeText={formik.handleChange("details")}
        onBlur={formik.handleBlur("details")}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={3}
        error={formik.touched.details && formik.errors.details}
      />
      {formik.touched.details && formik.errors.details && (
        <Text style={styles.errorText}>{formik.errors.details}</Text>
      )}

      {/* Add more input fields based on method_type if necessary */}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        Add Payment Method
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#34C759",
  },
  input: {
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    padding: 5,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default AddPaymentMethodScreen;
