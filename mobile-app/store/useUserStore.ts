import { IResponse } from '@/api-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useLoginStore, User } from './useLoginStore';
import { makeRequest, RequestMethod } from './utils/makeRequest';

interface UserState {
  data: IResponse<{ user: User }> | null;
  loading: boolean;
  fetchUserData: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
};

export const useUserStore = create(
  immer<UserState>((set) => ({
    ...initialState,
    fetchUserData: async () => {
      const userId = useLoginStore.getState().user.id;

      if (!userId) {
        return;
      }

      await makeRequest({
        endpoint: `/jwts/${userId}`,
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
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
