// src/screens/community/tabs/ContributionsTab.jsx

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
import ContributionItem from "./components/ContributionItem";
import {
  getContributions,
  deleteContribution,
} from "../../../api/contributions";
import { useAuth } from "../../../contexts/AuthContext";

const ContributionsTab = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useAuth();
  const navigation = useNavigation();

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

  const handleAdd = () => {
    // Change from CreateContribution to CreateEditContribution
    navigation.navigate("CreateEditContribution", {
      // No contributionId means this is a new contribution
      contributionId: null,
    });
  };

  const handleEdit = () => {
    if (selectedId) {
      navigation.navigate("CreateEditContribution", {
        contributionId: selectedId,
      });
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;

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
              await deleteContribution(selectedId);
              setContributions(
                contributions.filter((c) => c.contribution_id !== selectedId)
              );
              setSelectionMode(false);
              setSelectedId(null);
              Alert.alert("Success", "Contribution deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete contribution");
            }
          },
        },
      ]
    );
  };

  const handleContributionPress = (contribution) => {
    if (selectionMode) {
      setSelectedId(
        selectedId === contribution.contribution_id
          ? null

          : contribution.contribution_id
      );
    } else {
      navigation.navigate("ContributionDetail", {
        contributionId: contribution.contribution_id,
      });
    }
  };

  const renderItem = ({ item }) => (
    <ContributionItem
      contribution={item}
      onPress={() => handleContributionPress(item)}
      selected={selectedId === item.contribution_id}
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
      {contributions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Contributions Available.</Text>
        </View>
      ) : (
        <FlatList
          data={contributions}
          keyExtractor={(item) => item.contribution_id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        type="contribution"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888888",
    textAlign: "center",
  },
});


export default ContributionsTab;
