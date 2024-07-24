import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils/makeRequest';

export interface ProtectedState {
  data: IResponse | null;
  loading: boolean;
  fetchProtected: () => Promise<void>;
}

export const useProtectedStore = create(
  immer<ProtectedState>((set) => ({
    data: null,
    loading: true,
    fetchProtected: async () => {
      await makeRequest({ endpoint: '/protected/ping', set, method: RequestMethod.GET });
    },
  }))
);
