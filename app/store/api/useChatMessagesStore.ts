import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';
import { useSelectedConversationStore } from './useSelectedConversationStore';
import { v4 as uuidv4 } from 'uuid';

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
  addOptimisticMessage: (message: IMessage) => void;
  createNewBotMessage: () => void;
  updateBotMessage: (content: string) => void;
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
    addOptimisticMessage: (message) => {
      set((state) => {
        if (state.data) {
          state.data.results.unshift(message);
          state.offset += 1;
          if (state.data.count) {
            state.data.count += 1;
          }
        }
      });
    },
    createNewBotMessage: () => {
      set((state) => {
        if (state.data) {
          state.data.results.unshift({
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            conversationId: useSelectedConversationStore.getState().conversation?.id as string,
            sender: Sender.Bot,
            content: '',
          });
          state.offset += 1;
          if (state.data.count) {
            state.data.count += 1;
          }
        }
      });
    },
    updateBotMessage: (content: string) => {
      set((state) => {
        if (state.data) {
          state.data.results[0].content += content;
        }
      });
    },
  }))
);
