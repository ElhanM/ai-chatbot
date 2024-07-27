import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';

export interface ClearTokensState {
  data: IResponse | null;
  loading: boolean;
  clearTokens: () => Promise<void>;
}

export const useClearTokensStore = create(
  immer<ClearTokensState>((set) => ({
    data: null,
    loading: false,
    clearTokens: async () => {
      await makeRequest({ endpoint: '/protected/clear-tokens', set, method: RequestMethod.DELETE });
    },
  }))
);
