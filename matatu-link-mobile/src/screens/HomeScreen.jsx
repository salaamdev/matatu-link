// src/screens/HomeScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import api from "../api/config";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  //   // Fetch notifications from the backend
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await api.get("/notifications"); // Adjust endpoint as needed
  //       setNotifications(response.data);
  //     } catch (error) {
  //       console.log("Error fetching notifications:", error);
  //       Alert.alert("Error", "Failed to load notifications.");
  //     }
  //   };

  // Replace the fetchNotifications function with mock data
  const fetchNotifications = async () => {
    // Mock notifications
    const mockNotifications = [
      {
        notification_id: 1,
        notification_type: "System Update",
        content: "New routes have been added to the app.",
        date_sent: "2024-04-15T10:30:00Z",
      },
      {
        notification_id: 2,
        notification_type: "Fare Alert",
        content: "Fare prices for Route 5 have increased by 10%.",
        date_sent: "2024-04-14T09:15:00Z",
      },
    ];

    setNotifications(mockNotifications);
  };

  // Render each notification item
  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Ionicons name="notifications-outline" size={24} color="#007AFF" />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.notification_type}</Text>
        <Text style={styles.notificationContent}>{item.content}</Text>
        <Text style={styles.notificationDate}>
          {new Date(item.date_sent).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  // Quick Action Buttons Data
  const quickActions = [
    {
      title: "Track Matatus",
      icon: <Ionicons name="map-outline" size={24} color="#ffffff" />,
      backgroundColor: "#34C759",
      navigateTo: "TrackMatatus", // Ensure this route exists
    },
    {
      title: "Routes",
      icon: <MaterialIcons name="route" size={24} color="#ffffff" />,
      backgroundColor: "#FF9500",
      navigateTo: "Routes",
    },
    {
      title: "Fare Payment",
      icon: <FontAwesome5 name="money-bill-wave" size={24} color="#ffffff" />,
      backgroundColor: "#5856D6",
      navigateTo: "FarePayment",
    },
    {
      title: "Report Issue",
      icon: <Ionicons name="alert-circle-outline" size={24} color="#ffffff" />,
      backgroundColor: "#FF3B30",
      navigateTo: "ReportIssue",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate("Profile")} // Ensure this route exists
        >
          <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.quickActionButton,
              { backgroundColor: action.backgroundColor },
            ]}
            onPress={() => navigation.navigate(action.navigateTo)}
          >
            {action.icon}
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications Section */}
      <View style={styles.notificationsContainer}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notifications.length === 0 ? (
          <Text style={styles.noNotificationsText}>
            No notifications available.
          </Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.notification_id.toString()}
            renderItem={renderNotification}
            scrollEnabled={false} // Disable internal scrolling
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  profileIcon: {
    // Additional styling if needed
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  quickActionButton: {
    width: "48%",
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  quickActionText: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  notificationsContainer: {
    marginTop: 30,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333333",
  },
  noNotificationsText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginTop: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  notificationTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  notificationContent: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  notificationDate: {
    fontSize: 12,
    color: "#999999",
    marginTop: 2,
  },
});
