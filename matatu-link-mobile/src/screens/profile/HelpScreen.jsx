import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card, List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const HelpScreen = () => {
  const helpSections = [
    {
      title: "Getting Started",
      icon: "launch",
      items: [
        "Create an account or login to access all features",
        "Enable location services for real-time tracking",
        "Set up notifications to stay updated",
      ],
    },
    {
      title: "Using the App",
      icon: "touch-app",
      items: [
        "View available matatus and their routes",
        "Track matatu locations in real-time",
        "Check fare prices and schedules",
        "Save favorite routes for quick access",
      ],
    },
    {
      title: "Community Features",
      icon: "people",
      items: [
        "Submit contributions to improve the service",
        "Report safety or service issues",
        "Vote on community contributions",
        "Engage with other users through comments",
      ],
    },
    {
      title: "Payments",
      icon: "payment",
      items: [
        "Add multiple payment methods",
        "View transaction history",
        "Request refunds if needed",
        "Set up automatic payments",
      ],
    },
    {
      title: "Account Management",
      icon: "manage-accounts",
      items: [
        "Update profile information",
        "Change notification preferences",
        "Manage privacy settings",
        "Link social media accounts",
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.headerTitle}>Help Center</Text>
          <Text style={styles.headerSubtitle}>
            Find answers to common questions and learn how to use Matatu-Link
          </Text>
        </Card.Content>
      </Card>

      {helpSections.map((section, index) => (
        <Card key={index} style={styles.sectionCard}>
          <Card.Title
            title={section.title}
            left={(props) => (
              <MaterialIcons name={section.icon} size={24} color="#007AFF" />
            )}
          />
          <Card.Content>
            <List.Section>
              {section.items.map((item, itemIndex) => (
                <List.Item
                  key={itemIndex}
                  title={item}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="checkbox-blank-circle"
                      color="#34C759"
                    />
                  )}
                  titleNumberOfLines={2}
                  titleStyle={styles.listItemTitle}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>
      ))}

      <Card style={styles.contactCard}>
        <Card.Content>
          <Text style={styles.contactTitle}>Need More Help?</Text>
          <Text style={styles.contactText}>
            Contact our support team at support@matatu-link.com or call us at
            +254 718 920 243
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#007AFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 10,
  },
  listItemTitle: {
    fontSize: 14,
    color: "#333333",
  },
  contactCard: {
    marginBottom: 32,
    borderRadius: 10,
    backgroundColor: "#F8F9FA",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});

export default HelpScreen;
