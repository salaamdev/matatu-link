// src/screens/community/ReportDetailScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, Text, Button, Divider, Chip } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { getReportById, updateReportStatus } from "../../api/reports";
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
      const data = await getReportById(reportId);
      setReport(data);
    } catch (error) {
      console.error("Error fetching report details:", error.message);
      Alert.alert("Error", "Failed to load report details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    Alert.alert(
      "Confirm Status Update",
      `Are you sure you want to mark this report as ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const updatedReport = await updateReportStatus(
                reportId,
                newStatus
              );
              setReport(updatedReport);
              Alert.alert("Success", "Report status updated successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to update report status");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "reviewed":
        return "#007AFF";
      case "resolved":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Report Details"
          subtitle={`Report #${report.report_id}`}
          left={(props) => (
            <MaterialIcons name="report" size={24} color="#FF9500" />
          )}
        />
        <Card.Content>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(report.status) },
            ]}
          >
            {report.status.toUpperCase()}
          </Chip>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{report.description}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>Report Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={20} color="#666666" />
            <Text style={styles.infoText}>
              Reported on: {new Date(report.date_reported).toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={20} color="#666666" />
            <Text style={styles.infoText}>
              Type: {report.report_type.toUpperCase()}
            </Text>
          </View>

          {report.reportUser && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Reporter Information</Text>
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={20} color="#666666" />
                <Text style={styles.infoText}>
                  Reported by: {report.reportUser.username}
                </Text>
              </View>
            </>
          )}

          {report.reportMatatu && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Related Matatu</Text>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="directions-bus"
                  size={20}
                  color="#666666"
                />
                <Text style={styles.infoText}>
                  Registration: {report.reportMatatu.registration_number}
                </Text>
              </View>
            </>
          )}

          {report.reportRoute && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Related Route</Text>
              <View style={styles.infoRow}>
                <MaterialIcons name="route" size={20} color="#666666" />
                <Text style={styles.infoText}>
                  Route: {report.reportRoute.route_name}
                </Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Admin Actions */}
      {user?.userRole?.role_name === "admin" && (
        <Card style={[styles.card, styles.actionsCard]}>
          <Card.Title title="Admin Actions" />
          <Card.Content>
            <View style={styles.adminActions}>
              {report.status === "pending" && (
                <Button
                  mode="contained"
                  onPress={() => handleUpdateStatus("reviewed")}
                  style={[styles.button, { backgroundColor: "#007AFF" }]}
                  icon="eye-check"
                >
                  Mark as Reviewed
                </Button>
              )}
              {report.status !== "resolved" && (
                <Button
                  mode="contained"
                  onPress={() => handleUpdateStatus("resolved")}
                  style={[styles.button, { backgroundColor: "#34C759" }]}
                  icon="check-circle"
                >
                  Mark as Resolved
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  actionsCard: {
    marginTop: 0,
  },
  statusChip: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  divider: {
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666666",
  },
  adminActions: {
    gap: 10,
  },
  button: {
    marginVertical: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReportDetailScreen;
