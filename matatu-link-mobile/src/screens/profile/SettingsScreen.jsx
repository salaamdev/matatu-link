// src/screens/profile/SettingsScreen.jsx

import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Text, Switch } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUserProfile } from "../../api/profile";
import { useAuth } from "../../contexts/AuthContext";

const SettingsScreen = () => {
  const { user, setUser } = useAuth(); // Assuming setUser is available to update user info
  const [loading, setLoading] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(
    user?.notifications || false
  );

  const settingsValidationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    phone_number: Yup.string()
      .matches(
        /^(\+254|0)?7\d{8}$/,
        "Phone number must be a valid Kenyan number"
      )
      .required("Phone Number is required"),
    // Add more fields as necessary
  });

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      // Add more fields as necessary
    },
    validationSchema: settingsValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const updatedUser = await updateUserProfile({
          ...values,
          notifications: notificationsEnabled,
        });
        // Update user context
        setUser(updatedUser);
        Alert.alert("Success", "Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error.message);
        Alert.alert("Error", "Failed to update profile.");
      } finally {
        setLoading(false);
      }
    },
  });

  const toggleNotifications = () => {
    setNotificationsEnabled((previousState) => !previousState);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TextInput
        label="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange("username")}
        onBlur={formik.handleBlur("username")}
        mode="outlined"
        style={styles.input}
        error={formik.touched.username && formik.errors.username}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      <TextInput
        label="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={formik.touched.email && formik.errors.email}
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.errorText}>{formik.errors.email}</Text>
      )}

      <TextInput
        label="Phone Number"
        value={formik.values.phone_number}
        onChangeText={formik.handleChange("phone_number")}
        onBlur={formik.handleBlur("phone_number")}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
        error={formik.touched.phone_number && formik.errors.phone_number}
      />
      {formik.touched.phone_number && formik.errors.phone_number && (
        <Text style={styles.errorText}>{formik.errors.phone_number}</Text>
      )}

      {/* Notifications Toggle */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      {/* Add more settings fields as necessary */}

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        Update Settings
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
    color: "#007AFF",
  },
  input: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
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

export default SettingsScreen;
