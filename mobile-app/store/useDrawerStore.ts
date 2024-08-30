import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DrawerState {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  reset: () => void;
}

const initialState = {
  isDrawerOpen: false,
};

export const useDrawerStore = create(
  immer<DrawerState>((set) => ({
    ...initialState,
    toggleDrawer: () =>
      set((state) => {
        state.isDrawerOpen = !state.isDrawerOpen;
      }),
    reset: () => set(() => ({ ...initialState })),
  }))
);
