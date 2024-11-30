// src/screens/community/ContributionDetailScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, Switch } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getContributionById,
  createContribution,
  updateContribution,
} from "../../api/contributions";
import { useAuth } from "../../contexts/AuthContext";

const ContributionDetailScreen = ({ route, navigation }) => {
  const { contributionId, isEdit } = route.params || {};
  const [loading, setLoading] = useState(isEdit);
  const [initialValues, setInitialValues] = useState({
    contribution_type: "other",
    content: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (isEdit && contributionId) {
      fetchContributionDetails();
    }
  }, [isEdit, contributionId]);

  const fetchContributionDetails = async () => {
    try {
      const data = await getContributionById(contributionId);
      setInitialValues({
        contribution_type: data.contribution_type || "other",
        content: data.content || "",
      });
    } catch (error) {
      console.error("Error fetching contribution details:", error.message);
      Alert.alert("Error", "Failed to load contribution details.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const contributionValidationSchema = Yup.object().shape({
    contribution_type: Yup.string()
      .oneOf(["route", "stop", "matatu"])
      .required("Contribution type is required"),
    content: Yup.string()
      .min(10, "Content must be at least 10 characters")
      .required("Content is required"),
  });

  const formik = useFormik({
    initialValues: {
      contribution_type: "route", // Set a default value
      content: "",
    },
    validationSchema: contributionValidationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateContribution(contributionId, values);
          Alert.alert("Success", "Contribution updated successfully");
        } else {
          await createContribution(values);
          Alert.alert("Success", "Contribution created successfully");
        }
        navigation.goBack();
      } catch (error) {
        console.error("Error submitting contribution:", error);
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to submit contribution"
        );
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
      <Text style={styles.title}>
        {isEdit ? "Edit Contribution" : "New Contribution"}
      </Text>

      <TextInput
        label="Contribution Type"
        value={formik.values.contribution_type}
        onChangeText={formik.handleChange("contribution_type")}
        onBlur={formik.handleBlur("contribution_type")}
        mode="outlined"
        style={styles.input}
        selectTextOnFocus={false}
        editable={false} // For simplicity, fixed types. Can implement a dropdown if needed.
      />
      <Text style={styles.noteText}>
        Contribution Type: {formik.values.contribution_type}
      </Text>

      <TextInput
        label="Content"
        value={formik.values.content}
        onChangeText={formik.handleChange("content")}
        onBlur={formik.handleBlur("content")}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={4}
        error={formik.touched.content && formik.errors.content}
      />
      {formik.touched.content && formik.errors.content && (
        <Text style={styles.errorText}>{formik.errors.content}</Text>
      )}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        style={styles.submitButton}
      >
        {isEdit ? "Update Contribution" : "Submit Contribution"}
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
  noteText: {
    fontSize: 14,
    color: "#666666",
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

export default ContributionDetailScreen;
