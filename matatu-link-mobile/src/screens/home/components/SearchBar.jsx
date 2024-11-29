// src/screens/home/components/SearchBar.jsx

import React from "react";
import { StyleSheet } from "react-native";
import { SearchBar as RNEUISearchBar } from "@rneui/themed";

const SearchBar = ({ searchQuery, setSearchQuery, onSubmit }) => {
  return (
    <RNEUISearchBar
      placeholder="Where to?"
      onChangeText={setSearchQuery}
      value={searchQuery}
      onSubmitEditing={onSubmit}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      lightTheme
      round
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    position: "absolute",
    top: 40,
    width: "90%",
    alignSelf: "center",
    zIndex: 1,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    height: 50,
  },
});

export default SearchBar;
