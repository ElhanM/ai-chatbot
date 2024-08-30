import { IResponse } from '@/api-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ConversationsState {
  data: IResponse<Conversation[]> | null;
  loading: boolean;
  fetching: boolean;
  limit: number;
  offset: number;
  fetchConversations: (limit: number, offset: number) => Promise<void>;
  reset: () => void;
  setConversation: (conversation: Conversation) => void;
}

const initialState = {
  data: null,
  loading: false,
  fetching: false,
  limit: 15,
  offset: 0,
};

export const useConversationsStore = create(
  immer<ConversationsState>((set) => ({
    ...initialState,
    fetchConversations: async (limit, offset) => {
      set((state) => {
        if (offset === 0) {
          state.loading = true;
        }
        state.fetching = true;
        state.limit = limit;
        state.offset = offset;
      });

      await makeRequest({
        endpoint: `/protected/chats/conversations?limit=${limit}&offset=${offset}`,
        method: RequestMethod.GET,
        set,
        pagination: true,
      });

      set((state) => {
        state.fetching = false;
      });
    },
    setConversation: (conversation: Conversation) => {
      set(() => ({
        conversation,
      }));
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
