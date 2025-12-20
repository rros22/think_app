import { useRouter } from "expo-router";
import React from "react";
import { Animated, StyleSheet, Switch } from "react-native";

import { SafeAreaView } from "../../components/Themed";

import CustomList from "../../components/CustomList";
import {
  AnimatedText,
  AntIconButton,
  Pressable,
  Text,
  View,
} from "../../components/Themed";

import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

// Delay + fast fade tuning
const SHOW_AFTER_Y = 25; // stay invisible for this many px AFTER the list header starts scrolling away
const FADE_DISTANCE = 20; // fade-in happens over this many px (smaller = faster)

// test data
const DATA = [
  { id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba", title: "Week" },
  { id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63", title: "Weekend" },
  { id: "58694a0f-3da1-471f-bd96-145571e29d72", title: "Night out" },
];

const Footer = () => <View />;

const Item = ({ title, onEdit }) => (
  <Pressable colorRole="card" style={styles.item} onPress={onEdit}>
    <View colorRole="card" style={{ flexDirection: "column" }}>
      <Text style={[styles.mediumText, { marginBottom: 10 }]}>{title}</Text>
      <Text
        colorRole="textSecondary"
        style={[styles.smallText, { marginBottom: 3 }]}
      >
        14:49 - Sun
      </Text>
      <Text colorRole="textSecondary" style={styles.smallText}>
        Deep Work
      </Text>
    </View>
    <View colorRole="card">
      <Switch />
    </View>
  </Pressable>
);

export default function ScheduleScreen() {
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
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AnimatedText style={[styles.title, { opacity: titleOpacity }]}>
            Seleccionar rutina
          </AnimatedText>
        </View>
        <CustomList
          data={DATA}
          title="Rutinas"
          scrollY={scrollY}
          onEdit={(id) => router.push("/modeSelectionModal/createSchedule")}
          onCreate={() => router.push()}
          ItemComponent={Item}
          FooterComponent={Footer}
        />
        <Text
          colorRole="textSecondary"
          style={[styles.mediumText, { marginVertical: 20 }]}
        >
          Crear nueva rutina
        </Text>
        <AntIconButton
          size={60}
          iconName="plus"
          onPress={() => router.push("/modeSelectionModal/createSchedule")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: "5%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 8,
    marginHorizontal: "3%",
    borderRadius: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "400",
  },

  mediumText: {
    fontSize: 14,
    fontWeight: "500",
  },
  smallText: {
    fontSize: 12,
    fontWeight: "400",
  },
});
