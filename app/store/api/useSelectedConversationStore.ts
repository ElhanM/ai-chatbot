import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Conversation } from './useConversationStore';

interface SelectedConversationState {
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  reset: () => void;
  updateConversationTitle: (title?: string) => void;
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
    updateConversationTitle: (title?: string) => {
      set((state) => {
        if (!(state.conversation as Conversation).title) {
          (state.conversation as Conversation).title = title as string;
        }
      });
    },
  }))
);
