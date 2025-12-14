import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useConfigStore = create()(
  persist(
    (set) => ({
      // --- State (matches your context) ---
      familyActivitySelection: null,
      isBlocked: false,
      preventDeletionWhileBlocked: false,

      // --- Actions (matches your setters) ---
      setFamilyActivitySelection: (selection) =>
        set({ familyActivitySelection: selection }),

      setIsBlocked: (blocked) => set({ isBlocked: blocked }),

      setPreventDeletionWhileBlocked: (value) =>
        set({ preventDeletionWhileBlocked: value }),
    }),
    {
      name: "appConfig.store", // single storage key
      storage: createJSONStorage(() => AsyncStorage),

      // Persist only the serializable state (not the functions)
      partialize: (state) => ({
        familyActivitySelection: state.familyActivitySelection,
        isBlocked: state.isBlocked,
        preventDeletionWhileBlocked: state.preventDeletionWhileBlocked,
      }),
    }
  )
);
