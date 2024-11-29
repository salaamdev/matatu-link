// src/screens/auth/RegisterScreen.jsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const registerValidationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email Address is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone_number: Yup.string()
      .matches(
        /^(\+254|0)?7\d{8}$/,
        "Phone number must be a valid Kenyan number"
      )
      .required("Phone Number is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "", phone_number: "" },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await register(values);
        Alert.alert("Success", "Registration successful! Please log in.");
        navigation.navigate("Login");
      } catch (error) {
        Alert.alert("Registration Failed", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matatu-Link</Text>
      <Text style={styles.subtitle}>Create an Account</Text>

      <TextInput
        name="username"
        placeholder="Username"
        style={styles.input}
        onChangeText={formik.handleChange("username")}
        onBlur={formik.handleBlur("username")}
        value={formik.values.username}
        autoCapitalize="none"
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      <TextInput
        name="email"
        placeholder="Email Address"
        style={styles.input}
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.errorText}>{formik.errors.email}</Text>
      )}

      <TextInput
        name="password"
        placeholder="Password"
        style={styles.input}
        onChangeText={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
        secureTextEntry
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      <TextInput
        name="phone_number"
        placeholder="Phone Number (e.g., 0712345678)"
        style={styles.input}
        onChangeText={formik.handleChange("phone_number")}
        onBlur={formik.handleBlur("phone_number")}
        value={formik.values.phone_number}
        keyboardType="phone-pad"
      />
      {formik.touched.phone_number && formik.errors.phone_number && (
        <Text style={styles.errorText}>{formik.errors.phone_number}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#333333",
  },
  input: {
    height: 50,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    borderColor: "#DDD",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#34C759",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#666666",
    fontSize: 16,
  },
  link: {
    color: "#34C759",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginBottom: 5,
    marginLeft: 5,
  },
});
