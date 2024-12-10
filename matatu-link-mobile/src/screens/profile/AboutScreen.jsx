import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { Card, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const AboutScreen = () => {
  const version = "1.0.0"; // App version

  const appFeatures = [
    {
      title: "Real-time Tracking",
      description: "Track matatus in real-time across Nairobi's routes",
      icon: "location-on",
    },
    {
      title: "Community Driven",
      description: "Contribute and vote on route updates and improvements",
      icon: "people",
    },
    {
      title: "Safety First",
      description: "Report and track safety incidents for better commuting",
      icon: "security",
    },
    {
      title: "Smart Payments",
      description: "Secure and convenient digital fare payments",
      icon: "payment",
    },
  ];

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@matatu-link.com");
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.appName}>Matatu-Link</Text>
          <Text style={styles.version}>Version {version}</Text>
          <Text style={styles.tagline}>
            Revolutionizing Public Transport in Nairobi
          </Text>
        </Card.Content>
      </Card>

      {/* Mission Statement */}
      <Card style={styles.card}>
        <Card.Title
          title="Our Mission"
          left={(props) => (
            <MaterialIcons name="lightbulb" size={24} color="#007AFF" />
          )}
        />
        <Card.Content>
          <Text style={styles.missionText}>
            To transform Nairobi's public transport through technology, making
            commuting more efficient, safer, and enjoyable for everyone.
          </Text>
        </Card.Content>
      </Card>

      {/* Features Section */}
      <Card style={styles.card}>
        <Card.Title
          title="Key Features"
          left={(props) => (
            <MaterialIcons name="stars" size={24} color="#007AFF" />
          )}
        />
        <Card.Content>
          {appFeatures.map((feature, index) => (
            <React.Fragment key={index}>
              <View style={styles.featureRow}>
                <MaterialIcons name={feature.icon} size={24} color="#34C759" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
              {index < appFeatures.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>

      {/* Contact & Support */}
      <Card style={styles.card}>
        <Card.Title
          title="Contact & Support"
          left={(props) => (
            <MaterialIcons name="help" size={24} color="#007AFF" />
          )}
        />
        <Card.Content>
          <Text style={styles.contactText}>
            Need help or have suggestions? We'd love to hear from you!
          </Text>
          <Text style={styles.contactDetails} onPress={handleContactSupport}>
            Email: support@matatu-link.com
          </Text>
          <Text style={styles.contactDetails}>Phone: +254 718 920 243</Text>
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
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
  version: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 4,
  },
  tagline: {
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  featureContent: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  divider: {
    marginVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
  },
  contactDetails: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 8,
  },
});

export default AboutScreen;
