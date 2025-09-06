import React, { useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const MaterialSwitch = ({ value, onValueChange, disabled = false }) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccccccff', '#ffd650ff'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      style={[materialSwitchStyles.container, disabled && materialSwitchStyles.disabled]}
    >
      <Animated.View style={[materialSwitchStyles.track, { backgroundColor }]}>
        <Animated.View style={[materialSwitchStyles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};


const materialSwitchStyles = StyleSheet.create({
  container: {
    padding: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default MaterialSwitch;