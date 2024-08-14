import LoadingSpinner from '@/components/Loading';
import { useAddMessageStore } from '@/store/api/useAddMessageStore';
import { useChatMessagesStore } from '@/store/api/useChatMessagesStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import { useGuardStore } from '@/store/useGuardStore';
import { getUserFromStorage } from '@/utils/user';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useShallow } from 'zustand/react/shallow';
import Error from '../Error';
import MessageList from './chatArea/MessageList';
import MessageInput from './chatArea/MessageInput';
import getStreamData from './chatArea/getStreamData';

type Props = {};

const ChatArea = (props: Props) => {
  const userId = getUserFromStorage() || '';
  const {
    data,
    fetchMessages,
    loading,
    fetching,
    limit,
    reset,
    createNewBotMessage,
    updateBotMessage,
  } = useChatMessagesStore(
    useShallow((state) => ({
      data: state.data,
      fetchMessages: state.fetchMessages,
      loading: state.loading,
      fetching: state.fetching,
      limit: state.limit,
      reset: state.reset,
      createNewBotMessage: state.createNewBotMessage,
      updateBotMessage: state.updateBotMessage,
    }))
  );

  const { conversationId } = useSelectedConversationStore(
    useShallow((state) => ({
      conversationId: state.conversation?.id,
    }))
  );

  const { addMessage, loading: addMessageLoading } = useAddMessageStore(
    useShallow((state) => ({
      addMessage: state.addMessage,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const flatListRef = useRef<FlatList>(null);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    reset();
    fetchMessages(conversationId as string, limit, 0);
  }, [conversationId, fetchMessages, limit, reset]);

  const loadMoreMessages = useCallback(() => {
    if (!fetching) {
      fetchMessages(conversationId as string, limit, data?.results?.length || 0);
    }
  }, [fetchMessages, conversationId, data?.results?.length, fetching, limit]);

  const handleSendMessage = async (message: string) => {
    const processedMessage = message.replace(/\n/g, '<br />');
    await addMessage(message, conversationId as string);
    createNewBotMessage();
    getStreamData(processedMessage, conversationId as string, userId, webviewRef);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;
    updateBotMessage(data);
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <WebView
        ref={webviewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/api/v1/health` }}
        onMessage={handleMessage}
      />
      <View className="flex flex-col justify-center items-cente w-full h-full">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <View className="flex flex-col w-full h-full">
            <MessageList
              data={data}
              loadMoreMessages={loadMoreMessages}
              flatListRef={flatListRef}
            />
            <MessageInput onSendMessage={handleSendMessage} loading={addMessageLoading} />
          </View>
        )}
      </View>
    </>
  );
};

export default ChatArea;
