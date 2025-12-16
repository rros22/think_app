import { AntDesign } from "@expo/vector-icons";
import {
  Animated,
  Pressable as DefaultPressable,
  StyleSheet,
} from "react-native";

import { Pressable, Text, useThemeColor, View } from "./Themed";

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

const Header = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const Footer = ({ onCreate }) => {
  const iconColor = useThemeColor({}, "text");

  return (
    <Pressable
      colorRole="card"
      style={[styles.item, { borderWidth: 1, borderColor: iconColor }]}
      onPress={onCreate}
    >
      <Text style={styles.title}>Crear modo</Text>
      <AntDesign name="plus" size={18} color={iconColor} />
    </Pressable>
  );
};

export default function CustomList({
  data,
  title = "Seleccionar Modo",
  FooterComponent = Footer, // default footer component
  onEdit,
  onCreate,
  style,
  scrollY,
}) {
  return (
    <Animated.FlatList
      style={[{ width: "100%" }, style]}
      data={data}
      renderItem={({ item }) => (
        <Item title={item.title} onEdit={() => onEdit(item.id)} />
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Header title={title} />}
      ListFooterComponent={<FooterComponent onCreate={onCreate} />}
      onScroll={
        scrollY
          ? Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )
          : undefined
      }
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "400",
  },
  headerText: {
    fontSize: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginVertical: 8,
    marginHorizontal: "3%",
    borderRadius: 15,
  },
});
