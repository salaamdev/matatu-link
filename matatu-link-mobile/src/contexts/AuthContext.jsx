// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import api, { setAuthToken, initializeAxios } from "../api/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data
  const [loading, setLoading] = useState(true); // Loading state during initialization

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await initializeAxios();
        const response = await api.get("/auth/profile");
        setUser(response.data); // Assuming the profile endpoint returns user data
      } catch (error) {
        console.log("Auth initialization error:", error.message);
        // Token might be invalid or expired; ensure it's removed
        await setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      await setAuthToken(token);
      setUser(user);
    } catch (error) {
      console.log(
        "Login error:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Register function
  const register = async ({ username, email, password, phone_number }) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
        phone_number,
      });
      Alert.alert(
        "Success",
        response.data.message || "Registration successful"
      );
    } catch (error) {
      console.log(
        "Registration error:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.log("Logout error:", error.message);
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
