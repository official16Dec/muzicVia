import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import SplashScreen from './splash/SplashScreen';
import DashboardScreen from './dashboard/DashboardScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    console.log('Splash animation complete');
    setShowSplash(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {showSplash ? (
        <SplashScreen onAnimationComplete={handleSplashComplete} />
      ) : (
        <DashboardScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
