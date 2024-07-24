import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils/makeRequest';

export interface HealthState {
  data: IResponse | null;
  loading: boolean;
  fetchHealth: () => Promise<void>;
  counter: number;
  increaseCounter: () => void;
  decreaseCounter: () => void;
}

export const useHealthStore = create(
  immer<HealthState>((set) => ({
    data: null,
    loading: true,
    fetchHealth: async () => {
      await makeRequest({ endpoint: '/health', set, method: RequestMethod.GET });
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
