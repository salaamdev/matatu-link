import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

const MatatusStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MatatusList" 
        component={MatatusListScreen}
        options={{ title: 'Matatus' }}
      />
    </Stack.Navigator>
  );
};

export default MatatusStackNavigator;
