import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { CloseButton, Pressable, Text, View } from "../../components/Themed";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
const buttonSize = 40;

export default function ModeSelection() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionSlot} />
        <Text style={styles.title}>Seleccionar modo</Text>

        <CloseButton size={40} onPress={() => router.back()} />
      </View>
      <View style={{ flex: 1 }}></View>
      <Pressable style={[styles.submitButton, { borderColor: textColor }]}>
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
