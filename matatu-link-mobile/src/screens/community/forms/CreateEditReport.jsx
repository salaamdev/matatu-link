// src/screens/community/forms/CreateEditReport.jsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text, RadioButton } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createReport,
  updateReport,
  getReportById,
} from "../../../api/reports";

const CreateEditReport = ({ route, navigation }) => {
  const { reportId } = route.params || {};
  const [loading, setLoading] = useState(!!reportId);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Description is required"),
    report_type: Yup.string().required("Report type is required"),
  });

  const formik = useFormik({
    initialValues: {
      description: "",
      report_type: "safety",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (reportId) {
          await updateReport(reportId, values);
          Alert.alert("Success", "Report updated successfully");
        } else {
          await createReport(values);
          Alert.alert("Success", "Report created successfully");
        }
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    },
  });

  useEffect(() => {
    if (reportId) {
      fetchReportDetails();
    }
  }, [reportId]);

  const fetchReportDetails = async () => {
    try {
      const data = await getReportById(reportId);
      formik.setValues({
        description: data.description,
        report_type: data.report_type,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch report details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {reportId ? "Edit Report" : "New Report"}
      </Text>

      <RadioButton.Group
        onValueChange={(value) => formik.setFieldValue("report_type", value)}
        value={formik.values.report_type}
      >
        <View style={styles.radioGroup}>
          <RadioButton.Item label="Safety" value="safety" />
          <RadioButton.Item label="Security" value="security" />
          <RadioButton.Item label="Other" value="other" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Description"
        value={formik.values.description}
        onChangeText={formik.handleChange("description")}
        onBlur={formik.handleBlur("description")}
        error={formik.touched.description && formik.errors.description}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      {formik.touched.description && formik.errors.description && (
        <Text style={styles.errorText}>{formik.errors.description}</Text>
      )}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        style={styles.button}
      >
        {reportId ? "Update" : "Create"}
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

export default CreateEditReport;
