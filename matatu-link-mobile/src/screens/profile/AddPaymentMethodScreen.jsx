// src/screens/profile/AddPaymentMethodScreen.jsx
import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  List,
  Surface,
  Portal,
  Modal,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addPaymentMethod } from "../../api/payment";

const PAYMENT_METHODS = [
  {
    id: "mpesa",
    title: "M-Pesa",
    icon: "phone-android",
    color: "#4CD964",
    description: "Pay directly with M-Pesa mobile money",
    fields: ["phone_number"],
  },
  {
    id: "card",
    title: "Credit/Debit Card",
    icon: "credit-card",
    color: "#007AFF",
    description: "Add a credit or debit card",
    fields: ["card_number", "expiry_date", "cvv", "card_name"],
  },
  {
    id: "bank",
    title: "Bank Transfer",
    icon: "account-balance",
    color: "#5856D6",
    description: "Link your bank account",
    fields: ["account_number", "bank_name", "branch_code"],
  },
];

const AddPaymentMethodScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    method_type: Yup.string().required("Payment method is required"),
    phone_number: Yup.string().when("method_type", {
      is: "mpesa",
      then: Yup.string()
        .matches(/^(?:\+254|0)?[71]\d{8}$/, "Enter a valid M-Pesa number")
        .required("M-Pesa number is required"),
    }),
    card_number: Yup.string().when("method_type", {
      is: "card",
      then: Yup.string()
        .matches(/^\d{16}$/, "Enter a valid card number")
        .required("Card number is required"),
    }),
    expiry_date: Yup.string().when("method_type", {
      is: "card",
      then: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Use MM/YY format")
        .required("Expiry date is required"),
    }),
    cvv: Yup.string().when("method_type", {
      is: "card",
      then: Yup.string()
        .matches(/^\d{3,4}$/, "Enter a valid CVV")
        .required("CVV is required"),
    }),
    card_name: Yup.string().when("method_type", {
      is: "card",
      then: Yup.string().required("Cardholder name is required"),
    }),
    account_number: Yup.string().when("method_type", {
      is: "bank",
      then: Yup.string().required("Account number is required"),
    }),
    bank_name: Yup.string().when("method_type", {
      is: "bank",
      then: Yup.string().required("Bank name is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      method_type: "",
      phone_number: "",
      card_number: "",
      expiry_date: "",
      cvv: "",
      card_name: "",
      account_number: "",
      bank_name: "",
      branch_code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await addPaymentMethod(values);
        Alert.alert("Success", "Payment method added successfully");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "Failed to add payment method");
      } finally {
        setLoading(false);
      }
    },
  });

  const renderPaymentMethodFields = () => {
    switch (selectedMethod?.id) {
      case "mpesa":
        return (
          <TextInput
            label="M-Pesa Number"
            value={formik.values.phone_number}
            onChangeText={formik.handleChange("phone_number")}
            onBlur={formik.handleBlur("phone_number")}
            error={formik.touched.phone_number && formik.errors.phone_number}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="07XXXXXXXX"
          />
        );
      case "card":
        return (
          <>
            <TextInput
              label="Card Number"
              value={formik.values.card_number}
              onChangeText={formik.handleChange("card_number")}
              onBlur={formik.handleBlur("card_number")}
              error={formik.touched.card_number && formik.errors.card_number}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              maxLength={16}
            />
            <View style={styles.row}>
              <TextInput
                label="Expiry Date"
                value={formik.values.expiry_date}
                onChangeText={formik.handleChange("expiry_date")}
                onBlur={formik.handleBlur("expiry_date")}
                error={formik.touched.expiry_date && formik.errors.expiry_date}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
              />
              <TextInput
                label="CVV"
                value={formik.values.cvv}
                onChangeText={formik.handleChange("cvv")}
                onBlur={formik.handleBlur("cvv")}
                error={formik.touched.cvv && formik.errors.cvv}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
            <TextInput
              label="Cardholder Name"
              value={formik.values.card_name}
              onChangeText={formik.handleChange("card_name")}
              onBlur={formik.handleBlur("card_name")}
              error={formik.touched.card_name && formik.errors.card_name}
              mode="outlined"
              style={styles.input}
            />
          </>
        );
      case "bank":
        return (
          <>
            <TextInput
              label="Account Number"
              value={formik.values.account_number}
              onChangeText={formik.handleChange("account_number")}
              onBlur={formik.handleBlur("account_number")}
              error={
                formik.touched.account_number && formik.errors.account_number
              }
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Bank Name"
              value={formik.values.bank_name}
              onChangeText={formik.handleChange("bank_name")}
              onBlur={formik.handleBlur("bank_name")}
              error={formik.touched.bank_name && formik.errors.bank_name}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Branch Code (Optional)"
              value={formik.values.branch_code}
              onChangeText={formik.handleChange("branch_code")}
              mode="outlined"
              style={styles.input}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      <Text style={styles.subtitle}>Choose your preferred payment method</Text>

      {PAYMENT_METHODS.map((method) => (
        <Surface key={method.id} style={styles.methodCard}>
          <List.Item
            title={method.title}
            description={method.description}
            left={() => (
              <MaterialIcons
                name={method.icon}
                size={24}
                color={method.color}
                style={styles.icon}
              />
            )}
            onPress={() => {
              setSelectedMethod(method);
              formik.setFieldValue("method_type", method.id);
            }}
            style={[
              styles.methodItem,
              selectedMethod?.id === method.id && styles.selectedMethod,
            ]}
          />
        </Surface>
      ))}

      {selectedMethod && (
        <View style={styles.formContainer}>
          {renderPaymentMethodFields()}
          {formik.errors[selectedMethod.id] && (
            <Text style={styles.errorText}>
              {formik.errors[selectedMethod.id]}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            loading={loading}
            style={styles.submitButton}
          >
            Add Payment Method
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  methodCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  methodItem: {
    borderRadius: 8,
  },
  selectedMethod: {
    backgroundColor: "#f0f0f0",
  },
  icon: {
    marginRight: 8,
    alignSelf: "center",
  },
  formContainer: {
    marginTop: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
    padding: 8,
  },
});

export default AddPaymentMethodScreen;
