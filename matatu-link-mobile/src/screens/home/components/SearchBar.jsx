// src/screens/home/components/SearchBar.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { TextInput, List } from "react-native-paper";
import axios from "axios";
import debounce from "lodash.debounce";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const cache = useRef({}); // Initialize a cache object
  const [error, setError] = useState(null);

  // Debounced function to fetch predictions
  const fetchPredictions = debounce(async (searchTerm) => {
    if (searchTerm.length < 3) {
      setPredictions([]);
      return;
    }

    // Check if the query exists in the cache
    if (cache.current[searchTerm]) {
      setPredictions(cache.current[searchTerm]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(NOMINATIM_BASE_URL, {
        params: {
          q: searchTerm,
          format: "json",
          addressdetails: 1,
          limit: 5, // Limit to top 5 suggestions
          countrycodes: "ke",
        },
        headers: {
          "Accept-Language": "en",
          "User-Agent": "Matatu-Link-App/1.0" // Add user agent
        },
      });

      setPredictions(response.data);
      // Store the results in the cache
      cache.current[searchTerm] = response.data;
    } catch (error) {
      console.error("Error fetching predictions:", error.message);
      setError("Failed to fetch location suggestions");
      setPredictions([]);
      // Optionally, handle errors (e.g., show a message to the user)
    } finally {
      setLoading(false);
    }
  }, 500); // Debounce delay of 500ms

  useEffect(() => {
    fetchPredictions(query);

    // Cleanup the debounce on unmount
    return () => {
      fetchPredictions.cancel();
    };
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setPredictions([]);
    if (onLocationSelect) {
      onLocationSelect({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        title: item.display_name,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Where to?"
        value={query}
        onChangeText={(text) => setQuery(text)}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="map-search" />}
      />

      {loading && (
        <ActivityIndicator
          style={styles.loading}
          size="small"
          color="#007AFF"
        />
      )}
      {predictions.length > 0 && (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <List.Item
                title={item.display_name}
                left={() => <List.Icon icon="map-marker" />}
                titleNumberOfLines={2}
              />
            </TouchableOpacity>
          )}
          style={styles.predictionsContainer}
        />
      )}
      {!loading && query.length >= 3 && predictions.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found.</Text>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Positioning the search bar
    position: "absolute",
    top: 40,
    width: "90%",
    alignSelf: "center",
    zIndex: 2, // Ensure it appears above the map
  },
  input: {
    backgroundColor: "#ffffff",
  },
  predictionsContainer: {
    backgroundColor: "#ffffff",
    maxHeight: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  noResultsContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  noResultsText: {
    color: "#666666",
    textAlign: "center",
  },
  loading: {
    position: "absolute",
    right: 20,
    top: 50,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default SearchBar;
