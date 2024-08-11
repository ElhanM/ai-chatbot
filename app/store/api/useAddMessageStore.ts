import { IResponse } from '@/api';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { makeRequest, RequestMethod } from '../utils/makeRequest';
import { IMessage, useChatMessagesStore } from './useChatMessagesStore';
import { useSelectedConversationStore } from './useSelectedConversationStore';

export interface IAddMessage {
  newUserMessage: IMessage;
  newConvoTitle?: string;
}

interface AddMessageState {
  data: IResponse<IAddMessage> | null;
  loading: boolean;
  addMessage: (content: string, conversationId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  data: null,
  loading: false,
};

export const useAddMessageStore = create(
  immer<AddMessageState>((set) => ({
    ...initialState,
    addMessage: async (content: string, conversationId: string) => {
      await makeRequest({
        endpoint: `/protected/chats/message/${conversationId}`,
        method: RequestMethod.POST,
        set,
        data: {
          content,
        },
      });

      useSelectedConversationStore
        .getState()
        .updateConversationTitle(useAddMessageStore.getState().data?.results.newConvoTitle);
      useChatMessagesStore
        .getState()
        .addOptimisticMessage(
          useAddMessageStore.getState().data?.results.newUserMessage as IMessage
        );
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
