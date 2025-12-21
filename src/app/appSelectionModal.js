import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import * as ReactNativeDeviceActivity from "react-native-device-activity";
import { Text, View } from "../components/Themed";
import { useAppStore } from "../store/appConfigStore"; // adjust path to your new store

export default function AppSelectionModal() {
  const router = useRouter();
  const { modeId } = useLocalSearchParams();

  // expo-router params can be string | string[] | undefined
  const resolvedModeId = Array.isArray(modeId) ? modeId[0] : modeId;

  // If no modeId, or mode doesn't exist, do not render the picker
  const modeExists = useAppStore((s) =>
    resolvedModeId ? !!s.modesById[resolvedModeId] : false
  );

  const blockedAppSelection = useAppStore((s) =>
    resolvedModeId ? s.getModeBlockedAppSelection(resolvedModeId) : null
  );

  const setModeBlockedAppSelection = useAppStore(
    (s) => s.setModeBlockedAppSelection
  );

  const handleSelectionChange = (event) => {
    if (!resolvedModeId) return;
    const selection = event?.nativeEvent?.familyActivitySelection ?? null;
    setModeBlockedAppSelection(resolvedModeId, selection);
  };

  if (!resolvedModeId || !modeExists) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Back</Text>
        </Pressable>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <ReactNativeDeviceActivity.DeviceActivitySelectionView
          familyActivitySelection={blockedAppSelection}
          onSelectionChange={handleSelectionChange}
          style={styles.picker}
        />
      </View>

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>Save</Text>
      </Pressable>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    paddingTop: 16,
    paddingBottom: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  pickerContainer: { flex: 1, width: "100%" },
  picker: { flex: 1, width: "100%" },
  closeButton: {
    alignSelf: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#111",
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});
