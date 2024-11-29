// src/screens/FarePaymentScreen.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FarePaymentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fare Payment Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});
