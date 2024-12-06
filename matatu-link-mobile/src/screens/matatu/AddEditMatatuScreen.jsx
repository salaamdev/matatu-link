// src/screens/matatu/AddEditMatatuScreen.jsx

import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/config";

const matatuValidationSchema = Yup.object().shape({
  registration_number: Yup.string().required("Registration number is required"),
  capacity: Yup.number()
    .integer("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .required("Capacity is required"),
  model: Yup.string().required("Model is required"),
  make: Yup.string().required("Make is required"),
  year: Yup.number()
    .integer("Year must be a whole number")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Year is required"),
  route_id: Yup.number().nullable(),
});

const AddEditMatatuScreen = ({ route, navigation }) => {
  const { matatu, isEdit } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get("/routes");
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error.message);
      Alert.alert("Error", "Failed to load routes.");
    }
  };

  const formik = useFormik({
    initialValues: {
      registration_number: matatu?.registration_number || "",
      capacity: matatu?.capacity?.toString() || "",
      model: matatu?.model || "",
      make: matatu?.make || "",
      year: matatu?.year?.toString() || "",
      route_id: matatu?.route_id ? matatu.route_id.toString() : "",
    },
    validationSchema: matatuValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          registration_number: values.registration_number,
          capacity: parseInt(values.capacity),
          model: values.model,
          make: values.make,
          year: parseInt(values.year),
          route_id: values.route_id ? parseInt(values.route_id) : null,
        };

        if (isEdit) {
          await api.put(`/matatus/${matatu.matatu_id}`, payload);
          Alert.alert("Success", "Matatu updated successfully");
        } else {
          await api.post("/matatus", payload);
          Alert.alert("Success", "Matatu created successfully");
        }
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", error.response?.data?.error || "Operation failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEdit ? "Edit Matatu" : "Add New Matatu"}
      </Text>

      <TextInput
        label="Registration Number"
        value={formik.values.registration_number}
        onChangeText={formik.handleChange("registration_number")}
        onBlur={formik.handleBlur("registration_number")}
        error={
          formik.touched.registration_number &&
          formik.errors.registration_number
        }
        mode="outlined"
        style={styles.input}
      />
      {formik.touched.registration_number &&
        formik.errors.registration_number && (
          <Text style={styles.errorText}>
            {formik.errors.registration_number}
          </Text>
        )}

      <TextInput
        label="Capacity"
        value={formik.values.capacity}
        onChangeText={formik.handleChange("capacity")}
        onBlur={formik.handleBlur("capacity")}
        error={formik.touched.capacity && formik.errors.capacity}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      {formik.touched.capacity && formik.errors.capacity && (
        <Text style={styles.errorText}>{formik.errors.capacity}</Text>
      )}

      <TextInput
        label="Model"
        value={formik.values.model}
        onChangeText={formik.handleChange("model")}
        onBlur={formik.handleBlur("model")}
        error={formik.touched.model && formik.errors.model}
        mode="outlined"
        style={styles.input}
      />
      {formik.touched.model && formik.errors.model && (
        <Text style={styles.errorText}>{formik.errors.model}</Text>
      )}

      <TextInput
        label="Make"
        value={formik.values.make}
        onChangeText={formik.handleChange("make")}
        onBlur={formik.handleBlur("make")}
        error={formik.touched.make && formik.errors.make}
        mode="outlined"
        style={styles.input}
      />
      {formik.touched.make && formik.errors.make && (
        <Text style={styles.errorText}>{formik.errors.make}</Text>
      )}

      <TextInput
        label="Year"
        value={formik.values.year}
        onChangeText={formik.handleChange("year")}
        onBlur={formik.handleBlur("year")}
        error={formik.touched.year && formik.errors.year}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      {formik.touched.year && formik.errors.year && (
        <Text style={styles.errorText}>{formik.errors.year}</Text>
      )}

      <TextInput
        label="Route ID"
        value={formik.values.route_id}
        onChangeText={formik.handleChange("route_id")}
        onBlur={formik.handleBlur("route_id")}
        error={formik.touched.route_id && formik.errors.route_id}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        placeholder="Optional"
      />
      {formik.touched.route_id && formik.errors.route_id && (
        <Text style={styles.errorText}>{formik.errors.route_id}</Text>
      )}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {isEdit ? "Update Matatu" : "Add Matatu"}
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
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default AddEditMatatuScreen;
