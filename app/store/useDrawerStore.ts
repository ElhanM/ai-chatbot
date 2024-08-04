import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DrawerState {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

export const useDrawerStore = create(
  immer<DrawerState>((set) => ({
    isDrawerOpen: false,
    toggleDrawer: () =>
      set((state) => {
        state.isDrawerOpen = !state.isDrawerOpen;
      }),
  }))
);
