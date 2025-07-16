import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start animations
    const logoAnimation = Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    const textAnimation = Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    // Sequence animations
    Animated.sequence([
      Animated.delay(300),
      logoAnimation,
      Animated.delay(200),
      textAnimation,
      Animated.delay(1500), // Hold for 1.5 seconds
    ]).start(() => {
      // Animation complete callback
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Background Image */}
      <ImageBackground
        source={require('../../assets/splash_background.png')} // Replace with your background image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay for better contrast */}
        <View style={styles.overlay} />
        
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}>
            <Image
              source={require('../../assets/muzicvia_logo.png')} // Replace with your logo path
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}>
          <Image
              source={require('../../assets/muzicvia_banner.png')} // Replace with your logo path
              style={styles.banner}
            />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better text visibility
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: height * 0.1, // Adjust positioning as needed
    paddingTop: height * 0.1, // Adjust based on your design
  },
  logo: {
    width: 160,
    height: 160,
  },
  banner: {
    width: 200,
    height: 120,
  },
  textContainer: {
    position: 'absolute',
    bottom: height * 0.18, // Adjust positioning as needed
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF6B35', // Orange color for the text
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
});

export default SplashScreen;