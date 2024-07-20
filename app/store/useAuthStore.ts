import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils';
import * as SecureStore from 'expo-secure-store';
import { setUser } from '@/utils/user';
import { router } from 'expo-router';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

interface LoginData {
  id: string;
  email: string;
}

export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
}

export interface AuthState {
  data: IResponse<LoginData> | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  user: User;
  setUserId: (userId: string | null) => void;
  setUserDetails: (name: string, email: string) => void;
}

export const useAuthStore = create(
  immer<AuthState>((set) => ({
    data: null,
    loading: false,
    error: null,
    user: {
      id: null,
      name: null,
      email: null,
    },
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
            setUser(state.setUserId, userId);
          }
          if (environment === 'development') {
            router.replace('/welcome');
          } else {
            router.replace('/chats');
          }
        }
      });
    },
    setUserId: (userId: string | null) => {
      set((state) => {
        state.user.id = userId;
      });
    },
    setUserDetails: (name: string, email: string) => {
      set((state) => {
        state.user.name = name;
        state.user.email = email;
      });
    },
  }))
);
