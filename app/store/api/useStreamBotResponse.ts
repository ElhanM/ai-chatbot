import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import 'react-native-polyfill-globals/auto';
import { fetch as fetchh } from 'react-native-fetch-api';

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
      const response = await fetchh(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/protected/chats/message/stream/${conversationId}?content=${content}`,
        {
          headers: {
            Authorization: '632133e6-c400-43fe-b4c9-357d05cde8ee',
          },
          reactNative: { textStreaming: true },
        }
      );

      async function* streamAsyncIterator(stream: ReadableStream) {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            yield value;
          }
        } finally {
          reader.releaseLock();
        }
      }

      for await (const chunk of streamAsyncIterator(response.body)) {
        const str = new TextDecoder().decode(chunk);
        console.log('Received chunk:', { str });
      }
    },
    reset: () => {
      set(() => ({
        ...initialState,
      }));
    },
  }))
);
