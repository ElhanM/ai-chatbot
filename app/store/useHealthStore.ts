import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchData } from './utils';

export interface HealthState {
  data: IResponse | null;
  loading: boolean;
  error: string | null;
  fetchHealth: () => Promise<void>;
  counter: number;
  increaseCounter: () => void;
  decreaseCounter: () => void;
}

// TODO: add tests for fetchHealth and fetchError
export const useHealthStore = create(
  immer<HealthState>((set) => ({
    data: null,
    loading: true,
    error: null,
    fetchHealth: async () => {
      await fetchData({ endpoint: '/health', set });
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
