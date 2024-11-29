// src/navigation/RoutesStackNavigator.jsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutesScreen from "../screens/routes/RoutesScreen";
import RouteDetailScreen from "../screens/routes/RouteDetailScreen";
import AddEditRouteScreen from "../screens/routes/AddEditRouteScreen";
import { useAuth } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const Stack = createNativeStackNavigator();

const RoutesStackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator initialRouteName="RoutesList">
      <Stack.Screen
        name="RoutesList"
        component={RoutesScreen}
        options={{ title: "Routes" }}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{ title: "Route Details" }}
      />
      <Stack.Screen
        name="AddEditRoute"
        component={AddEditRouteScreen}
        options={({ route }) => ({
          title: route.params?.isEdit ? "Edit Route" : "Add Route",
        })}
      />
    </Stack.Navigator>
  );
};

export default RoutesStackNavigator;
