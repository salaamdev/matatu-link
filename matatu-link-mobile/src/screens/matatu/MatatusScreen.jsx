import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatatusScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.placeholderText}>Matatus Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MatatusScreen;
