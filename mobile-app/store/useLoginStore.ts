import { IResponse } from '@/api-client';
import { setUserInStorage } from '@/utils/user';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from './utils/makeRequest';

interface LoginData {
  id: string;
  email: string;
}

export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
}

export interface LoginState {
  data: IResponse<LoginData> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  user: User;
  setUserId: (userId: string | null) => void;
  setUserDetails: (name: string, email: string) => void;
  onGuardFailure: () => void;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
  user: {
    id: null,
    name: null,
    email: null,
  },
};

export const useLoginStore = create(
  immer<LoginState>((set) => ({
    ...initialState,
    login: async (email: string, password: string) => {
      await makeRequest({
        endpoint: '/auth/login',
        method: RequestMethod.POST,
        data: { email, password },
        set,
      });

      set((state) => {
        if (state.data && state.data.results && state.data.results.id && state.user) {
          const userId = state.data.results.id;

          set((state) => {
            state.user.id = userId;
          });
          setUserInStorage(userId);
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
    onGuardFailure: () => {
      set((state) => {
        setUserInStorage(null);
        // Using setUserId or setUserDetails here does not work as expected
        // My guess is the fact that we call set((state) => {set((state) => { ... })})
        state.user.id = null;
        state.user.name = '';
        state.user.email = '';
      });
    },
    reset: () => {
      set((state) => {
        state.data = null;
        state.loading = false;
      });
    },
  }))
);
