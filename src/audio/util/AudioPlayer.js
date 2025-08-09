import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  Image
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: audioPlayerWidth } = Dimensions.get('window');

const AudioPlayer = ({ audioPath }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const progressInterval = React.useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    requestPermissions();

    if (audioPath) {
      loadAudio(audioPath);
    }

    return () => {
      if (sound) {
        sound.release();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [audioPath]);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (result !== RESULTS.GRANTED) {
          Alert.alert('Permission required', 'Storage permission is required to play audio files');
        }
      } else {
        console.log('iOS - no storage permission required');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const loadAudio = (path) => {
    if (sound) {
      sound.release();
    }

    setIsLoading(true);

    const newSound = new Sound(path, '', (error) => {
      setIsLoading(false);
      if (error) {
        console.error('Failed to load sound:', error);
        Alert.alert('Error', 'Failed to load audio file');
        return;
      }
      setSound(newSound);
      setDuration(newSound.getDuration());
    });
  };

  const playPause = () => {
    if (!sound) {
      loadAudio(audioPath);
      return;
    }

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
      clearInterval(progressInterval.current);
    } else {
      sound.play((success) => {
        if (success) {
          console.log('Playback finished successfully');
        } else {
          console.log('Playback failed');
          Alert.alert('Error', 'Playback failed');
        }
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(progressInterval.current);
      });
      setIsPlaying(true);
      startProgressTracking();
    }
  };

  const stop = () => {
    if (sound) {
      sound.stop();
      setIsPlaying(false);
      setCurrentTime(0);
      clearInterval(progressInterval.current);
    }
  };

  const seek = (value) => {
    if (sound && !isSeeking) {
      setIsSeeking(true);
      sound.setCurrentTime(value);
      setCurrentTime(value);
      setTimeout(() => {
        setIsSeeking(false);
      }, 100);
    }
  };

  const startProgressTracking = () => {
    progressInterval.current = setInterval(() => {
      if (sound && isPlaying && !isSeeking) {
        sound.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }
    }, 1000);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSliderValue = () => {
    return duration > 0 ? (currentTime / duration) : 0;
  };

  return (
    <View style={audioPlayerStyles.container}>
      <View style={audioPlayerStyles.thumbnailContainer}>
        <Image
          source={require('../../../assets/muzicvia_logo.png')}
          style={audioPlayerStyles.thumbnail}
          resizeMode="contain"
        />
      </View>
      <View style={audioPlayerStyles.playerContainer}>
        <View style={audioPlayerStyles.infoContainer}>
          <Text style={audioPlayerStyles.subtitle} numberOfLines={1}>
            {audioPath ? audioPath.split('/').pop() : 'No file selected'}
          </Text>
        </View>
        <View style={audioPlayerStyles.progressContainer}>
          <Text style={audioPlayerStyles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={audioPlayerStyles.slider}
            minimumValue={0}
            maximumValue={1}
            value={getSliderValue()}
            onSlidingStart={() => setIsSeeking(true)}
            onSlidingComplete={(value) => {
              const seekTime = value * duration;
              seek(seekTime);
            }}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#E0E0E0"
            thumbStyle={audioPlayerStyles.sliderThumb}
            trackStyle={audioPlayerStyles.sliderTrack}
          />
          <Text style={audioPlayerStyles.timeText}>{formatTime(duration)}</Text>
        </View>
        <View style={audioPlayerStyles.controlsContainer}>
          <TouchableOpacity
            style={audioPlayerStyles.controlButton}
            onPress={stop}
            disabled={!sound || isLoading}
          >
            <Icon name="stop" size={30} color={!sound || isLoading ? '#CCC' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[audioPlayerStyles.controlButton, audioPlayerStyles.playButton]}
            onPress={playPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icon name="hourglass-empty" size={40} color="#FFF" />
            ) : (
              <Icon
                name={isPlaying ? "pause" : "play-arrow"}
                size={40}
                color="#FFF"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={audioPlayerStyles.controlButton}
            onPress={() => {
              if (sound) {
                const newTime = Math.min(currentTime + 10, duration);
                seek(newTime);
              }
            }}
            disabled={!sound || isLoading}
          >
            <Icon name="forward-10" size={30} color={!sound || isLoading ? '#CCC' : '#333'} />
          </TouchableOpacity>
        </View>
        {!sound && (
          <TouchableOpacity style={audioPlayerStyles.loadButton} onPress={() => loadAudio(audioPath)}>
            <Text style={audioPlayerStyles.loadButtonText}>Load Audio</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const audioPlayerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  playerContainer: {
    borderRadius: 15,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    minWidth: 45,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#007AFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
  },
  loadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  loadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  thumbnailContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 120,
    height: 120,
  },
});

export default AudioPlayer;