const tintColorLight = "#000000ff";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    textSecondary: "rgb(60, 60, 67)",
    separator: "rgb(60, 60, 67)",
    card: "#fff",
    background: "rgb(242, 242, 247)",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    textSecondary: "rgb(235, 235, 245)",
    separator: "rgb(84, 84, 88)",
    card: "#000",
    background: "rgb(28, 28, 30)",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
  blocked: {
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.75)",
    separator: "rgba(255,255,255,0.25)",
    card: "#8B0000", // dark red
    background: "#B00020", // material red tone
    tint: "#FFFFFF",
    tabIconDefault: "rgba(255,255,255,0.6)",
    tabIconSelected: "#FFFFFF",
  },
};
