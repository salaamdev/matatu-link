// src/screens/home/HomeScreen.jsx

import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapViewComponent from './components/MapViewComponent';
import SearchBar from './components/SearchBar';
import RouteSuggestionBox from '../../components/common/RouteSuggestionBox';
import { getRouteInfo } from '../../api/openai';

const HomeScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    
    try {
      // Get route info from OpenAI
      const info = await getRouteInfo(
        'Nairobi CBD', // You could use user's current location
        location.title
      );
      setRouteInfo(info);
    } catch (error) {
      console.error('Failed to get route info:', error);
      // Handle error (show alert, etc.)
    }
  };

  return (
    <View style={styles.container}>
      <MapViewComponent selectedLocation={selectedLocation} ref={mapRef} />
      <SearchBar onLocationSelect={handleLocationSelect} />
      <RouteSuggestionBox 
        routeInfo={routeInfo} 
        onClose={() => setRouteInfo(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
