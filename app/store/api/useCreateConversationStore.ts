import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Conversation } from './useConversationStore';
import { makeRequest, RequestMethod } from '../utils/makeRequest';
import { useSelectedConversationStore } from './useSelectedConversationStore';

interface CreateConversationState {
  data: IResponse<Conversation> | null;
  loading: boolean;
  error: string | null;
  createConversation: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const useCreateConversationStore = create(
  immer<CreateConversationState>((set) => ({
    ...initialState,
    createConversation: async () => {
      await makeRequest({
        endpoint: `/protected/chats/conversation`,
        method: RequestMethod.POST,
        set,
      });

      set((state) => {
        if (state.error || !state.data?.results?.id) {
          return;
        }
      });
      // We do it like this to avoid nested set((state) => { ... }) calls
      useSelectedConversationStore
        .getState()
        .setConversation(useCreateConversationStore.getState().data?.results as Conversation);
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
