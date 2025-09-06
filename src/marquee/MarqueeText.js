import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const MarqueeText = ({ text, style, duration = 15000 }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset position to the start
      scrollAnim.setValue(0);
      
      // Animate from 0 to -1 (representing the full scroll)
      Animated.timing(scrollAnim, {
        toValue: -1,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        // After one full scroll, restart the animation
        startAnimation();
      });
    };

    startAnimation();
  }, [scrollAnim, duration]);

  // We use a measure function to get the width of the text dynamically
  const [textWidth, setTextWidth] = React.useState(0);
  const onTextLayout = (event) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  // The output range is based on the text width
  const scrollX = scrollAnim.interpolate({
    inputRange: [-1, 0],
    outputRange: [-(textWidth), 0],
  });

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={{ transform: [{ translateX: scrollX }] }}>
        <Text onLayout={onTextLayout} numberOfLines={1} style={[styles.text, style]}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  marqueeContainer: {
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  text: {
    paddingHorizontal: 5, // A little spacing at the start
  },
});

export default MarqueeText;