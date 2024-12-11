import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import * as Yup from "yup";
import { useFormik } from "formik";
import { initiatePayment } from "../api/payment";

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^(?:\+254|0)?[71]\d{8}$/, "Enter a valid M-Pesa number")
    .required("Phone number is required"),
  amount: Yup.number()
    .min(1, "Amount must be at least 1")
    .required("Amount is required"),
});

const MpesaPayment = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      amount: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formattedPhone = values.phoneNumber.startsWith("0")
          ? `254${values.phoneNumber.slice(1)}`
          : values.phoneNumber;

        await initiatePayment({
          phone_number: formattedPhone,
          amount: parseFloat(values.amount),
        });

        Alert.alert(
          "Success",
          "Please check your phone for the M-Pesa prompt",
          [{ text: "OK" }]
        );
      } catch (error) {
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to initiate payment"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>M-Pesa Payment</Text>

      <TextInput
        label="Phone Number"
        value={formik.values.phoneNumber}
        onChangeText={formik.handleChange("phoneNumber")}
        onBlur={formik.handleBlur("phoneNumber")}
        error={formik.touched.phoneNumber && formik.errors.phoneNumber}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="07XXXXXXXX"
      />
      {formik.touched.phoneNumber && formik.errors.phoneNumber && (
        <Text style={styles.errorText}>{formik.errors.phoneNumber}</Text>
      )}

      <TextInput
        label="Amount (KES)"
        value={formik.values.amount}
        onChangeText={formik.handleChange("amount")}
        onBlur={formik.handleBlur("amount")}
        error={formik.touched.amount && formik.errors.amount}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />
      {formik.touched.amount && formik.errors.amount && (
        <Text style={styles.errorText}>{formik.errors.amount}</Text>
      )}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Pay with M-Pesa
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default MpesaPayment;
