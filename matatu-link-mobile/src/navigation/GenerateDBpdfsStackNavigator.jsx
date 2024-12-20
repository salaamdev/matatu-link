import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

const ProfileReportsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileReportsStackNavigator;
