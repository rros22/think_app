import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const STORAGE_KEYS = {
  selection: "deviceActivity.selection",
  isBlocked: "deviceActivity.isBlocked",
  preventDeletionWhileBlocked: "deviceActivity.preventDeletionWhileBlocked",
};

const DeviceActivityContext = React.createContext(null);

export function DeviceActivityProvider({ children }) {
  const [familyActivitySelection, setFamilyActivitySelection] = React.useState(null);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [preventDeletionWhileBlocked, setPreventDeletionWhileBlocked] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // 🔹 Load persisted state on app start
  React.useEffect(() => {
    (async () => {
      try {
        const storedSelection = await AsyncStorage.getItem(STORAGE_KEYS.selection);
        const storedIsBlocked = await AsyncStorage.getItem(STORAGE_KEYS.isBlocked);
        const storedPreventDeletion = await AsyncStorage.getItem(
          STORAGE_KEYS.preventDeletionWhileBlocked
        );

        if (storedSelection) {
          setFamilyActivitySelection(JSON.parse(storedSelection));
        }

        if (storedIsBlocked !== null) {
          setIsBlocked(storedIsBlocked === "true");
        }

        if (storedPreventDeletion !== null) {
          setPreventDeletionWhileBlocked(storedPreventDeletion === "true");
        }
      } catch (e) {
        console.warn("Failed to hydrate DeviceActivity state", e);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  // 🔹 Persist selection
  React.useEffect(() => {
    if (!isHydrated) return;

    if (familyActivitySelection) {
      AsyncStorage.setItem(
        STORAGE_KEYS.selection,
        JSON.stringify(familyActivitySelection)
      );
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.selection);
    }
  }, [familyActivitySelection, isHydrated]);

  // 🔹 Persist blocked state
  React.useEffect(() => {
    if (!isHydrated) return;

    AsyncStorage.setItem(
      STORAGE_KEYS.isBlocked,
      isBlocked ? "true" : "false"
    );
  }, [isBlocked, isHydrated]);

  // 🔹 Persist toggle preference
  React.useEffect(() => {
    if (!isHydrated) return;

    AsyncStorage.setItem(
      STORAGE_KEYS.preventDeletionWhileBlocked,
      preventDeletionWhileBlocked ? "true" : "false"
    );
  }, [preventDeletionWhileBlocked, isHydrated]);

  return (
    <DeviceActivityContext.Provider
      value={{
        familyActivitySelection,
        setFamilyActivitySelection,

        isBlocked,
        setIsBlocked,

        preventDeletionWhileBlocked,
        setPreventDeletionWhileBlocked,

        isHydrated,
      }}
    >
      {children}
    </DeviceActivityContext.Provider>
  );
}

export function useDeviceActivity() {
  const context = React.useContext(DeviceActivityContext);
  if (!context) {
    throw new Error("useDeviceActivity must be used within DeviceActivityProvider");
  }
  return context;
}
