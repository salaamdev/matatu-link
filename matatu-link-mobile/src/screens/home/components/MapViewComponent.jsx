// src/screens/home/components/MapViewComponent.jsx

import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapViewComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [matatuLocations, setMatatuLocations] = useState([]); // Replace with real data fetching

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // TODO: Fetch Matatu locations from your backend
      // For demonstration, we'll use mock data
      setMatatuLocations([
        {
          id: 1,
          latitude: loc.coords.latitude + 0.001,
          longitude: loc.coords.longitude + 0.001,
          title: "Matatu 1",
        },
        {
          id: 2,
          latitude: loc.coords.latitude - 0.0015,
          longitude: loc.coords.longitude - 0.0012,
          title: "Matatu 2",
        },
      ]);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
    >
      {matatuLocations.map((matatu) => (
        <Marker
          key={matatu.id}
          coordinate={{
            latitude: matatu.latitude,
            longitude: matatu.longitude,
          }}
          title={matatu.title}
          description="Matatu Location"
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapViewComponent;
