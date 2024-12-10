// src/screens/GenerateDBpdfsScreen.jsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../../api/config";
import { generateMatatuPDF } from "../../utils/matatuPdfGenerator";
import { generateRoutesPDF } from "../../utils/routesPdfGenerator";
import { generateUsersPDF } from "../../utils/userPdfGenerator";
import { generateReportsPDF } from "../../utils/reportsPdfGenerator";
import { generateContributionsPDF } from "../../utils/contributionsPdfGenerator";
import { generateFaresPDF } from "../../utils/faresPdfGenerator";
const GenerateDBpdfsScreen = () => {
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: "matatus",
      title: "Matatus Database",
      description:
        "Generate PDF containing all matatu records including registration numbers, routes, and status",
      icon: "directions-bus",
    },
    {
      id: "routes",
      title: "Routes Database",
      description:
        "Generate PDF with all route information including stops and fares",
      icon: "route",
    },
    {
      id: "users",
      title: "Users Database",
      description:
        "Generate PDF of all user records (excluding sensitive information)",
      icon: "people",
    },
    {
      id: "reports",
      title: "Reports Database",
      description:
        "Generate PDF containing all reported issues and their status",
      icon: "report",
    },
    {
      id: "contributions",
      title: "Contributions Database",
      description: "Generate PDF of all user contributions and suggestions",
      icon: "comment",
    },
    {
      id: "fares",
      title: "Fares Database",
      description: "Generate PDF with fare history and payment records",
      icon: "payments",
    },
  ];
  const handleGeneratePDF = async (categoryId) => {
    setLoading(true);
    try {
      switch (categoryId) {
        case "matatus":
          const matatusResponse = await api.get("/matatus");
          await generateMatatuPDF(matatusResponse.data);
          break;

        case "routes":
          const routesResponse = await api.get("/routes");
          await generateRoutesPDF(routesResponse.data);
          break;

        case "users":
          const usersResponse = await api.get("/users");
          await generateUsersPDF(usersResponse.data);
          break;

        case "reports":
          const reportsResponse = await api.get("/reports");
          await generateReportsPDF(reportsResponse.data);
          break;

        case "contributions":
          const contributionsResponse = await api.get("/contributions");
          await generateContributionsPDF(contributionsResponse.data);
          break;

        case "fares":
          const faresResponse = await api.get("/fares");
          await generateFaresPDF(faresResponse.data);
          break;

        default:
          console.log(`Generate PDF for ${categoryId}`);
          return;
      }

      Alert.alert("Success", "PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.screenTitle}>Database PDF Generator</Title>
      <Paragraph style={styles.screenDescription}>
        Generate PDF reports from different database collections
      </Paragraph>
      <Divider style={styles.divider} />

      {categories.map((category) => (
        <Card key={category.id} style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name={category.icon} size={24} color="#007AFF" />
              <Title style={styles.cardTitle}>{category.title}</Title>
            </View>
            <Paragraph style={styles.description}>
              {category.description}
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              mode="contained"
              icon="file-pdf-box"
              onPress={() => handleGeneratePDF(category.id)}
              style={styles.generateButton}
              labelStyle={styles.buttonLabel}
              loading={loading && category.id === "matatus"}
              disabled={loading}
            >
              Generate PDF
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  screenDescription: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "#666666",
    fontSize: 14,
    marginLeft: 36,
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingRight: 16,
    paddingBottom: 16,
  },
  generateButton: {
    backgroundColor: "#007AFF",
  },
  buttonLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default GenerateDBpdfsScreen;
