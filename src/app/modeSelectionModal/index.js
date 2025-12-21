import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  Alert,
  Pressable as DefaultPressable,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  AntIconButton,
  Pressable,
  Text,
  useThemeColor,
  View,
} from "../../components/Themed";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

import { useAppStore } from "../../store/appConfigStore";

const buttonSize = 40;

const Item = ({ title, isSelected, onSelect, onEdit }) => (
  <DefaultPressable onPress={onSelect}>
    {({ pressed }) => (
      <View
        colorRole="card"
        style={[
          styles.item,
          {
            opacity: pressed ? 0.5 : isSelected ? 1 : 0.35,
          },
        ]}
      >
        <Text style={styles.subTitle}>{title}</Text>

        <DefaultPressable onPress={onEdit} hitSlop={10}>
          {({ pressed: editPressed }) => (
            <Text style={[styles.subTitle, { opacity: editPressed ? 0.4 : 1 }]}>
              Editar
            </Text>
          )}
        </DefaultPressable>
      </View>
    )}
  </DefaultPressable>
);

const Footer = ({ onCreate }) => {
  const iconColor = useThemeColor({}, "text");

  return (
    <Pressable colorRole="secondaryCard" style={styles.item} onPress={onCreate}>
      <Text style={styles.subTitle}>Crear modo</Text>
      <AntDesign name="plus" size={18} color={iconColor} />
    </Pressable>
  );
};

export default function ModeSelection() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();

  //obtain user defined modes in order from the store
  const modeOrder = useAppStore((state) => state.modeOrder);
  const modesById = useAppStore((state) => state.modesById);
  const maxModes = useAppStore((state) => state.maxModes);

  const canCreate = modeOrder.length < maxModes;

  //select which mode to activate
  const selectedModeId = useAppStore((state) => state.selectedModeId);
  const setSelectedModeId = useAppStore((state) => state.setSelectedModeId);

  const modes = useMemo(
    () => modeOrder.map((id) => modesById[id]).filter(Boolean),
    [modeOrder, modesById]
  );

  //Dynamics routs to the create mode or to edit a particular mode
  const onEdit = (id) => router.push(`/modeSelectionModal/editMode/${id}`);
  const onCreate = () => {
    if (!canCreate) {
      Alert.alert(
        "Límite alcanzado",
        `Solo puedes tener hasta ${maxModes} modos. Elimina uno para crear otro.`
      );
      return;
    }

    router.push("/modeSelectionModal/editMode/create");
  };

  //confimation handler
  const handleConfirmation = () => {
    //need to implement the logic
    router.back();
  };

  useEffect(() => {
    const name = selectedModeId ? modesById[selectedModeId]?.name : null;
    console.log(
      "[ModeSelection] selectedModeId:",
      selectedModeId,
      "name:",
      name
    );
  }, [selectedModeId, modesById]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionSlot} />

        <Text style={[styles.title]}>Seleccionar modo</Text>

        <AntIconButton size={40} onPress={() => router.back()} />
      </View>

      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={modes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item
            title={item.name}
            isSelected={item.id === selectedModeId}
            onSelect={() => {
              setSelectedModeId(item.id);
              router.back();
            }}
            onEdit={() => onEdit(item.id)}
          />
        )}
        ListFooterComponent={<Footer onCreate={onCreate} />}
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginVertical: 8,
    borderRadius: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "400",
  },

  subTitle: {
    fontSize: 16,
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
