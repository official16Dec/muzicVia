import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text} from 'react-native';
import DashboardScreen from './dashboard/DashboardScreen';
import SplashScreen from './splash/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AudioScreen from './audio/AudioScreen';

const Stack = createStackNavigator();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DashboardScreen"
        screenOptions={{
          headerShown: false, // Hide the header by default
        }}
      >
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="AudioScreen" component={AudioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;