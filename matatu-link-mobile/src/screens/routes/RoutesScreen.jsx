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
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default RoutesScreen;
