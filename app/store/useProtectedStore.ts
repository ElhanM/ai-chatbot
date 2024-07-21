import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils/makeRequest';

export interface ProtectedState {
  data: IResponse | null;
  loading: boolean;
  error: string | null;
  fetchProtected: () => Promise<void>;
}

export const useProtectedStore = create(
  immer<ProtectedState>((set) => ({
    data: null,
    loading: true,
    error: null,
    fetchProtected: async () => {
      await makeRequest({ endpoint: '/protected/ping', set, method: RequestMethod.GET });
    },
  }))
);
