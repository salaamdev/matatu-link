// src/screens/profile/GenerateDBpdfsScreen.jsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { UserActivityPdfGenerator } from "../../services/pdfGenerators/UserActivityPdfGenerator";
import * as Sharing from "expo-sharing";

const PdfGenerationCard = ({
  title,
  description,
  iconName,
  onPress,
  loading,
}) => (
  <Card style={styles.card}>
    <Card.Content style={styles.cardContent}>
      <MaterialIcons
        name={iconName}
        size={32}
        color="#007AFF"
        style={styles.icon}
      />
      <Title>{title}</Title>
      <Paragraph style={styles.description}>{description}</Paragraph>
    </Card.Content>
    <Card.Actions style={styles.cardActions}>
      <Button
        mode="contained"
        onPress={onPress}
        loading={loading}
        icon="file-pdf-box"
        style={styles.button}
      >
        Generate PDF
      </Button>
    </Card.Actions>
  </Card>
);

const GenerateDBpdfsScreen = () => {
  const [generating, setGenerating] = useState(false);

  const handleUserActivityReport = async () => {
    try {
      setGenerating(true);
      const generator = new UserActivityPdfGenerator();
      const pdfPath = await generator.generateActivityReport();

      if (!pdfPath) {
        throw new Error("No PDF path returned");
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfPath, {
          mimeType: "application/pdf",
          dialogTitle: "User Activity Report",
        });
      } else {
        throw new Error("Sharing not available on this device");
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Alert.alert("Error", `Failed to generate PDF report: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const pdfOptions = [
    {
      title: "User Activity Report",
      description: "Generate a detailed PDF report of user activities...",
      iconName: "people",
      onPress: handleUserActivityReport,
      loading: generating,
    },
    {
      title: "Matatu Fleet Analysis",
      description:
        "Create a comprehensive PDF document showing matatu fleet statistics, routes, and operator performance metrics with visual representations.",
      iconName: "directions-bus",
      onPress: () => console.log("Generate Fleet Analysis PDF"),
    },
    {
      title: "Route Performance Dashboard",
      description:
        "Export a PDF dashboard displaying route statistics, popular stops, and fare collection data with interactive maps and charts.",
      iconName: "route",
      onPress: () => console.log("Generate Route Performance PDF"),
    },
    {
      title: "Safety & Incident Report",
      description:
        "Generate a detailed PDF report of safety incidents, resolved issues, and security concerns with timeline visualizations.",
      iconName: "security",
      onPress: () => console.log("Generate Safety Report PDF"),
    },
    {
      title: "Financial Summary",
      description:
        "Create a comprehensive PDF of financial transactions, fare collections, and revenue analysis with detailed breakdowns and trends.",
      iconName: "attach-money",
      onPress: () => console.log("Generate Financial Summary PDF"),
    },
    {
      title: "Community Engagement Report",
      description:
        "Export a PDF report showcasing user contributions, feedback, and community participation metrics with engagement analytics.",
      iconName: "group-work",
      onPress: () => console.log("Generate Community Report PDF"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Database Reports</Text>
      <Text style={styles.subheader}>
        Generate comprehensive PDF reports from your database
      </Text>

      {pdfOptions.map((option, index) => (
        <PdfGenerationCard
          key={index}
          title={option.title}
          description={option.description}
          iconName={option.iconName}
          onPress={option.onPress}
          loading={option.loading}
        />
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardContent: {
    alignItems: "center",
    padding: 16,
  },
  icon: {
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    marginTop: 8,
    color: "#666",
  },
  cardActions: {
    justifyContent: "center",
    paddingBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
  },
});

export default GenerateDBpdfsScreen;
