// src/screens/profile/SettingsScreen.jsx
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Text, Switch, Avatar } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUserProfile } from "../../api/profile";
import { useAuth } from "../../contexts/AuthContext";

const SettingsScreen = () => {
  const { user, setUser } = useAuth();
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
    full_name: Yup.string().required("Full name is required"),
    bio: Yup.string().max(200, "Bio must be less than 200 characters"),
  });

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      full_name: user?.full_name || "",
      bio: user?.bio || "",
    },
    validationSchema: settingsValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const updatedUser = await updateUserProfile({
          ...values,
          notifications: notificationsEnabled,
        });
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Text
          size={100}
          label={user?.username?.substring(0, 2).toUpperCase() || "U"}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        label="Full Name"
        value={formik.values.full_name}
        onChangeText={formik.handleChange("full_name")}
        onBlur={formik.handleBlur("full_name")}
        mode="outlined"
        style={styles.input}
        error={formik.touched.full_name && formik.errors.full_name}
      />
      {formik.touched.full_name && formik.errors.full_name && (
        <Text style={styles.errorText}>{formik.errors.full_name}</Text>
      )}

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
        label="Bio"
        value={formik.values.bio}
        onChangeText={formik.handleChange("bio")}
        onBlur={formik.handleBlur("bio")}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={4}
        error={formik.touched.bio && formik.errors.bio}
      />
      {formik.touched.bio && formik.errors.bio && (
        <Text style={styles.errorText}>{formik.errors.bio}</Text>
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

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      </View>

      <Button
        mode="contained"
        onPress={formik.handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          "Update Profile"
        )}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#007AFF",
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
    marginVertical: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  switchLabel: {
    fontSize: 16,
    color: "#333333",
  },
  submitButton: {
    marginTop: 20,
    padding: 5,
    backgroundColor: "#007AFF",
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default SettingsScreen;
