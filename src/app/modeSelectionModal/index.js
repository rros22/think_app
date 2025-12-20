import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
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

const buttonSize = 40;

// test data
const DATA = [
  { id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba", title: "Estudio" },
  { id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63", title: "Familia" },
  { id: "58694a0f-3da1-471f-bd96-145571e29d72", title: "Trabajo" },
];

const Item = ({ title, onEdit }) => (
  <View colorRole="card" style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <DefaultPressable onPress={onEdit}>
      {({ pressed }) => (
        <Text style={[styles.title, { opacity: pressed ? 0.4 : 1 }]}>
          Editar
        </Text>
      )}
    </DefaultPressable>
  </View>
);

const Footer = ({ onCreate }) => {
  const iconColor = useThemeColor({}, "text");

  return (
    <Pressable colorRole="secondaryCard" style={styles.item} onPress={onCreate}>
      <Text style={styles.title}>Crear modo</Text>
      <AntDesign name="plus" size={18} color={iconColor} />
    </Pressable>
  );
};

export default function ModeSelection() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();

  const onEdit = () => router.push("/modeSelectionModal/editMode/edit");
  const onCreate = () => router.push("/modeSelectionModal/editMode/create");

  //confimation handler
  const handleConfirmation = () => {
    //need to implement the logic
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionSlot} />

        <Text style={[styles.title]}>Seleccionar modo</Text>

        <AntIconButton size={40} onPress={() => router.back()} />
      </View>

      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item title={item.title} onEdit={() => onEdit(item.id)} />
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
