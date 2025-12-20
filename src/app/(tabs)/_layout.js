import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

import LogoSVG from "../../icons/logoSVG";
import ScheduleSVG from "../../icons/scheduleSVG";
import SettingsSVG from "../../icons/settingsSVG";
import StatsSVG from "../../icons/statsSVG";
import { useConfigStore } from "../../store/configStore";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isBlocked = useConfigStore((s) => s.isBlocked);

  const theme = isBlocked ? "blocked" : colorScheme;

  return (
    <Tabs
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        animation: "fade",

        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,

        // These two make the actual bar match the blocked palette
        tabBarStyle: {
          //height: 72,
          backgroundColor: Colors[theme].card,
          borderTopColor: Colors[theme].separator,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "think.",
          tabBarIcon: ({ color, size }) => (
            <LogoSVG color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rutinas"
        options={{
          title: "Rutinas",
          tabBarIcon: ({ color, size }) => (
            <ScheduleSVG color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="estadísticas"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => (
            <StatsSVG color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <SettingsSVG color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
