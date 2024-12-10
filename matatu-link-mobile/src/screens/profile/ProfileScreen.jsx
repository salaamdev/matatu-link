// src/screens/profile/ProfileScreen.jsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Card, Text, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth(); // Add logout from AuthContext
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled automatically by RootNavigator
              // since the auth state will change
            } catch (error) {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      title: "Edit Profile",
      icon: "manage-accounts",
      onPress: () => navigation.navigate("Settings"),
      color: "#007AFF",
    },
    {
      title: "Payment",
      icon: "payment",
      onPress: () => navigation.navigate("Payment"),
      color: "#34C759",
    },
    {
      title: "Reports",
      icon: "assessment",
      onPress: () => navigation.navigate("Reports"),
      color: "#FF9500",
    },
    {
      title: "Help",
      icon: "help",
      onPress: () => navigation.navigate("Help"),
      color: "#FF9500",
    },
    {
      title: "About",
      icon: "info",
      onPress: () => navigation.navigate("About"),
      color: "#8E8E93",
    },
    {
      title: "Logout",
      icon: "logout",
      onPress: handleLogout,
      color: "#FF3B30",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={user?.username?.substring(0, 2).toUpperCase() || "U"}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      {/* Menu Items List */}
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: item.color }]}
            >
              <MaterialIcons name={item.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  profileCard: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#007AFF",
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666666",
    marginTop: 4,
  },
  menuList: {
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
});

export default ProfileScreen;
