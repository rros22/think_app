// src/store/statsStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Local date key in Europe/Madrid (or whatever the device timezone is)
function dayKeyFromDate(date = new Date()) {
  // Uses the device locale/timezone; for Spain it will be correct.
  // Format as YYYY-MM-DD without external libs:
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const useStatsStore = create()(
  persist(
    (set, get) => ({
      // { "YYYY-MM-DD": numberOfMinutes }
      minutesByDay: {},

      // Add N minutes to a given day (defaults to today)
      addMinutes: (minutes, date = new Date()) => {
        const m = Math.max(0, Math.floor(minutes || 0));
        if (m === 0) return;

        const key = dayKeyFromDate(date);
        const current = get().minutesByDay[key] || 0;

        set({
          minutesByDay: {
            ...get().minutesByDay,
            [key]: current + m,
          },
        });
      },

      // Set the exact value for a day (useful for corrections)
      setMinutesForDay: (key, minutes) => {
        const m = Math.max(0, Math.floor(minutes || 0));
        set({
          minutesByDay: {
            ...get().minutesByDay,
            [key]: m,
          },
        });
      },

      // Get minutes for a day (helper; optional)
      getMinutesForDay: (key) => {
        return get().minutesByDay[key] || 0;
      },

      // Optional housekeeping
      clearAllStats: () => set({ minutesByDay: {} }),
      deleteDay: (key) => {
        const next = { ...get().minutesByDay };
        delete next[key];
        set({ minutesByDay: next });
      },
    }),
    {
      name: "appStats.store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ minutesByDay: state.minutesByDay }),
    }
  )
);
