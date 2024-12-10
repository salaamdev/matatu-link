// src/screens/community/forms/CreateEditContribution.jsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text, RadioButton } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createContribution,
  updateContribution,
  getContributionById,
} from "../../../api/contributions";

const CreateEditContribution = ({ route, navigation }) => {
  const { contributionId } = route.params || {};
  const [loading, setLoading] = useState(!!contributionId);

  const validationSchema = Yup.object().shape({
    content: Yup.string()
      .required("Content is required")
      .min(10, "Content must be at least 10 characters"),
    contribution_type: Yup.string()
      .oneOf(["route", "stop", "matatu"], "Invalid contribution type")
      .required("Type is required"),
    route_id: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    stop_id: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    matatu_id: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
  });

  const formik = useFormik({
    initialValues: {
      content: "",
      contribution_type: "route",
      route_id: "",
      stop_id: "",
      matatu_id: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          content: values.content,
          contribution_type: values.contribution_type,
          route_id: values.route_id ? parseInt(values.route_id) : null,
          stop_id: values.stop_id ? parseInt(values.stop_id) : null,
          matatu_id: values.matatu_id ? parseInt(values.matatu_id) : null,
        };

        if (contributionId) {
          await updateContribution(contributionId, payload);
          Alert.alert("Success", "Contribution updated successfully");
        } else {
          await createContribution(payload);
          Alert.alert("Success", "Contribution created successfully");
        }
        navigation.goBack();
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (contributionId) {
      fetchContributionDetails();
    }
  }, [contributionId]);

  const fetchContributionDetails = async () => {
    try {
      const data = await getContributionById(contributionId);
      formik.setValues({
        content: data.content,
        contribution_type: data.contribution_type,
        route_id: data.route_id?.toString() || "",
        stop_id: data.stop_id?.toString() || "",
        matatu_id: data.matatu_id?.toString() || "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch contribution details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {contributionId ? "Edit Contribution" : "New Contribution"}
      </Text>

      <Text style={styles.label}>Contribution Type</Text>
      <RadioButton.Group
        onValueChange={(value) =>
          formik.setFieldValue("contribution_type", value)
        }
        value={formik.values.contribution_type}
      >
        <View style={styles.radioGroup}>
          <RadioButton.Item label="Route" value="route" />
          <RadioButton.Item label="Stop" value="stop" />
          <RadioButton.Item label="Matatu" value="matatu" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Content"
        value={formik.values.content}
        onChangeText={formik.handleChange("content")}
        onBlur={formik.handleBlur("content")}
        error={formik.touched.content && formik.errors.content}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      {formik.touched.content && formik.errors.content && (
        <Text style={styles.errorText}>{formik.errors.content}</Text>
      )}

      {formik.values.contribution_type === "route" && (
        <TextInput
          label="Route ID (Optional)"
          value={formik.values.route_id}
          onChangeText={formik.handleChange("route_id")}
          onBlur={formik.handleBlur("route_id")}
          error={formik.touched.route_id && formik.errors.route_id}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
      )}

      {formik.values.contribution_type === "stop" && (
        <TextInput
          label="Stop ID (Optional)"
          value={formik.values.stop_id}
          onChangeText={formik.handleChange("stop_id")}
          onBlur={formik.handleBlur("stop_id")}
          error={formik.touched.stop_id && formik.errors.stop_id}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
      )}

      {formik.values.contribution_type === "matatu" && (
        <TextInput
          label="Matatu ID (Optional)"
          value={formik.values.matatu_id}
          onChangeText={formik.handleChange("matatu_id")}
          onBlur={formik.handleBlur("matatu_id")}
          error={formik.touched.matatu_id && formik.errors.matatu_id}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
      )}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        style={styles.button}
      >
        {contributionId ? "Update" : "Create"}
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666666",
  },
  radioGroup: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default CreateEditContribution;
