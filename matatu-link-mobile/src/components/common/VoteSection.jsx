// matatu-link-mobile/src/components/common/VoteSection.jsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { castVote, getVotesForContribution } from "../../api/votes";
import { useAuth } from "../../contexts/AuthContext";

const VoteSection = ({ contributionId }) => {
  const { user } = useAuth();
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, [contributionId]);

  const fetchVotes = async () => {
    try {
      const data = await getVotesForContribution(contributionId);
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
      Alert.alert("Error", "Failed to fetch votes.");
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
      await castVote({
        contribution_id: parseInt(contributionId, 10), // Ensure it's an integer
        vote_type: voteType,
      });
      await fetchVotes();
    } catch (error) {
      console.error("Error casting vote:", error.message);
      if (error.response && error.response.data) {
        console.error("Backend response:", error.response.data);
        Alert.alert(
          "Error",
          error.response.data.error || "Failed to cast vote."
        );
      } else {
        Alert.alert("Error", "Failed to cast vote.");
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votes</Text>
      <View style={styles.voteButtons}>
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => handleVote("upvote")}
          disabled={voting}
        >
          <MaterialCommunityIcons
            name={userVote === "upvote" ? "thumb-up" : "thumb-up-outline"}
            size={30}
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
            name={userVote === "downvote" ? "thumb-down" : "thumb-down-outline"}
            size={30}
            color="#FF3B30"
          />
          <Text style={styles.voteCount}>{votes.downvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  voteButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  voteCount: {
    marginLeft: 8,
    fontSize: 18,
  },
});

export default VoteSection;
