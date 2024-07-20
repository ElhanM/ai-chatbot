import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils';
import * as SecureStore from 'expo-secure-store';

interface LoginData {
  id: string;
  email: string;
}

interface AuthState {
  data: IResponse<LoginData> | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create(
  immer<AuthState>((set) => ({
    data: null,
    loading: false,
    error: null,
    login: async (email: string, password: string) => {
      await makeRequest({
        endpoint: '/auth/login',
        method: RequestMethod.POST,
        data: { email, password },
        set,
      });

      set((state) => {
        if (!state.error) {
          const userId = state.data?.results?.id;

          if (userId) {
            SecureStore.setItem('userId', userId);
            console.log('User ID stored in SecureStore');
            console.log(SecureStore.getItem('userId'));
          }
        }
      });
    },
  }))
);
