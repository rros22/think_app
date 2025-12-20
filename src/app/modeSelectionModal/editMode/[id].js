import { useLocalSearchParams, useRouter } from "expo-router";

import { StyleSheet } from "react-native";
import {
  AntIconButton,
  Pressable,
  Text,
  View,
} from "../../../components/Themed";
import { useColorScheme } from "../../../components/useColorScheme";
import Colors from "../../../constants/Colors";

const buttonSize = 40;

export default function EditMode() {
  const { id } = useLocalSearchParams();
  const modeId = Array.isArray(id) ? id[0] : id;

  const isEdit = modeId == "edit";

  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionSlot} />

        <Text style={styles.title}>
          {isEdit ? "Editar modo" : "Crear modo"}
        </Text>

        <AntIconButton size={40} onPress={() => router.back()} />
      </View>
      <View style={{ flex: 1 }}></View>
      <Pressable
        onPress={() => router.push("/appSelectionModal")}
        style={[styles.submitButton, { borderColor: textColor }]}
      >
        <Text style={[styles.meta, { fontWeight: "500" }]}>
          Seleccionar Apps
        </Text>
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
});
