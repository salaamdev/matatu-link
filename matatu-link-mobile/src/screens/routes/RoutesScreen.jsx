import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RoutesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Routes Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoutesScreen;
