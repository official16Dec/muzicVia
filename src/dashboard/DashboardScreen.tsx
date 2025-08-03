import React, { useState, useEffect } from 'react';
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
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
  type MusicFile = {
    id: string;
    name: string;
    path: string;
    size: number;
    extension: string;
  };

  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const androidVersion = Platform.Version;
        
        if (androidVersion >= 33) {
          // Android 13+ (API 33+) - Request READ_MEDIA_AUDIO
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
            {
              title: 'Audio Files Permission',
              message: 'App needs access to your audio files to play music',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
            scanForMusicFiles();
          } else {
            setHasPermission(false);
            setLoading(false);
            Alert.alert('Permission Denied', 'Audio files permission is required to access music files.');
          }
        } else if (androidVersion >= 30) {
          // Android 11+ (API 30+) - Request MANAGE_EXTERNAL_STORAGE for full access
          try {
            const manageGranted = await PermissionsAndroid.request(
              'android.permission.MANAGE_EXTERNAL_STORAGE',
              {
                title: 'Storage Management Permission',
                message: 'App needs full storage access to read music files from all directories',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            
            if (manageGranted === PermissionsAndroid.RESULTS.GRANTED) {
              setHasPermission(true);
              scanForMusicFiles();
            } else {
              // Fall back to READ_EXTERNAL_STORAGE for limited access
              const readGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                  title: 'Storage Permission',
                  message: 'App needs access to your storage to read music files',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
              
              if (readGranted === PermissionsAndroid.RESULTS.GRANTED) {
                setHasPermission(true);
                scanForMusicFiles();
              } else {
                setHasPermission(false);
                setLoading(false);
                Alert.alert('Permission Denied', 'Storage permission is required to access music files.');
              }
            }
          } catch (error) {
            console.log('MANAGE_EXTERNAL_STORAGE not available, falling back to READ_EXTERNAL_STORAGE');
            const readGranted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission',
                message: 'App needs access to your storage to read music files',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            
            if (readGranted === PermissionsAndroid.RESULTS.GRANTED) {
              setHasPermission(true);
              scanForMusicFiles();
            } else {
              setHasPermission(false);
              setLoading(false);
              Alert.alert('Permission Denied', 'Storage permission is required to access music files.');
            }
          }
        } else {
          // Android 10 and below - Use READ_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to read music files',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
            scanForMusicFiles();
          } else {
            setHasPermission(false);
            setLoading(false);
            Alert.alert('Permission Denied', 'Storage permission is required to access music files.');
          }
        }
      } else {
        // iOS permission handling
        const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
        if (result === RESULTS.GRANTED) {
          setHasPermission(true);
          scanForMusicFiles();
        } else {
          setHasPermission(false);
          setLoading(false);
          Alert.alert('Permission Denied', 'Media library permission is required to access music files.');
        }
      }
    } catch (error) {
      console.error('Permission request error:', error);
      setLoading(false);
    }
  };

  const scanForMusicFiles = async () => {
    try {
      setLoading(true);
      const musicExtensions = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg'];
      const musicFiles = [];

      // Get Android version to determine scanning approach
      const androidVersion = Platform.OS === 'android' ? Platform.Version : 0;

      let musicDirectories = [];

      if (Platform.OS === 'android' && androidVersion >= 30) {
        // Android 11+ (API 30+) - Use scoped storage paths
        musicDirectories = [
          RNFS.ExternalStorageDirectoryPath + '/Music',
          RNFS.ExternalStorageDirectoryPath + '/Download',
          RNFS.ExternalStorageDirectoryPath + '/Downloads',
          RNFS.DocumentDirectoryPath,
          // Add app-specific external storage
          RNFS.ExternalDirectoryPath,
          // Common user accessible directories
          '/storage/emulated/0/Music',
          '/storage/emulated/0/Download',
          '/storage/emulated/0/Downloads',
        ];
      } else {
        // Android 10 and below, or iOS
        musicDirectories = [
          RNFS.ExternalStorageDirectoryPath + '/Music',
          RNFS.ExternalStorageDirectoryPath + '/Download',
          RNFS.ExternalStorageDirectoryPath + '/Downloads',
          RNFS.DocumentDirectoryPath,
        ];
      }

      for (const directory of musicDirectories) {
        try {
          const exists = await RNFS.exists(directory);
          if (exists) {
            await scanDirectory(directory, musicFiles, musicExtensions);
          }
        } catch (error) {
          console.log(`Error scanning directory ${directory}:`, error);
        }
      }

      // For Android 11+, also try to scan using MediaStore-like approach
      if (Platform.OS === 'android' && androidVersion >= 30 && musicFiles.length === 0) {
        await scanUsingAlternativeMethod(musicFiles, musicExtensions);
      }

      // Remove duplicates based on file path
      const uniqueMusicFiles = musicFiles.filter((file, index, self) =>
        index === self.findIndex(f => f.path === file.path)
      );

      setMusicFiles(uniqueMusicFiles);
    } catch (error) {
      console.error('Error scanning music files:', error);
      Alert.alert('Error', 'Failed to scan music files from storage.');
    } finally {
      setLoading(false);
    }
  };

  const scanUsingAlternativeMethod = async (musicFiles: any[], extensions: string | string[]) => {
    try {
      // Try to scan the root external storage with limited depth
      const rootPath = '/storage/emulated/0';
      const commonFolders = ['Music', 'Download', 'Downloads', 'AudioBooks', 'Podcasts'];
      
      for (const folder of commonFolders) {
        const folderPath = `${rootPath}/${folder}`;
        try {
          const exists = await RNFS.exists(folderPath);
          if (exists) {
            await scanDirectory(folderPath, musicFiles, extensions, 2); // Limit depth to 2
          }
        } catch (error) {
          console.log(`Error scanning ${folderPath}:`, error);
        }
      }
    } catch (error) {
      console.log('Alternative scanning method failed:', error);
    }
  };


  const scanDirectory = async (directory: string, musicFiles: any[], extensions: string | string[], maxDepth = 3, currentDepth = 0) => {
    try {
      // Prevent infinite recursion and limit scanning depth
      if (currentDepth >= maxDepth) {
        return;
      }

      const files = await RNFS.readDir(directory);
      
      for (const file of files) {
        if (file.isDirectory()) {
          // Recursively scan subdirectories with depth limit
          await scanDirectory(file.path, musicFiles, extensions, maxDepth, currentDepth + 1);
        } else {
          // Check if file has music extension
          const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
          if (extensions.includes(fileExtension)) {
            musicFiles.push({
              id: file.path,
              name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
              path: file.path,
              size: file.size,
              extension: fileExtension,
            });
          }
        }
      }
    } catch (error) {
      console.log(`Error reading directory ${directory}:`, error);
    }
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleMusicPress = (musicItem: { name: any; }) => {
    console.log('Music pressed:', musicItem.name);
    // Here you can implement music playback functionality
    Alert.alert('Music Selected', `Selected: ${musicItem.name}`);
  };

  const handleRefresh = () => {
    if (hasPermission) {
      scanForMusicFiles();
    } else {
      requestStoragePermission();
    }
  };

  const renderMusicItem = ({ item }: { item: MusicFile }) => (
    <TouchableOpacity 
      style={styles.musicItem}
      onPress={() => handleMusicPress(item)}
    >
      <View style={styles.musicItemContent}>
        <Image
          source={require('../../assets/muzicvia_logo.png')} // Add a music icon to your assets
          style={styles.musicIcon}
          defaultSource={require('../../assets/muzicvia_logo.png')}
        />
        <View style={styles.musicInfo}>
          <Text style={styles.musicName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.musicDetails}>
            {item.extension.toUpperCase()} • {(item.size / (1024 * 1024)).toFixed(2)} MB
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={require('../../assets/muzicvia_logo.png')} // Add a "no music" icon to your assets
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>No Music Files Found</Text>
      <Text style={styles.emptySubtext}>
        {!hasPermission 
          ? 'Please grant storage permission to access your music files.'
          : 'No music files were found in your device storage.'
        }
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>
          {!hasPermission ? 'Grant Permission' : 'Refresh'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <ImageBackground
        source={require('../../assets/splash_background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Header */}
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
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Image
              source={require('../../assets/notification_icon.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Scanning music files...</Text>
            </View>
          ) : musicFiles.length > 0 ? (
            <FlatList 
              data={musicFiles}
              renderItem={renderMusicItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderEmptyState()
          )}
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
  },
  textContainer: {
    flex: 0.6,
    alignItems: 'center'
  },
  title: {
    width: 180,
    height: 48,
  },
  notificationButton: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  notificationIcon: {
    width: 35,
    height: 35,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  musicItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  musicItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  musicInfo: {
    flex: 1,
  },
  musicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  musicDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    opacity: 0.8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    opacity: 0.6,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;