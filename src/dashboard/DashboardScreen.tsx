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
  FlatList,
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
          <FlatList 
            data={persons}
            renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const persons = [
  {
	id: "1",
	name: "Earnest Green",
  },
  {
	id: "2",
	name: "Winston Orn",
  },
  {
	id: "3",
	name: "Carlton Collins",
  },
  {
	id: "4",
	name: "Malcolm Labadie",
  },
  {
	id: "5",
	name: "Michelle Dare",
  },
  {
	id: "6",
	name: "Carlton Zieme",
  },
  {
	id: "7",
	name: "Jessie Dickinson",
  },
  {
	id: "8",
	name: "Julian Gulgowski",
  },
  {
	id: "9",
	name: "Ellen Veum",
  },
  {
	id: "10",
	name: "Lorena Rice",
  },

  {
	id: "11",
	name: "Carlton Zieme",
  },
  {
	id: "12",
	name: "Jessie Dickinson",
  },
  {
	id: "13",
	name: "Julian Gulgowski",
  },
  {
	id: "14",
	name: "Ellen Veum",
  },
  {
	id: "15",
	name: "Lorena Rice",
  },
];

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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#0d0d2f5f'
  },
  logoContainer: {
    flex: 0.2,
  },
  logo: {
    width: 52,
    height: 52,
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
    height: 48,
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
  item: {
    padding: 20,
    fontSize: 20,
    marginTop: 5,
    color: '#fff',
  }
});

export default DashboardScreen;