// src/screens/home/HomeScreen.jsx

import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapViewComponent from './components/MapViewComponent';
import SearchBar from './components/SearchBar';

const HomeScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // The MapViewComponent handles animating to the selected location
  };

  return (
    <View style={styles.container}>
      <MapViewComponent selectedLocation={selectedLocation} ref={mapRef} />
      <SearchBar onLocationSelect={handleLocationSelect} />
      {/* Additional UI components can be added here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
