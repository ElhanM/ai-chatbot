import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Conversation } from './useConversationStore';

interface SelectedConversationState {
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  reset: () => void;
}

const initialState = {
  conversation: null,
};

export const useSelectedConversationStore = create(
  immer<SelectedConversationState>((set) => ({
    ...initialState,
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
    setConversation: (conversation) => {
      set((state) => {
        state.conversation = conversation;
      });
    },
  }))
);
