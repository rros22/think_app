// src/components/AnimatedDeviceContour.js
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { DeviceContour } from "./Themed";

export const AnimatedDeviceContour = ({
  width,
  height,
  onPressIn,
  onPressOut,
  onLongPress,
  delayLongPress = 800, // sensible default
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    onPressIn?.();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    onPressOut?.();
  };

  const handleLongPress = () => {
    // This is the "activate after hold" callback
    onLongPress?.();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      delayLongPress={delayLongPress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <DeviceContour width={width} height={height} />
      </Animated.View>
    </Pressable>
  );
};
