// src/screens/community/tabs/ReportsTab.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CommunityActionButton from "../../../components/common/CommunityActionButton";
import { getReports, deleteReport } from "../../../api/reports";
import ReportItem from "./components/ReportItem";
import { useAuth } from "../../../contexts/AuthContext";

const ReportsTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
      Alert.alert("Error", "Failed to load reports.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const handleAdd = () => {
    // Change from CreateReport to CreateEditReport
    navigation.navigate("CreateEditReport", {
      // No reportId means this is a new report
      reportId: null,
    });
  };

  const handleEdit = () => {
    if (selectedId) {
      navigation.navigate("EditReport", { reportId: selectedId });
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReport(selectedId);
              setReports(reports.filter((r) => r.report_id !== selectedId));
              setSelectionMode(false);
              setSelectedId(null);
              Alert.alert("Success", "Report deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete report");
            }
          },
        },
      ]
    );
  };

  const handleReportPress = (report) => {
    if (selectionMode) {
      setSelectedId(selectedId === report.report_id ? null : report.report_id);
    } else {
      navigation.navigate("ReportDetail", { reportId: report.report_id });
    }
  };

  const renderReportItem = ({ item }) => (
    <ReportItem
      report={item}
      onPress={() => handleReportPress(item)}
      selected={selectedId === item.report_id}
      selectionMode={selectionMode}
    />
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Reports Available.</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.report_id.toString()}
          renderItem={renderReportItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
            />
          }
          contentContainerStyle={
            reports.length === 0 && styles.flatListContainer
          }
        />
      )}
      <CommunityActionButton
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        type="report"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666666",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default ReportsTab;
