import { IResponse } from '@/api-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';

export interface ClearTokensState {
  data: IResponse | null;
  loading: boolean;
  clearTokens: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
};

export const useClearTokensStore = create(
  immer<ClearTokensState>((set) => ({
    ...initialState,
    clearTokens: async () => {
      await makeRequest({ endpoint: '/protected/clear-tokens', set, method: RequestMethod.DELETE });
    },
    reset: () => {
      set(() => ({ ...initialState }));
    },
  }))
);
