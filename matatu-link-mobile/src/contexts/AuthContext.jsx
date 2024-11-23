// matatu-link-mobile/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken } from "../api/config";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setAuthToken(token);
          // Attempt to fetch user profile
          const response = await api.get("/auth/profile");
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Optionally, remove invalid token
        await setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;
      await setAuthToken(token);
      setUser(user);
      return response.data;
    } catch (error) {
      // Extract meaningful error messages
      const message = error.errors
        ? error.errors.map((err) => err.msg).join("\n")
        : error.message || "An error occurred during login.";
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      // Extract meaningful error messages
      const message = error.errors
        ? error.errors.map((err) => err.msg).join("\n")
        : error.message || "An error occurred during registration.";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
