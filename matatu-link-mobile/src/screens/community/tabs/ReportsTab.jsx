// src/screens/community/tabs/ReportsTab.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { getReports } from "../../../api/reports";
import ReportItem from "./components/ReportItem";
import { useAuth } from "../../../contexts/AuthContext";

const ReportsTab = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

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

  const handleReportPress = (report) => {
    navigation.navigate("ReportDetail", { reportId: report.report_id });
  };

  const renderReportItem = ({ item }) => (
    <ReportItem report={item} onPress={() => handleReportPress(item)} />
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
