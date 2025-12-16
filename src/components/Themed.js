/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Pressable as DefaultPressable,
  ScrollView as DefaultScrollView,
  Text as DefaultText,
  View as DefaultView,
} from "react-native";

import { Animated } from "react-native";

const AnimatedDefaultText = Animated.createAnimatedComponent(DefaultText);

import FullLogo from "../icons/fullLogoSVG";
import LogoSVG from "../icons/logoSVG";
import ScheduleSVG from "../icons/scheduleSVG";
import SettingsSVG from "../icons/settingsSVG";
import StatsSVG from "../icons/statsSVG";

import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView as DefaultSafeAreaView } from "react-native-safe-area-context";

import Colors from "../constants/Colors";
import { useColorScheme } from "./useColorScheme";

export function useThemeColor(props, colorName) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props?.[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function AnimatedText(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return <AnimatedDefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "background",
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Pressable(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "card",
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <DefaultPressable
      {...otherProps}
      style={({ pressed }) => {
        const resolvedStyle =
          typeof style === "function" ? style({ pressed }) : style;

        return [
          { backgroundColor, opacity: pressed ? 0.85 : 1 },
          resolvedStyle,
        ];
      }}
    />
  );
}

export function ScrollView(props) {
  const {
    style,
    contentContainerStyle,
    lightColor,
    darkColor,
    colorRole = "background",
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <DefaultScrollView
      style={[{ backgroundColor }, style]}
      contentContainerStyle={contentContainerStyle}
      {...otherProps}
    />
  );
}

export function SafeAreaView(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "background",
    edges = ["top"],
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <DefaultSafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export function DeviceContour(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    width = 220,
    height = 220,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <FullLogo
      color={color}
      width={width}
      height={height}
      style={style}
      {...otherProps}
    />
  );
}

export function StatsIcon(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    width = 220,
    height = 220,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <StatsSVG
      color={color}
      width={width}
      height={height}
      style={style}
      {...otherProps}
    />
  );
}

export function ScheduleIcon(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    width = 220,
    height = 220,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <ScheduleSVG
      color={color}
      width={width}
      height={height}
      style={style}
      {...otherProps}
    />
  );
}

export function LogoIcon(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    width = 220,
    height = 220,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <LogoSVG
      color={color}
      width={width}
      height={height}
      style={style}
      {...otherProps}
    />
  );
}

export function SettingsIcon(props) {
  const {
    style,
    lightColor,
    darkColor,
    colorRole = "text",
    width = 220,
    height = 220,
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  return (
    <SettingsSVG
      color={color}
      width={width}
      height={height}
      style={style}
      {...otherProps}
    />
  );
}
export function CloseButton(props) {
  const {
    style,
    colorRole = "card", // background fill role
    lightColor,
    darkColor,
    size = 40,
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorRole
  );

  // Icon color should follow theme "text" (or override via lightColor/darkColor if you pass them for text specifically)
  const iconColor = useThemeColor({}, "text");

  return (
    <DefaultPressable
      {...otherProps}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <AntDesign name="close" size={size / 3} color={iconColor} />
    </DefaultPressable>
  );
}
