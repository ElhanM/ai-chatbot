import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Conversation } from './useConversationStore';
import { makeRequest, RequestMethod } from '../utils/makeRequest';

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
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);