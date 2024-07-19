import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchData } from './utils';
import { IResponse } from '@/api';

interface ErrorState {
  data: IResponse | null;
  loading: boolean;
  error: string | null;
  fetchError: () => Promise<void>;
}

export const useErrorStore = create(
  immer<ErrorState>((set) => ({
    data: null,
    loading: true,
    error: null,
    fetchError: async () => {
      await fetchData({ endpoint: '/error', set });
    },
  }))
);
