import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';

interface StreamBotResponseState {
  loading: boolean;
  data: string | null;
  streamBotResponse: (conversationId: string, content: string) => Promise<void>;
}

const initialState = {
  data: null,
  loading: false,
};

export const useStreamBotResponseStore = create(
  immer<StreamBotResponseState>((set) => ({
    ...initialState,
    streamBotResponse: async (conversationId: string, content: string) => {
      set({ loading: true, data: null });

      try {
        const response = await axios({
          method: 'get',
          url: `${process.env.EXPO_PUBLIC_API_URL}/api/v1/protected/chats/message/stream/${conversationId}?content=${content}`,
          headers: {
            Authorization: '7c725b1d-f6c9-4407-aa51-f18ebdd3ba7a',
          },
          responseType: 'stream',
        });

        console.log({ response: JSON.stringify(response) });

        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
          set((state) => {
            state.data = result;
          });
        }

        set({ loading: false });
      } catch (error) {
        console.error('Error streaming response:', error);
        set({ loading: false });
      }
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
