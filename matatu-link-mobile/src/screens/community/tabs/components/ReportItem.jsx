// src/screens/community/tabs/components/ReportItem.jsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text, Badge } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const ReportItem = ({ report, onPress }) => {
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

  const getReportIcon = (type) => {
    switch (type) {
      case "safety":
        return "warning";
      case "security":
        return "security";
      default:
        return "report-problem";
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Title
          title={`${report.report_type.charAt(0).toUpperCase()}${report.report_type.slice(1)} Report`}
          subtitle={`Reported on: ${new Date(report.date_reported).toLocaleDateString()}`}
          left={(props) => (
            <MaterialIcons 
              name={getReportIcon(report.report_type)} 
              size={24} 
              color={getStatusColor(report.status)}
            />
          )}
          right={(props) => (
            <Badge 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(report.status) }
              ]}
            >
              {report.status}
            </Badge>
          )}
        />
        <Card.Content>
          <Text numberOfLines={2} style={styles.descriptionText}>
            {report.description}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  statusBadge: {
    marginRight: 15,
  },
  selectedCard: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
});

export default ReportItem;