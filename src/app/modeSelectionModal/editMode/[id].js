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
const dividerOpacity = 0.5;

export default function EditMode() {
  const { id } = useLocalSearchParams();
  const modeId = Array.isArray(id) ? id[0] : id;
  const isEdit = modeId == "edit";
  const colorScheme = useColorScheme();
  const separatorColor = Colors[colorScheme].separator;
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.actionSlot} />

        <Text style={styles.title}>
          {isEdit ? "Editar modo" : "Crear modo"}
        </Text>

        <AntIconButton size={40} onPress={() => router.back()} />
      </View>
      {/* Main content */}
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          colorRole="card"
          style={{
            width: "100%",
            paddingVertical: 30,
            paddingHorizontal: 20,
            borderRadius: 20,
            gap: 30,
            borderCurve: "continuous",
          }}
        >
          <View
            colorRole="card"
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.mediumText, { opacity: 0.5 }]}>Name</Text>
            <Text style={[styles.mediumText, { opacity: 0.2 }]}>
              ej. Trabajo, Familia
            </Text>
          </View>

          {/* Separator */}
          <View
            style={[
              styles.dividerHorizontal,
              {
                backgroundColor: separatorColor,
                opacity: dividerOpacity,
                width: "100%",
              },
            ]}
          />

          <Pressable
            colorRole="card"
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/appSelectionModal")}
          >
            <Text style={[styles.mediumText, { opacity: 0.5 }]}>
              Bloqueando
            </Text>
            <Text style={[styles.mediumText, { opacity: 0.2 }]}>5/50</Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        onPress={() => router.back()}
        style={[styles.submitButton, { borderColor: textColor }]}
      >
        <Text style={styles.mediumText}>Guardar ajustes</Text>
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

  dividerHorizontal: {
    height: StyleSheet.hairlineWidth,
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

  mediumText: {
    fontSize: 14,
    fontWeight: "500",
  },

  smallText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
