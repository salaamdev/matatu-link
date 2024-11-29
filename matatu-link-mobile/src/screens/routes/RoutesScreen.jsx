// src/screens/routes/RoutesScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, FAB } from "react-native-paper";
import RouteItem from "./components/RouteItem";
import { getRoutes, deleteRoute } from "../../api/routes";
import { useAuth } from "../../contexts/AuthContext";

const RoutesScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

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
    navigation.navigate("RouteDetail", { routeId: route.route_id });
  };

  const handleDeleteRoute = (routeId) => {
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
              await deleteRoute(routeId);
              setRoutes(routes.filter((route) => route.route_id !== routeId));
              Alert.alert("Success", "Route deleted successfully.");
            } catch (error) {
              console.error("Error deleting route:", error.message);
              Alert.alert("Error", "Failed to delete route.");
            }
          },
        },
      ]
    );
  };

  const renderRouteItem = ({ item }) => (
    <RouteItem route={item} onPress={handleRoutePress} />
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
      {routes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Routes Available.</Text>
        </View>
      ) : (
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
          contentContainerStyle={
            routes.length === 0 && styles.flatListContainer
          }
        />
      )}

      {user?.userRole?.role_name === "admin" && (
        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={() => navigation.navigate("AddEditRoute", { isEdit: false })}
          label="Add Route"
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#34C759",
  },
});

export default RoutesScreen;
