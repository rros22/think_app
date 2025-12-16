import { useRouter } from "expo-router";
import React from "react";
import { Animated, StyleSheet } from "react-native";
import CustomList from "../../components/CustomList";
import {
  AnimatedText,
  CloseButton,
  Pressable,
  Text,
  View,
} from "../../components/Themed";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

const buttonSize = 40;

// Delay + fast fade tuning
const SHOW_AFTER_Y = 25; // stay invisible for this many px AFTER the list header starts scrolling away
const FADE_DISTANCE = 20; // fade-in happens over this many px (smaller = faster)

// test data
const DATA = [
  { id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba", title: "Estudio" },
  { id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63", title: "Familia" },
  { id: "58694a0f-3da1-471f-bd96-145571e29d72", title: "Trabajo" },
];

export default function ModeSelection() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();

  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Compute thresholds INSIDE the component (because listHeaderHeight is state)
  const start = Math.max(0, SHOW_AFTER_Y);
  const end = start + FADE_DISTANCE;

  // Invisible at first, then quick fade after the delay distance is covered
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, start, end],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  //confimation handler
  const handleConfirmation = () => {
    //need to implement the logic
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionSlot} />

        <AnimatedText style={[styles.title, { opacity: titleOpacity }]}>
          Seleccionar modo
        </AnimatedText>

        <CloseButton size={40} onPress={() => router.back()} />
      </View>

      <CustomList
        data={DATA}
        title="Seleccionar Modo"
        scrollY={scrollY}
        onEdit={(id) => router.push("/modeSelectionModal/editMode")}
        onCreate={() => router.push("/modeSelectionModal/createMode")}
      />

      <Pressable
        onPress={handleConfirmation}
        style={[styles.submitButton, { borderColor: textColor }]}
      >
        <Text style={[styles.meta, { fontWeight: "500" }]}>Confirmar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: "5%",
  },

  actionSlot: {
    width: buttonSize,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "400",
  },

  submitButton: {
    padding: "6%",
    borderRadius: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
  },

  meta: {
    fontSize: 12,
    fontWeight: "400",
  },
});
