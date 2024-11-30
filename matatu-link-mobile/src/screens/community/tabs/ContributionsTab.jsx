// src/screens/community/tabs/ContributionsTab.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import {
  getContributions,
  deleteContribution,
} from "../../../api/contributions";
import ContributionItem from "./components/ContributionItem";
import { useAuth } from "../../../contexts/AuthContext";

const ContributionsTab = ({ navigation }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const data = await getContributions();
      setContributions(data);
    } catch (error) {
      console.error("Error fetching contributions:", error.message);
      Alert.alert("Error", "Failed to load contributions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchContributions();
  };

  const handleContributionPress = (contribution) => {
    navigation.navigate("ContributionDetail", {
      contributionId: contribution.contribution_id,
      isEdit: false,
    });
  };

  const handleDeleteContribution = (contributionId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this contribution?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteContribution(contributionId);
              setContributions(
                contributions.filter(
                  (c) => c.contribution_id !== contributionId
                )
              );
              Alert.alert("Success", "Contribution deleted successfully.");
            } catch (error) {
              console.error("Error deleting contribution:", error.message);
              Alert.alert("Error", "Failed to delete contribution.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contributions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Contributions Available.</Text>
        </View>
      ) : (
        <FlatList
          data={contributions}
          keyExtractor={(item) => item.contribution_id.toString()}
          renderItem={({ item }) => (
            <ContributionItem
              contribution={item}
              onPress={() => handleContributionPress(item)}
              onDelete={
                user?.userRole?.role_name === "admin"
                  ? () => handleDeleteContribution(item.contribution_id)
                  : null
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
            />
          }
          contentContainerStyle={
            contributions.length === 0 && styles.flatListContainer
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

export default ContributionsTab;
