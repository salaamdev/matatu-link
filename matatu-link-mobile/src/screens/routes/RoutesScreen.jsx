// src/screens/routes/RoutesScreen.jsx
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
import { Text } from "react-native-paper";
import RouteItem from "./components/RouteItem";
import RouteAdminActionButton from "../../components/common/RouteAdminActionButton";
import { getRoutes, deleteRoute } from "../../api/routes";
import { useAuth } from "../../contexts/AuthContext";


const RoutesScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error.message);
      Alert.alert("Error", "Failed to load routes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoutes();
  };

  const handleRoutePress = (route) => {
    if (selectionMode) {
      setSelectedRouteId(
        selectedRouteId === route.route_id ? null : route.route_id
      );
    } else {
      navigation.navigate("RouteDetail", { routeId: route.route_id });
    }
  };

  const handleDelete = async () => {
    if (!selectedRouteId) {
      Alert.alert("Error", "Please select a route to delete.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this route?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoute(selectedRouteId);
              setRoutes(routes.filter((r) => r.route_id !== selectedRouteId));
              Alert.alert("Success", "Route deleted successfully");
              setSelectionMode(false);
              setSelectedRouteId(null);
            } catch (error) {
              console.error("Error deleting route:", error.message);
              Alert.alert("Error", "Failed to delete route");
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!selectedRouteId) {
      Alert.alert("Error", "Please select a route to edit.");
      return;
    }
    const selectedRoute = routes.find((r) => r.route_id === selectedRouteId);
    navigation.navigate("AddEditRoute", {
      isEdit: true,
      routeData: selectedRoute,
    });
    setSelectionMode(false);
    setSelectedRouteId(null);
  };

  const handleAdd = () => {
    navigation.navigate("AddEditRoute", { isEdit: false });
  };

  const renderRouteItem = ({ item }) => (
    <RouteItem
      route={item}
      onPress={handleRoutePress}
      selectionMode={selectionMode}
      selected={item.route_id === selectedRouteId}
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
      <FlatList
        data={routes}
        keyExtractor={(item) => item.route_id.toString()}
        renderItem={renderRouteItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Routes Available.</Text>
          </View>
        }
        contentContainerStyle={routes.length === 0 && styles.flatListContainer}
      />

      {user?.roleName === "admin" && (
        <RouteAdminActionButton
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedId={selectedRouteId}
          setSelectedId={setSelectedRouteId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA", // Subtle light background for a clean appearance
    paddingHorizontal: 10, // Add horizontal padding for overall layout spacing
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Keeps it consistent with app theme
    borderRadius: 10,
    margin: 20, // Provides spacing from the edges
    elevation: 5, // Adds depth with shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 18,
    color: "#888888", // Subtle gray for secondary text
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24, // Improves readability
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20, // Prevent content from touching edges
  },
  listItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listItemText: {
    fontSize: 16,
    color: "#333333", // Dark text for better contrast
    flex: 1,
    fontWeight: "500",
  },
  listItemSelected: {
    borderWidth: 2,
    borderColor: "#007AFF", // Highlight selected item
  },
  actionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonIcon: {
    fontSize: 24,
    color: "#ffffff",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  refreshControl: {
    tintColor: "#007AFF", // Matches primary color theme
  },
});

export default RoutesScreen;
