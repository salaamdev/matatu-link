// src/screens/community/tabs/components/ReportItem.jsx

import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const ReportItem = ({ report, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Title
          title={report.report_type || "No Type"}
          subtitle={`Reported on: ${new Date(
            report.date_reported
          ).toLocaleDateString()}`}
          left={(props) => (
            <MaterialIcons name="report" size={24} color="#FF9500" />
          )}
        />
        <Card.Content>
          <Text style={styles.descriptionText}>{report.description}</Text>
          <Text style={styles.statusText}>Status: {report.status}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 5,
  },
  statusText: {
    fontSize: 14,
    marginTop: 10,
    color: "#666666",
  },
});

export default ReportItem;
