import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useAuthStore, User } from './useAuthStore';
import { makeRequest, RequestMethod } from './utils/makeRequest';

interface UserState {
  data: IResponse<{ user: User }> | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create(
  immer<UserState>((set) => ({
    data: null,
    loading: false,
    error: null,
    fetchUserData: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      await makeRequest({
        endpoint: `/jwts/${useAuthStore.getState().user.id}`,
        method: RequestMethod.GET,
        set,
      });

      set((state) => {
        useAuthStore
          .getState()
          .setUserDetails(
            state.data?.results?.user.name as string,
            state.data?.results?.user.email as string
          );
      });
    },
  }))
);
