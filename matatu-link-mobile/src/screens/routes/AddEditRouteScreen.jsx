// src/screens/routes/AddEditRouteScreen.jsx

import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createRoute, updateRoute, getRouteById } from "../../api/routes";

const AddEditRouteScreen = ({ route, navigation }) => {
  const { isEdit, routeData } = route.params || {};
  const [loading, setLoading] = React.useState(isEdit);
  const [initialValues, setInitialValues] = React.useState({
    route_name: "",
    description: "",
    fare: "",
    is_active: true,
  });

  useEffect(() => {
    if (isEdit && routeData) {
      setInitialValues({
        route_name: routeData.route_name || "",
        description: routeData.description || "",
        fare: routeData.fare ? routeData.fare.toString() : "",
        is_active: routeData.is_active,
      });
      setLoading(false);
    }
  }, [isEdit, routeData]);

  const routeValidationSchema = Yup.object().shape({
    route_name: Yup.string()
      .min(3, "Route name must be at least 3 characters")
      .required("Route name is required"),
    description: Yup.string().optional(),
    fare: Yup.number()
      .typeError("Fare must be a number")
      .positive("Fare must be a positive number")
      .required("Fare is required"),
    is_active: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: routeValidationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateRoute(routeData.route_id, {
            route_name: values.route_name,
            description: values.description,
            fare: parseFloat(values.fare),
            is_active: values.is_active,
          });
          Alert.alert("Success", "Route updated successfully.");
        } else {
          await createRoute({
            route_name: values.route_name,
            description: values.description,
            fare: parseFloat(values.fare),
            is_active: values.is_active,
          });
          Alert.alert("Success", "Route created successfully.");
        }
        navigation.goBack();
      } catch (error) {
        console.error("Error submitting route:", error.message);
        Alert.alert("Error", "Failed to submit route.");
      }
    },
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? "Edit Route" : "Add Route"}</Text>

      <TextInput
        label="Route Name"
        value={formik.values.route_name}
        onChangeText={formik.handleChange("route_name")}
        onBlur={formik.handleBlur("route_name")}
        mode="outlined"
        style={styles.input}
        error={formik.touched.route_name && formik.errors.route_name}
      />
      {formik.touched.route_name && formik.errors.route_name && (
        <Text style={styles.errorText}>{formik.errors.route_name}</Text>
      )}

      <TextInput
        label="Description"
        value={formik.values.description}
        onChangeText={formik.handleChange("description")}
        onBlur={formik.handleBlur("description")}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={3}
      />
      {formik.touched.description && formik.errors.description && (
        <Text style={styles.errorText}>{formik.errors.description}</Text>
      )}

      <TextInput
        label="Fare (KES)"
        value={formik.values.fare}
        onChangeText={formik.handleChange("fare")}
        onBlur={formik.handleBlur("fare")}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        error={formik.touched.fare && formik.errors.fare}
      />
      {formik.touched.fare && formik.errors.fare && (
        <Text style={styles.errorText}>{formik.errors.fare}</Text>
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Active Status</Text>
        <Button
          mode={formik.values.is_active ? "contained" : "outlined"}
          onPress={() =>
            formik.setFieldValue("is_active", !formik.values.is_active)
          }
          icon={formik.values.is_active ? "check" : "close"}
          style={styles.switchButton}
        >
          {formik.values.is_active ? "Active" : "Inactive"}
        </Button>
      </View>

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        style={styles.submitButton}
      >
        {isEdit ? "Update Route" : "Create Route"}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007AFF",
  },
  input: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
  },
  switchButton: {
    flex: 1,
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

export default AddEditRouteScreen;
