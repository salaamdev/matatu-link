// matatu-link-mobile/src/screens/community/tabs/ContributionsTab.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import the hook
import ContributionItem from "./components/ContributionItem";
import { getContributions } from "../../../api/contributions";
import { useAuth } from "../../../contexts/AuthContext";

const ContributionsTab = () => {
  // Remove navigation from props
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation(); // Initialize navigation using hook

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
    });
  };

  const renderItem = ({ item }) => (
    <ContributionItem
      contribution={item}
      onPress={() => handleContributionPress(item)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
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
});

export default ContributionsTab;
