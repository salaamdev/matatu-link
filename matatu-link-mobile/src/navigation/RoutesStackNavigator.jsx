import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

const RoutesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Routes" 
        component={RoutesScreen}
        options={{ title: 'Routes' }}
      />
    </Stack.Navigator>
  );
};

export default RoutesStackNavigator;
