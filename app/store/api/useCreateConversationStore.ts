import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Conversation } from './useConversationStore';
import { makeRequest, RequestMethod } from '../utils/makeRequest';
import { useSelectedConversationStore } from './useSelectedConversationStore';
import { router } from 'expo-router';
import { useDrawerStore } from '../useDrawerStore';

interface CreateConversationState {
  data: IResponse<Conversation> | null;
  loading: boolean;
  createConversation: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
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

      if (!useCreateConversationStore.getState().data?.results?.id) {
        console.log('Inside if');
        return;
      }
      console.log('After return');
      // We do it like this to avoid nested set((state) => { ... }) calls
      useSelectedConversationStore
        .getState()
        .setConversation(useCreateConversationStore.getState().data?.results as Conversation);
      useDrawerStore.getState().reset();
      useCreateConversationStore.getState().reset();
      router.replace('/chats');
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
