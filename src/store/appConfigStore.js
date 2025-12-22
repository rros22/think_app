import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const genId = () => nanoid();

//set the maximum number of modes
const MAX_MODES = 10;

export const useAppStore = create(
  persist(
    (set, get) => ({
      maxModes: MAX_MODES,
      modesById: {},
      modeOrder: [],
      selectedModeId: null,

      isBlockingActive: false,
      preventDeletionWhileBlocked: false,

      setSelectedModeId: (id) => {
        if (id != null && !get().modesById[id]) return; // safety
        set({ selectedModeId: id });
      },

      //flag to activate the block
      setIsBlockingActive: (active) => set({ isBlockingActive: !!active }),

      //setter to control whether blocking is active or not
      setPreventDeletionWhileBlocked: (value) =>
        set({ preventDeletionWhileBlocked: !!value }),

      // Pattern A core: single source of truth for writing a mode
      upsertMode: (mode, opts = {}) => {
        const ensureInOrder = opts.ensureInOrder ?? true; // add to modeOrder if new
        const selectIfNone = opts.selectIfNone ?? true; // auto-select if nothing selected

        set((state) => {
          const existed = !!state.modesById[mode.id];

          // soft copy of the old object and addition of the new mode with key being the mode id
          // that you can find inside of it as well
          const nextModesById = {
            ...state.modesById,
            [mode.id]: mode,
          };
          // add a the id of the newly created mode to the order list. If the mode existed
          // keep the original object (this is for updates)
          const nextOrder =
            ensureInOrder && !existed
              ? [...state.modeOrder, mode.id]
              : state.modeOrder;
          //If no mode is currently selected, select this mode
          const nextSelected =
            selectIfNone && state.selectedModeId == null
              ? mode.id
              : state.selectedModeId;

          return {
            modesById: nextModesById,
            modeOrder: nextOrder,
            selectedModeId: nextSelected,
          };
        });
      },

      createMode: ({ name, blockedAppSelection }) => {
        const { modeOrder, maxModes } = get();

        if (modeOrder.length >= maxModes) {
          return null;
        }

        let id = genId();
        while (get().modesById[id]) id = genId();

        const mode = { id, name, blockedAppSelection };
        get().upsertMode(mode, { ensureInOrder: true, selectIfNone: true });

        return id;
      },

      // "Edit" entry point: patch fields on an existing mode
      updateMode: (id, patch) => {
        //if the mode doesn't exist exit
        const existing = get().modesById[id];
        if (!existing) return;

        //combines old object with a partial object, i.e. the changes you want to make
        const updated = { ...existing, ...patch };

        // updating: do not add to order; do not auto-select
        get().upsertMode(updated, {
          ensureInOrder: false,
          selectIfNone: false,
        });
      },

      deleteMode: (id) => {
        set((state) => {
          if (!state.modesById[id]) return state;

          const { [id]: _removed, ...remainingModes } = state.modesById;
          const nextOrder = state.modeOrder.filter((x) => x !== id);

          const nextSelected =
            state.selectedModeId === id
              ? (nextOrder[0] ?? null)
              : state.selectedModeId;

          return {
            modesById: remainingModes,
            modeOrder: nextOrder,
            selectedModeId: nextSelected,
            isBlockingActive:
              nextSelected == null ? false : state.isBlockingActive,
          };
        });
      },

      setModeBlockedAppSelection: (modeId, selection) => {
        const existing = get().modesById[modeId];
        if (!existing) return;

        // Reuse your existing updateMode
        get().updateMode(modeId, { blockedAppSelection: selection });
      },

      getModeBlockedAppSelection: (modeId) => {
        const mode = get().modesById[modeId];
        return mode?.blockedAppSelection ?? null;
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),

      // Persist only what you need
      partialize: (state) => ({
        maxModes: state.maxModes,
        modesById: state.modesById,
        modeOrder: state.modeOrder,
        selectedModeId: state.selectedModeId,
        isBlockingActive: state.isBlockingActive,
        preventDeletionWhileBlocked: state.preventDeletionWhileBlocked,
      }),
    }
  )
);
