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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: "#8F9BB3",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.25,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
    alignItems: "flex-end",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  fab: {
    marginBottom: 8,
    borderRadius: 28,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  fabAdd: {
    backgroundColor: "#00C853",
  },
  fabEdit: {
    backgroundColor: "#2196F3",
  },
  fabDelete: {
    backgroundColor: "#FF3B30",
  },
  fabCancel: {
    backgroundColor: "#757575",
  },
  adminMenuContainer: {
    position: "absolute",
    right: 0,
    bottom: 70,
    flexDirection: "column",
    alignItems: "flex-end",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  refreshIndicator: {
    color: "#2196F3",
  },
});


export default MatatusScreen;
