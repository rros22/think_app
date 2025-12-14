import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import { SafeAreaView, Text, View } from "../../components/Themed";
import { readMifare } from "../../helpers/nfcUtils";

import * as ReactNativeDeviceActivity from "react-native-device-activity";
import { useConfigStore } from "../../store/configStore"; // adjust path if needed

import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

import { setDenyAppRemoval } from "app-removal-guard";
import {
  DeviceContour,
  Pressable as ThemedPressable,
} from "../../components/Themed";

const SELECTION_ID = "blocked_apps_selection";
const NFC_TRIGGER_CODE = "123456789";

export default function BlockScreen() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();

  const familyActivitySelection = useConfigStore(
    (s) => s.familyActivitySelection
  );
  const isBlocked = useConfigStore((s) => s.isBlocked);
  const setIsBlocked = useConfigStore((s) => s.setIsBlocked);
  const preventDeletionWhileBlocked = useConfigStore(
    (s) => s.preventDeletionWhileBlocked
  );

  const [isAuthorized, setIsAuthorized] = useState(false);
  const authRequestedRef = useRef(false);

  const requestAuthIfNeeded = useCallback(async () => {
    if (authRequestedRef.current) return isAuthorized;
    authRequestedRef.current = true;

    try {
      const result = await ReactNativeDeviceActivity.requestAuthorization?.();
      const ok = typeof result === "boolean" ? result : true;
      setIsAuthorized(ok);
      console.log("[DeviceActivity] Authorization result:", result);
      return ok;
    } catch (e) {
      console.log("[DeviceActivity] Authorization error:", e);
      setIsAuthorized(false);
      return false;
    }
  }, [isAuthorized]);

  useEffect(() => {
    (async () => {
      const ok = await requestAuthIfNeeded();
      if (!ok) return;

      // On startup: enforce current intended policy (strictMode + blocked)
      const r = setDenyAppRemoval(!!(isBlocked && preventDeletionWhileBlocked));
      console.log("[AppRemovalGuard] init policy =>", r);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSelectionIfNeeded = useCallback(() => {
    if (!familyActivitySelection) return false;

    ReactNativeDeviceActivity.setFamilyActivitySelectionId({
      id: SELECTION_ID,
      familyActivitySelection,
    });

    return true;
  }, [familyActivitySelection]);

  const blockApps = useCallback(async () => {
    const ok = await requestAuthIfNeeded();
    if (!ok) {
      Alert.alert(
        "Authorization Required",
        "Grant Screen Time authorization first."
      );
      return;
    }

    if (!persistSelectionIfNeeded()) {
      Alert.alert("No Apps Selected", "Please select apps to block first.");
      return;
    }

    // Apply app removal protection based on strictMode preference
    const r = setDenyAppRemoval(!!preventDeletionWhileBlocked);
    console.log("[AppRemovalGuard] setDenyAppRemoval(on block) =>", r);

    ReactNativeDeviceActivity.blockSelection({
      activitySelectionId: SELECTION_ID,
    });

    setIsBlocked(true);
  }, [
    requestAuthIfNeeded,
    persistSelectionIfNeeded,
    setIsBlocked,
    preventDeletionWhileBlocked,
  ]);

  const unblockApps = useCallback(async () => {
    const ok = await requestAuthIfNeeded();
    if (!ok) {
      Alert.alert(
        "Authorization Required",
        "Grant Screen Time authorization first."
      );
      return;
    }

    if (typeof ReactNativeDeviceActivity.unblockSelection !== "function") {
      console.warn("unblockSelection not available in this version.");
      return;
    }

    ReactNativeDeviceActivity.unblockSelection({
      activitySelectionId: SELECTION_ID,
    });

    // Always allow removal again when unblocked
    const r = setDenyAppRemoval(false);
    console.log("[AppRemovalGuard] setDenyAppRemoval(on unblock) =>", r);

    setIsBlocked(false);
  }, [requestAuthIfNeeded, setIsBlocked]);

  const handleOpenNfcPress = useCallback(async () => {
    const code = await readMifare();
    console.log("NFC code:", code);

    if (code !== NFC_TRIGGER_CODE) return;

    if (!familyActivitySelection) {
      Alert.alert(
        "No Apps Selected",
        "Please select apps to block before using the NFC tag."
      );
      return;
    }

    if (isBlocked) {
      Alert.alert(
        "Unblock Apps?",
        "This NFC tag will unblock the selected apps.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Unblock", style: "destructive", onPress: unblockApps },
        ]
      );
    } else {
      Alert.alert("Block Apps?", "This NFC tag will block the selected apps.", [
        { text: "Cancel", style: "cancel" },
        { text: "Block", style: "destructive", onPress: blockApps },
      ]);
    }
  }, [familyActivitySelection, isBlocked, unblockApps, blockApps]);

  const handleMode = () => {
    router.push("/modal");
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          colorRole="card"
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "5%",
            gap: 5,
            borderRadius: 15,
          }}
        >
          <Text style={styles.subtitleText}>0h 0m</Text>
          <Text style={styles.meta}>hoy</Text>
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
        >
          <Pressable onPress={handleOpenNfcPress}>
            <DeviceContour width={230} height={230} />
          </Pressable>
          <Pressable onPress={handleMode}>
            <Text style={styles.subtitleText}>Modo: Focus</Text>
          </Pressable>
          <Text style={{ marginVertical: 0 }}>Bloqueando x apps</Text>
        </View>
        <ThemedPressable
          onPress={handleOpenNfcPress}
          style={{
            padding: "6%",
            borderRadius: 40,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            // iOS
            shadowColor: "#000",
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            borderWidth: 1,
            borderColor: textColor,

            // Android
            elevation: 8,
          }}
        >
          <Text style={[styles.meta, { fontWeight: "500" }]}>
            Activar think.
          </Text>
        </ThemedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
    paddingVertical: "15%",
  },
  nfcButton: {
    width: 160,
    height: 44,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: "500",
  },
  meta: {
    fontSize: 12,
    fontWeight: "400",
  },
});
