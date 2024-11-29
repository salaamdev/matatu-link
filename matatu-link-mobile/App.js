// App.js
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper'; // Import PaperProvider

export default function App () {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider> {/* Wrap with PaperProvider */}
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
