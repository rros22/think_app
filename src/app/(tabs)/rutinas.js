import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { AntIconButton, View } from "../../components/Themed";

export default function ScheduleScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <AntIconButton
        size={40}
        iconName="plus"
        onPress={() => router.push("/modeSelectionModal/createSchedule")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
