import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useLoginStore, User } from './useLoginStore';
import { makeRequest, RequestMethod } from './utils/makeRequest';

interface UserState {
  data: IResponse<{ user: User }> | null;
  loading: boolean;
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create(
  immer<UserState>((set) => ({
    data: null,
    loading: false,
    fetchUserData: async () => {
      await makeRequest({
        endpoint: `/jwts/${useLoginStore.getState().user.id}`,
        method: RequestMethod.GET,
        set,
      });

      set((state) => {
        useLoginStore
          .getState()
          .setUserDetails(
            state.data?.results?.user.name as string,
            state.data?.results?.user.email as string
          );
      });
    },
  }))
);
