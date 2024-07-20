import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils';

export interface HealthData {}

export interface HealthState {
  data: IResponse<HealthData> | null;
  loading: boolean;
  error: string | null;
  fetchHealth: () => Promise<void>;
  counter: number;
  increaseCounter: () => void;
  decreaseCounter: () => void;
}

export const useHealthStore = create(
  immer<HealthState>((set) => ({
    data: null,
    loading: true,
    error: null,
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
