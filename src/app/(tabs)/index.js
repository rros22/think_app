import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";

import {
  SafeAreaView,
  Text,
  Pressable as ThemedPressable,
  View,
} from "../../components/Themed";
import { readMifare } from "../../helpers/nfcUtils";

import * as ReactNativeDeviceActivity from "react-native-device-activity";
import { useAppStore } from "../../store/appConfigStore";

import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

import { setDenyAppRemoval as _setDenyAppRemoval } from "app-removal-guard";
import { AnimatedDeviceContour } from "../../components/animatedComponents";

const SELECTION_ID = "blocked_apps_selection";
const NFC_TRIGGER_CODE = "123456789";

/**
 * Safe wrapper:
 * - iOS: calls app-removal-guard
 * - Android/others: no-op (prevents crash)
 */
function setDenyAppRemovalSafe(deny) {
  if (Platform.OS !== "ios") return { supported: false };

  try {
    const result = _setDenyAppRemoval(!!deny);
    return { supported: true, result };
  } catch (error) {
    console.warn("[AppRemovalGuard] setDenyAppRemoval failed:", error);
    return { supported: false, error };
  }
}

export default function BlockScreen() {
  // subscriptions to app state store
  const selectedModeId = useAppStore((state) => state.selectedModeId);
  const modesById = useAppStore((state) => state.modesById);
  const modeOrder = useAppStore((state) => state.modeOrder);

  const isBlockingActive = useAppStore((state) => state.isBlockingActive);
  const setIsBlockingActive = useAppStore((state) => state.setIsBlockingActive);

  const preventDeletionWhileBlocked = useAppStore(
    (state) => state.preventDeletionWhileBlocked
  );

  const selectedMode = selectedModeId ? modesById[selectedModeId] : null;
  const selectedBlockedSelection = selectedMode?.blockedAppSelection ?? null;
  const hasAnyModes = modeOrder.length > 0;

  // expo router, for navigating between screens
  const router = useRouter();

  // styling
  const colorScheme = useColorScheme() ?? "light";
  const textColor = Colors[colorScheme].text;
  const pressedIconColor = Colors[colorScheme].textSecondary;

  // screen time api authorisation request
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

  const ensureAuthorizedOrAlert = useCallback(async () => {
    const ok = await requestAuthIfNeeded();
    if (!ok) {
      Alert.alert(
        "Authorization Required",
        "Grant Screen Time authorization first."
      );
      return false;
    }
    return true;
  }, [requestAuthIfNeeded]);

  const ensureSelectionOrAlert = useCallback(
    (message) => {
      if (selectedBlockedSelection) return true;

      Alert.alert(
        "No Apps Selected",
        message ?? "Please select apps to block first."
      );
      return false;
    },
    [selectedBlockedSelection]
  );

  // NFC helpers: avoid unhandled rejections if scan is cancelled/fails
  const readNfcCodeSafely = useCallback(async () => {
    try {
      return await readMifare();
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const ok = await requestAuthIfNeeded();
      if (!ok) return;

      // On startup: enforce current intended policy (strictMode + blocked)
      const r = setDenyAppRemovalSafe(
        !!(isBlockingActive && preventDeletionWhileBlocked)
      );
      console.log("[AppRemovalGuard] init policy =>", r);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blockApps = useCallback(async () => {
    if (!(await ensureAuthorizedOrAlert())) return;
    if (!ensureSelectionOrAlert("Please select apps to block first.")) return;

    ReactNativeDeviceActivity.setFamilyActivitySelectionId({
      id: SELECTION_ID,
      familyActivitySelection: selectedBlockedSelection,
    });

    const r = setDenyAppRemovalSafe(!!preventDeletionWhileBlocked);
    console.log("[AppRemovalGuard] setDenyAppRemoval(on block) =>", r);

    ReactNativeDeviceActivity.blockSelection({
      activitySelectionId: SELECTION_ID,
    });

    setIsBlockingActive(true);
  }, [
    ensureAuthorizedOrAlert,
    ensureSelectionOrAlert,
    selectedBlockedSelection,
    preventDeletionWhileBlocked,
    setIsBlockingActive,
  ]);

  const unblockApps = useCallback(async () => {
    if (!(await ensureAuthorizedOrAlert())) return;

    if (typeof ReactNativeDeviceActivity.unblockSelection !== "function") {
      console.warn("unblockSelection not available in this version.");
      return;
    }

    ReactNativeDeviceActivity.unblockSelection({
      activitySelectionId: SELECTION_ID,
    });

    const r = setDenyAppRemovalSafe(false);
    console.log("[AppRemovalGuard] setDenyAppRemoval(on unblock) =>", r);

    setIsBlockingActive(false);
  }, [ensureAuthorizedOrAlert, setIsBlockingActive]);

  // confirm dialogs (defined after block/unblock so callbacks can reference them safely)
  const confirmUnblockApps = useCallback(() => {
    Alert.alert("Terminar sesión", "Confirma que quieres terminar tu sesión.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Terminar", style: "destructive", onPress: unblockApps },
    ]);
  }, [unblockApps]);

  const confirmBlockApps = useCallback(() => {
    Alert.alert(
      "Comenzar sesión?",
      "Necesitarás tu dispositivo think para pausarla",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Comenzar", style: "destructive", onPress: blockApps },
      ]
    );
  }, [blockApps]);

  // Remote blocking / NFC unlock
  const handleRemoteBlock = useCallback(async () => {
    if (
      !ensureSelectionOrAlert(
        "Please select apps to block before using remote block."
      )
    ) {
      return;
    }

    // UNLOCK PATH (NFC required)
    if (isBlockingActive) {
      const code = await readNfcCodeSafely();
      if (code !== NFC_TRIGGER_CODE) return;

      confirmUnblockApps();
      return;
    }

    // BLOCK PATH (no NFC required)
    confirmBlockApps();
  }, [
    ensureSelectionOrAlert,
    isBlockingActive,
    readNfcCodeSafely,
    confirmUnblockApps,
    confirmBlockApps,
  ]);

  // NFC blocking
  const handleOpenNfcPress = useCallback(async () => {
    const code = await readNfcCodeSafely();
    console.log("NFC code:", code);

    if (code !== NFC_TRIGGER_CODE) return;

    if (
      !ensureSelectionOrAlert(
        "Please select apps to block before using the NFC tag."
      )
    ) {
      return;
    }

    if (isBlockingActive) confirmUnblockApps();
    else confirmBlockApps();
  }, [
    readNfcCodeSafely,
    ensureSelectionOrAlert,
    isBlockingActive,
    confirmUnblockApps,
    confirmBlockApps,
  ]);

  const handleMode = () => {
    if (!hasAnyModes) {
      router.push("/modeSelectionModal/editMode/create");
      return;
    }
    router.push("/modeSelectionModal");
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
          style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
        >
          <AnimatedDeviceContour
            onLongPress={handleRemoteBlock} // or handleOpenNfcPress
            delayLongPress={300}
            onPressOut={() => {
              /* optional: reset extra UI */
            }}
          />
          <Pressable
            disabled={isBlockingActive}
            onPressOut={handleMode}
            style={({ pressed }) => ({
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              gap: 10,
              opacity: isBlockingActive ? 1 : pressed ? 0.6 : 1,
            })}
          >
            {({ pressed }) => (
              <>
                <Text
                  style={[
                    styles.subtitleText,
                    !isBlockingActive && pressed && styles.subtitleTextPressed,
                  ]}
                >
                  {hasAnyModes
                    ? `Modo: ${selectedMode?.name ?? "Seleccionar modo"}`
                    : "Crear modo"}
                </Text>

                {/* 🔽 Chevron only when NOT blocked */}
                {!isBlockingActive &&
                  (hasAnyModes ? (
                    <Entypo
                      name="chevron-thin-down"
                      size={14}
                      color={pressed ? pressedIconColor : textColor}
                    />
                  ) : (
                    <Entypo
                      name="plus"
                      size={18}
                      color={pressed ? pressedIconColor : textColor}
                    />
                  ))}
              </>
            )}
          </Pressable>

          <Text colorRole="textSecondary" style={styles.meta}>
            Bloqueando x apps
          </Text>
        </View>

        <ThemedPressable
          onPress={handleOpenNfcPress}
          style={{
            padding: "6%",
            borderRadius: 40,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            borderWidth: 1,
            shadowColor: Colors[colorScheme].separator,
            borderColor: Colors[colorScheme].text,
            elevation: 8,
          }}
        >
          <Text style={[styles.meta, { fontWeight: "500" }]}>
            {!isBlockingActive ? "Activar think" : "Desactivar think"}
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
  subtitleText: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitleTextPressed: {
    opacity: 0.3,
  },
  meta: {
    fontSize: 12,
    fontWeight: "400",
  },
});
