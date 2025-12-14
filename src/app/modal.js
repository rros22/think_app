import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet } from "react-native";

import { useRouter } from "expo-router";
import * as ReactNativeDeviceActivity from "react-native-device-activity";
import { Text, View } from "../components/Themed";
import { useConfigStore } from "../store/configStore"; // adjust path if needed

export default function ModalScreen() {
  const router = useRouter();

  const familyActivitySelection = useConfigStore(
    (s) => s.familyActivitySelection
  );
  const setFamilyActivitySelection = useConfigStore(
    (s) => s.setFamilyActivitySelection
  );

  const handleSelectionChange = (event) => {
    const selection = event?.nativeEvent?.familyActivitySelection ?? null;
    setFamilyActivitySelection(selection);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Apps</Text>

      <View style={styles.pickerContainer}>
        <ReactNativeDeviceActivity.DeviceActivitySelectionView
          familyActivitySelection={familyActivitySelection}
          onSelectionChange={handleSelectionChange}
          style={styles.picker}
        />
      </View>

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingTop: 16,
    paddingBottom: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  pickerContainer: {
    flex: 1,
    width: "100%",
  },
  picker: {
    flex: 1,
    width: "100%",
  },
  closeButton: {
    alignSelf: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#111",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
