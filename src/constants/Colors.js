const tintColorLight = "#000000ff";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    textSecondary: "rgba(72, 72, 80, 1)",
    separator: "rgb(60, 60, 67)",
    card: "#fff",

    // between background (242,242,247) and card (255,255,255)
    secondaryCard: "rgb(248, 248, 251)",

    background: "rgb(242, 242, 247)",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },

  dark: {
    text: "#fff",
    textSecondary: "rgba(175, 175, 183, 1)",
    separator: "rgb(84, 84, 88)",
    card: "#000",

    // between background (28,28,30) and card (0,0,0)
    secondaryCard: "rgba(16, 16, 18, 1)",

    background: "rgb(28, 28, 30)",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },

  blocked: {
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.75)",
    separator: "rgba(255,255,255,0.25)",
    card: "#8B0000",

    // between card (#8B0000) and background (#B00020)
    secondaryCard: "#9E0014",

    background: "#B00020",
    tint: "#FFFFFF",
    tabIconDefault: "rgba(255,255,255,0.6)",
    tabIconSelected: "#FFFFFF",
  },
};
