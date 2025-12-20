import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set, get) => ({
      data: 0,

      setData: (newValue) => {
        set({ data: newValue });
      },

      increment: (value) => {
        set((state) => ({ data: state.data + value }));
      },
    }),
    {
      name: "app-store", // storage key
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ data: state.data }),
    }
  )
);
