import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';
import { Conversation } from './useConversationStore';

interface GetLatestConversationState {
  data: IResponse<Conversation> | null;
  loading: boolean;
  error: string | null;
  fetchLatestConversation: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const useGetLatestConversationStore = create(
  immer<GetLatestConversationState>((set) => ({
    ...initialState,
    fetchLatestConversation: async () => {
      await makeRequest({
        endpoint: `/protected/chats/latest-conversation`,
        method: RequestMethod.GET,
        set,
      });
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
