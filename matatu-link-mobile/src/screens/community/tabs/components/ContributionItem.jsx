// [matatu-link-mobile/src/screens/community/tabs/components/ContributionItem.jsx](matatu-link-mobile/src/screens/community/tabs/components/ContributionItem.jsx)

import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Alert } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { castVote, getVotesForContribution } from "../../../../api/votes";
import { useAuth } from "../../../../contexts/AuthContext";

const ContributionItem = ({ contribution, onPress }) => {
  const { user } = useAuth();
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null); // 'upvote' | 'downvote' | null
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const data = await getVotesForContribution(contribution.contribution_id);
      setVotes({ upvotes: data.upvotes, downvotes: data.downvotes });
      if (user) {
        const userSpecificVote = data.votes.find(
          (v) => v.user_id === user.user_id
        );
        if (userSpecificVote) {
          setUserVote(userSpecificVote.vote_type);
        }
      }
    } catch (error) {
      console.error("Error fetching votes:", error.message);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to vote.");
      return;
    }

    if (userVote === voteType) {
      Alert.alert(
        "Already Voted",
        `You have already ${voteType}d this contribution.`
      );
      return;
    }

    setVoting(true);
    try {
      // Ensure contribution_id exists and is a number
      if (!contribution?.contribution_id) {
        throw new Error("Invalid contribution ID");
      }

      await castVote({
        contribution_id: contribution.contribution_id,
        vote_type: voteType,
      });

      // Refresh votes only after successful vote
      await fetchVotes();
    } catch (error) {
      console.error("Error casting vote:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to cast vote. Please try again."
      );
    } finally {
      setVoting(false);
    }
  };

  const getContributionIcon = (type) => {
    switch (type) {
      case "route":
        return "routes";
      case "stop":
        return "bus-stop";
      case "matatu":
        return "bus";
      default:
        return "comment-question";
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Title
          title={`#${contribution.contribution_id} - ${contribution.contribution_type}`}
          subtitle={`Submitted on: ${new Date(
            contribution.date_submitted
          ).toLocaleDateString()}`}
          left={(props) => (
            <MaterialCommunityIcons
              name={getContributionIcon(contribution.contribution_type)}
              size={24}
              color="#007AFF"
            />
          )}
        />
        <Card.Content>
          <Text style={styles.contentText}>{contribution.content}</Text>
          <View style={styles.voteContainer}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => handleVote("upvote")}
              disabled={voting}
            >
              <MaterialCommunityIcons
                name={userVote === "upvote" ? "thumb-up" : "thumb-up-outline"}
                size={24}
                color="#34C759"
              />
              <Text style={styles.voteCount}>{votes.upvotes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => handleVote("downvote")}
              disabled={voting}
            >
              <MaterialCommunityIcons
                name={
                  userVote === "downvote" ? "thumb-down" : "thumb-down-outline"
                }
                size={24}
                color="#FF3B30"
              />
              <Text style={styles.voteCount}>{votes.downvotes}</Text>
            </TouchableOpacity>
          </View>
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
  contentText: {
    fontSize: 16,
    marginTop: 5,
  },
  voteContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  voteCount: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default ContributionItem;
