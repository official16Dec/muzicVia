import { title } from 'process';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Background Image */}
      <ImageBackground
        source={require('../../assets/splash_background.png')} // Replace with your background image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/muzicvia_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
          </View>
          
          {/* Title */}
           <View style={styles.textContainer}>
              <Image
                source={require('../../assets/muzicvia_banner.png')}
                style={styles.title}
              />
           </View>
          
          
          {/* Notification Icon */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <View style={styles.notificationIcon}>
                <Image
                    source={require('../../assets/notification_icon.png')}
                    style={styles.notificationIcon}
                />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          {/* You can add your main dashboard content here */}
          <Text style={styles.welcomeText}>Welcome to MuzicVia</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  logoContainer: {
    flex: 0.2,
  },
  logo: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 0.6,
    alignItems: 'center'
  },
  title:{
    width: 180,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  notificationIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default DashboardScreen;