import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils';
import { IResponse } from '@/api';

interface ErrorData {}

export interface ErrorState {
  data: IResponse<ErrorData> | null;
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
      await makeRequest({ endpoint: '/error', set, method: RequestMethod.GET });
    },
  }))
);
