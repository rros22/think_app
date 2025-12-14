// src/components/AnimatedDeviceContour.js
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { DeviceContour } from "./Themed";

export const AnimatedDeviceContour = ({
  width,
  height,
  onPressIn,
  onPressOut,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    if (onPressIn) onPressIn(); // Allow for custom behavior
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    if (onPressOut) onPressOut(); // Allow for custom behavior
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <DeviceContour width={width} height={height} />
      </Animated.View>
    </Pressable>
  );
};
