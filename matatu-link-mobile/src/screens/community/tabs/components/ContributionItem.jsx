// src/screens/community/tabs/components/ContributionItem.jsx

import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { castVote, getVotesForContribution } from "../../../../api/votes";
import { useAuth } from "../../../../contexts/AuthContext";

const ContributionItem = ({ contribution, onPress, onDelete }) => {
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
      setVotes(data);
      // Check if the current user has voted
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
      await castVote({
        contribution_id: contribution.contribution_id,
        vote_type: voteType,
      });
      // Update local vote counts
      setVotes((prev) => ({
        ...prev,
        upvotes: voteType === "upvote" ? prev.upvotes + 1 : prev.upvotes,
        downvotes:
          voteType === "downvote" ? prev.downvotes + 1 : prev.downvotes,
      }));
      setUserVote(voteType);
    } catch (error) {
      console.error("Error casting vote:", error.message);
      Alert.alert("Error", "Failed to cast vote.");
    } finally {
      setVoting(false);
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Title
          title={contribution.notification_type || "No Type"}
          subtitle={`Submitted on: ${new Date(
            contribution.date_sent
          ).toLocaleDateString()}`}
          left={(props) => (
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          )}
          right={() =>
            onDelete && (
              <IconButton
                icon="delete"
                color="#FF3B30"
                size={24}
                onPress={onDelete}
              />
            )
          }
        />
        <Card.Content>
          <Text style={styles.contentText}>{contribution.content}</Text>
          <View style={styles.voteContainer}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => handleVote("upvote")}
              disabled={voting}
            >
              <Ionicons
                name={userVote === "upvote" ? "thumbs-up" : "thumbs-up-outline"}
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
              <Ionicons
                name={
                  userVote === "downvote"
                    ? "thumbs-down"
                    : "thumbs-down-outline"
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
