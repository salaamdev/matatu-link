// [matatu-link-mobile/src/screens/community/ContributionDetailScreen.jsx](matatu-link-mobile/src/screens/community/ContributionDetailScreen.jsx)

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { getContributionById } from "../../api/contributions";
import { useAuth } from "../../contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import VoteSection from "../../components/common/VoteSection"; // New component for votes
import { deleteContribution } from "../../api/contributions"; // Add this import

const ContributionDetailScreen = ({ route, navigation }) => {
  const { contributionId } = route.params;
  const [contribution, setContribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchContributionDetails();
  }, [contributionId]);
  // Inside ContributionDetailScreen component
  const handleDelete = () => {
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
              Alert.alert("Success", "Contribution deleted successfully");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete contribution");
            }
          },
        },
      ]
    );
  };

  const fetchContributionDetails = async () => {
    try {
      const data = await getContributionById(contributionId);
      setContribution(data);
    } catch (error) {
      console.error("Error fetching contribution details:", error.message);
      Alert.alert("Error", "Failed to load contribution details.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!contribution) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Contribution not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Basic Details Card */}
      <Card style={styles.card}>
        <Card.Title
          title={`${contribution.contribution_type} - Id:${contribution.contribution_id}`}
          subtitle={`Submitted by: ${
            contribution.contributorUser.username
          } on ${new Date(contribution.date_submitted).toLocaleDateString()}`}
          left={() => (
            <MaterialCommunityIcons
              name="information"
              size={24}
              color="#007AFF"
            />
          )}
        />
        <Card.Content>
          <Text style={styles.sectionTitle}>Content</Text>
          <Text style={styles.contentText}>{contribution.content}</Text>

          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.statusText}>{contribution.status}</Text>
        </Card.Content>
      </Card>

      {/* Associated Details Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Associated Details"
          left={() => (
            <MaterialCommunityIcons name="link" size={24} color="#007AFF" />
          )}
        />
        <Card.Content>
          {contribution.route_id && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Route ID:</Text>
              <Text style={styles.detailText}>{contribution.route_id}</Text>
            </View>
          )}
          {contribution.stop_id && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Stop ID:</Text>
              <Text style={styles.detailText}>{contribution.stop_id}</Text>
            </View>
          )}
          {contribution.matatu_id && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Matatu ID:</Text>
              <Text style={styles.detailText}>{contribution.matatu_id}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Votes Section */}
      <VoteSection contributionId={contribution.contribution_id} />

      {/* Action Buttons */}
      {user?.roleName === "admin" && (
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleDelete}
            style={[styles.button, styles.deleteButton]}
            icon="delete"
          >
            Delete
          </Button>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("CreateEditContribution", { contributionId })
            }
            style={styles.button}
            icon="pencil"
          >
            Edit
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    color: "#007AFF",
  },
  contentText: {
    fontSize: 16,
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    marginTop: 5,
    color: "#FF9500",
  },
  detailRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    width: 100,
  },
  detailText: {
    fontSize: 16,
    flexShrink: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 0.48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666666",
  },
  deleteButton: {
    backgroundColor: "#FF3B30"
  },
});

export default ContributionDetailScreen;
