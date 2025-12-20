import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "../../components/Themed";

import { Text, View } from "../../components/Themed";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

const dividerOpacity = 0.5;

// test data
const DATA = [
  { id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba", title: "Dec 18" },
  { id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63", title: "Dec 19" },
  { id: "58694a0f-3da1-471f-bd96-145571e29d72", title: "Dec 20" },
  { id: "bd7acbea-c1b1-46c2-aed5-3a453abb28ba", title: "Dec 21" },
  { id: "3ac68afc-c605-48d3-a4f6-fbd91aa97f63", title: "Dec 22" },
  { id: "58634a0f-3da1-471f-bd96-145571e29d72", title: "Dec 23" },
];

const Item = (item) => {
  return (
    <View colorRole="card" style={styles.itemStyle}>
      <Text colorRole="textSecondary" style={styles.smallText}>
        {item.title}
      </Text>
      <Text style={styles.textLarge}>0h</Text>
      <Text colorRole="textSecondary" style={styles.textLarge}>
        0m
      </Text>
    </View>
  );
};

export default function StatsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const separatorColor = Colors[colorScheme].separator;
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerPartition}>
            <Text colorRole="textSecondary" style={styles.mediumText}>
              Hoy
            </Text>
            <Text style={styles.textGiant}>0:00</Text>
          </View>
          <View
            style={[
              styles.dividerVertical,
              {
                backgroundColor: separatorColor,
                opacity: dividerOpacity,
                height: "75%",
              },
            ]}
          />
          <View style={styles.headerPartition}>
            <Text colorRole="textSecondary" style={styles.mediumText}>
              Media
            </Text>
            <Text style={styles.textGiant}>0:00</Text>
          </View>
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
        {/* List of days and times in 3 column grid */}
        <FlatList
          style={{
            width: "100%",
            flex: 1,
          }}
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    padding: "5%",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 0,
  },
  headerPartition: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 5,
  },

  itemStyle: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderCurve: "continuous",
    gap: 10,
    margin: 5,
  },

  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    //marginHorizontal: -20,
  },
  dividerHorizontal: {
    height: StyleSheet.hairlineWidth,
  },
  textGiant: {
    fontSize: 50,
  },

  textLarge: {
    fontSize: 25,
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
