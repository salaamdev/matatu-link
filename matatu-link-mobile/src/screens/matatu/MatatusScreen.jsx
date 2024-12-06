// src/screens/matatu/MatatusScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
} from "react-native";
import { Text, FAB } from "react-native-paper";
import MatatuItem from "./components/MatatuItem";
import AdminActionButton from "../../components/common/AdminActionButton";
import api from "../../api/config";
import { useAuth } from "../../contexts/AuthContext";

const MatatusScreen = ({ navigation }) => {
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMatatuId, setSelectedMatatuId] = useState(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchMatatus();
  }, []);

  const fetchMatatus = async () => {
    try {
      const response = await api.get("/matatus");
      setMatatus(response.data);
    } catch (error) {
      console.error("Error fetching matatus:", error.message);
      Alert.alert("Error", "Failed to load Matatus.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatatus();
  };

  const handleMatatuPress = (matatu) => {
    if (selectionMode) {
      setSelectedMatatuId(
        selectedMatatuId === matatu.matatu_id ? null : matatu.matatu_id
      );
    } else {
      navigation.navigate("MatatuDetail", { matatuId: matatu.matatu_id });
    }
  };

  const handleDelete = () => {
    if (!selectedMatatuId) {
      Alert.alert("Error", "Please select a matatu to delete.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this matatu?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/matatus/${selectedMatatuId}`);
              setMatatus(
                matatus.filter((m) => m.matatu_id !== selectedMatatuId)
              );
              Alert.alert("Success", "Matatu deleted successfully");
              setSelectionMode(false);
              setSelectedMatatuId(null);
            } catch (error) {
              console.error("Error deleting matatu:", error.message);
              Alert.alert("Error", "Failed to delete matatu");
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!selectedMatatuId) {
      Alert.alert("Error", "Please select a matatu to edit.");
      return;
    }

    const selectedMatatu = matatus.find(
      (m) => m.matatu_id === selectedMatatuId
    );
    navigation.navigate("AddEditMatatu", {
      matatu: selectedMatatu,
      isEdit: true,
    });
    setSelectionMode(false);
    setSelectedMatatuId(null);
  };

  const handleAdd = () => {
    navigation.navigate("AddEditMatatu", { isEdit: false });
  };

  const toggleAdminMenu = () => {
    if (isAdminMenuOpen) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    setIsAdminMenuOpen(!isAdminMenuOpen);
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
      <FlatList
        data={matatus}
        keyExtractor={(item) => item.matatu_id.toString()}
        renderItem={({ item }) => (
          <MatatuItem
            matatu={item}
            onPress={handleMatatuPress}
            selectionMode={selectionMode}
            selected={item.matatu_id === selectedMatatuId}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Matatus Available.</Text>
          </View>
        }
        contentContainerStyle={matatus.length === 0 && styles.flatListContainer}
      />

      {user?.roleName === "admin" && (
        <View style={styles.fabContainer}>
          {selectionMode ? (
            <>
              <FAB
                style={[styles.fab, styles.fabCancel]}
                icon="close"
                onPress={() => {
                  setSelectionMode(false);
                  setSelectedMatatuId(null);
                  setIsAdminMenuOpen(false);
                }}
                label="Cancel"
              />
              <FAB
                style={[styles.fab, styles.fabDelete]}
                icon="delete"
                onPress={handleDelete}
                label="Delete"
              />
              <FAB
                style={[styles.fab, styles.fabEdit]}
                icon="pencil"
                onPress={handleEdit}
                label="Edit"
              />
            </>
          ) : (
            <>
              <AdminActionButton
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectionMode={selectionMode}
                setSelectionMode={setSelectionMode}
                selectedId={selectedMatatuId}
                setSelectedId={setSelectedMatatuId}
              />
              <Animated.View
                style={[
                  styles.adminMenuContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [100, 0],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents={isAdminMenuOpen ? "auto" : "none"}
              >
                <FAB
                  style={[styles.fab, styles.fabAdd]}
                  icon="plus"
                  onPress={handleAdd}
                  label="Add"
                />
                <FAB
                  style={[styles.fab, styles.fabEdit]}
                  icon="pencil"
                  onPress={() => setSelectionMode(true)}
                  label="Select"
                />
              </Animated.View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

// src/screens/matatu/MatatusScreen.jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#A9A9A9",
    textAlign: "center",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  fab: {
    marginBottom: 10,
  },
  fabAdd: {
    backgroundColor: "#34C759",
  },
  fabEdit: {
    backgroundColor: "#FF9500",
  },
  fabDelete: {
    backgroundColor: "#FF3B30",
  },
  fabCancel: {
    backgroundColor: "#8E8E93",
  },
  adminMenuContainer: {
    marginBottom: 70,
    alignItems: "flex-end",
  },
});


export default MatatusScreen;
