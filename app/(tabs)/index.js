import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch } from 'react-native';

import { Text, View } from '../../components/Themed';
import { readMifare } from "../../helpers/nfcUtils";

import * as ReactNativeDeviceActivity from "react-native-device-activity";
import { useDeviceActivity } from '../../context/DeviceActivityContext';

import { setDenyAppRemoval } from 'app-removal-guard';

const SELECTION_ID = "blocked_apps_selection";
const NFC_TRIGGER_CODE = "123456789";

export default function TabOneScreen() {
  const {
    familyActivitySelection,
    isBlocked,
    setIsBlocked,
    preventDeletionWhileBlocked,
    setPreventDeletionWhileBlocked,
  } = useDeviceActivity();

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

      // On startup: enforce current intended policy
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
      Alert.alert("Authorization Required", "Grant Screen Time authorization first.");
      return;
    }

    if (!persistSelectionIfNeeded()) {
      Alert.alert("No Apps Selected", "Please select apps to block first.");
      return;
    }

    // Apply app removal protection based on current preference
    const r = setDenyAppRemoval(!!preventDeletionWhileBlocked);
    console.log("[AppRemovalGuard] setDenyAppRemoval(on block) =>", r);

    ReactNativeDeviceActivity.blockSelection({ activitySelectionId: SELECTION_ID });
    setIsBlocked(true);
  }, [requestAuthIfNeeded, persistSelectionIfNeeded, setIsBlocked, preventDeletionWhileBlocked]);

  const unblockApps = useCallback(async () => {
    const ok = await requestAuthIfNeeded();
    if (!ok) {
      Alert.alert("Authorization Required", "Grant Screen Time authorization first.");
      return;
    }

    if (typeof ReactNativeDeviceActivity.unblockSelection !== "function") {
      console.warn("unblockSelection not available in this version.");
      return;
    }

    ReactNativeDeviceActivity.unblockSelection({ activitySelectionId: SELECTION_ID });

    // Always allow removal again when unblocked
    const r = setDenyAppRemoval(false);
    console.log("[AppRemovalGuard] setDenyAppRemoval(on unblock) =>", r);

    setIsBlocked(false);
  }, [requestAuthIfNeeded, setIsBlocked]);

  // ✅ Allow activation any time; disallow deactivation only when blocked
  const handleTogglePreventDeletion = useCallback((value) => {
    const next = !!value;

    // If currently blocked and user is trying to turn it OFF, deny it.
    if (isBlocked && next === false) {
      return;
    }

    setPreventDeletionWhileBlocked(next);

    // If currently blocked and user just turned it ON, apply immediately
    if (isBlocked && next === true) {
      const r = setDenyAppRemoval(true);
      console.log("[AppRemovalGuard] setDenyAppRemoval(activated while blocked) =>", r);
    }
  }, [isBlocked, setPreventDeletionWhileBlocked]);

  const handleOpenNfcPress = useCallback(async () => {
    const code = await readMifare();
    console.log("NFC code:", code);

    if (code !== NFC_TRIGGER_CODE) return;

    if (!familyActivitySelection) {
      Alert.alert("No Apps Selected", "Please select apps to block before using the NFC tag.");
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
      Alert.alert(
        "Block Apps?",
        "This NFC tag will block the selected apps.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Block", style: "destructive", onPress: blockApps },
        ]
      );
    }
  }, [familyActivitySelection, isBlocked, unblockApps, blockApps]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.nfcButton} onPress={handleOpenNfcPress}>
        <Text style={styles.buttonText}>think time</Text>
      </Pressable>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Prevent app deletion while blocked</Text>
        <Switch
          value={!!preventDeletionWhileBlocked}
          onValueChange={handleTogglePreventDeletion}
          // ✅ Disabled only once it is ON while blocked
          disabled={!isAuthorized || (isBlocked && !!preventDeletionWhileBlocked)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  nfcButton: {
    width: 160,
    height: 44,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  toggleRow: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  toggleLabel: {
    flex: 1,
    marginRight: 12,
    fontWeight: '600',
  },
});
