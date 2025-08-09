import React from 'react';
import { View, StatusBar, TouchableOpacity, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import AudioPlayer from './util/AudioPlayer';
import { useNavigation } from '@react-navigation/native';

type AudioScreenProps = {
  route: {
    params: {
      audioUri: string;
      title: string;
    };
  };
};

const AudioScreen: React.FC<AudioScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { audioUri, title } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
          source={require('../../assets/splash_background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/muzicvia_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Image
                source={require('../../assets/muzicvia_banner.png')}
                style={styles.title}
              />
            </View>
            <View style={styles.logoContainer}>
              
            </View>
          </View>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>{''}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          </View>
          <AudioPlayer audioPath={audioUri} />
      </ImageBackground>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#0d0d2f5f',
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  logoContainer: {
    flex: 0.2,
  },
  logo: {
    width: 52,
    height: 52,
  },
  textContainer: {
    flex: 0.6,
    alignItems: 'center',
  },
  title: {
    width: 180,
    height: 48,
  },
});

export default AudioScreen;