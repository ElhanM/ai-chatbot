import { IResponse } from '@/api-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';
import { Conversation } from './useConversationStore';
import { useSelectedConversationStore } from './useSelectedConversationStore';

interface GetLatestConversationState {
  data: IResponse<Conversation> | null;
  loading: boolean;
  fetchLatestConversation: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
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
      useSelectedConversationStore
        .getState()
        .setConversation(useGetLatestConversationStore.getState().data?.results as Conversation);
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
