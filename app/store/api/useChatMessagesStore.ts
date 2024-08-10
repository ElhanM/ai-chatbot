import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';

export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface IMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  sender: Sender;
  content: string;
}

interface ChatMessagesState {
  data: IResponse<IMessage[]> | null;
  loading: boolean;
  fetching: boolean;
  limit: number;
  offset: number;
  fetchMessages: (conversationId: string, limit: number, offset: number) => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
  fetching: false,
  limit: 15,
  offset: 0,
};

export const useChatMessagesStore = create(
  immer<ChatMessagesState>((set) => ({
    ...initialState,
    fetchMessages: async (conversationId, limit, offset) => {
      set((state) => {
        if (offset === 0) {
          state.loading = true;
        }
        state.fetching = true;
        state.limit = limit;
        state.offset = offset;
      });

      await makeRequest({
        endpoint: `/protected/chats/messages/${conversationId}?limit=${limit}&offset=${offset}`,
        method: RequestMethod.GET,
        set,
        pagination: true,
      });

      set((state) => {
        state.fetching = false;
      });
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
