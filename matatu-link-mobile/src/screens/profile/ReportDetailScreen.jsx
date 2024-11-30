// src/screens/profile/ReportDetailScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Text, Button, Card, Divider } from "react-native-paper";
import { getReportById, updateReportStatus } from "../../api/pdf_reports";
import { useAuth } from "../../contexts/AuthContext";

const ReportDetailScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchReportDetails();
  }, []);

  const fetchReportDetails = async () => {
    try {
      const data = await getReportById(reportId); // Ensure this endpoint exists
      setReport(data);
    } catch (error) {
      console.error("Error fetching report details:", error.message);
      Alert.alert("Error", "Failed to load report details.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (newStatus) => {
    Alert.alert(
      "Confirm Status Update",
      `Are you sure you want to mark this report as ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const updatedReport = await updateReportStatus(
                reportId,
                newStatus
              );
              setReport(updatedReport);
              Alert.alert("Success", "Report status updated successfully.");
            } catch (error) {
              console.error("Error updating report status:", error.message);
              Alert.alert("Error", "Failed to update report status.");
            }
          },
        },
      ]
    );
  };

  if (loading || !report) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={`Report ID: ${report.report_id}`}
          subtitle={`Type: ${report.report_type}`}
          left={(props) => (
            <MaterialIcons name="report" size={24} color="#FF9500" />
          )}
        />
        <Card.Content>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{report.description}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.label}>Date Reported:</Text>
          <Text style={styles.text}>
            {new Date(report.date_reported).toLocaleDateString()}
          </Text>
          <Divider style={styles.divider} />
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.text}>{report.status}</Text>
        </Card.Content>
      </Card>

      {/* Admin Actions */}
      {user?.userRole?.role_name === "admin" && (
        <View style={styles.adminActions}>
          {report.status !== "reviewed" && (
            <Button
              mode="contained"
              onPress={() => handleUpdateStatus("reviewed")}
              style={styles.button}
            >
              Mark as Reviewed
            </Button>
          )}
          {report.status !== "resolved" && (
            <Button
              mode="contained"
              onPress={() => handleUpdateStatus("resolved")}
              style={[styles.button, styles.resolveButton]}
            >
              Mark as Resolved
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};

import { MaterialIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
  divider: {
    marginVertical: 10,
  },
  adminActions: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: "80%",
    marginVertical: 5,
  },
  resolveButton: {
    backgroundColor: "#34C759",
  },
});

export default ReportDetailScreen;
