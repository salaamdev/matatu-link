// src/screens/routes/components/RouteItem.jsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const RouteItem = ({ route, onPress, selectionMode, selected }) => {
  return (
    <TouchableOpacity onPress={() => onPress(route)}>
      <Card style={[styles.card, selected && styles.selectedCard]}>
        <Card.Title
          title={route.route_name || "Unnamed Route"}
          subtitle={`Fare: KES ${route.fare || "N/A"}`}
          left={(props) => (
            <FontAwesome5
              name="route"
              size={24}
              color={selected ? "#007AFF" : "#666666"}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.detailText}>
            Description: {route.description || "No description provided."}
          </Text>
          <Text style={styles.detailText}>
            Status: {route.is_active ? "Active" : "Inactive"}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8, // Slightly increased margin for better spacing
    marginHorizontal: 16, // Uniform horizontal spacing for alignment consistency
    borderRadius: 12, // More rounded corners for a modern design
    elevation: 4, // Enhanced depth perception
    backgroundColor: "#FFFFFF", // Clean white background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: "#E3F2FD", // Light blue highlight for selected cards
    borderColor: "#007AFF", // Consistent with app’s primary color theme
    borderWidth: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#555555", // Subtle text color for details
    marginTop: 4, // Space between details for readability
    lineHeight: 20, // Improves text legibility
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600", // Emphasized for better visibility
    color: "#333333", // Darker text for strong contrast
  },
  subtitleText: {
    fontSize: 14,
    color: "#777777", // Softer color for subtitles
  },
  iconStyle: {
    fontSize: 24,
    color: "#666666", // Neutral color for inactive state
  },
  selectedIconStyle: {
    color: "#007AFF", // Highlights the icon for selected state
  },
  cardContent: {
    paddingVertical: 8, // Adds vertical padding for content alignment
    paddingHorizontal: 16, // Aligns text uniformly within the card
  },
  touchable: {
    borderRadius: 12, // Matches the card’s border radius
    overflow: "hidden", // Prevents children from spilling outside bounds
  },
});


export default RouteItem;
