import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface HealthState {
  message: string;
  fetchHealth: () => Promise<void>;
  counter: number;
  increaseCounter: () => void;
  decreaseCounter: () => void;
}

export const useHealthStore = create(
  immer<HealthState>((set) => ({
    message: '',
    fetchHealth: async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/health`);

        const data = await response.json();
        set((state) => {
          state.message = data.message;
        });
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    },
    counter: 0,
    increaseCounter: () =>
      set((state) => {
        state.counter += 1;
      }),
    decreaseCounter: () =>
      set((state) => {
        state.counter -= 1;
      }),
  }))
);
