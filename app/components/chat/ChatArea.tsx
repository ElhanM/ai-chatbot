import LoadingSpinner from '@/components/Loading';
import { useAddMessageStore } from '@/store/api/useAddMessageStore';
import { useChatMessagesStore } from '@/store/api/useChatMessagesStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import { useGuardStore } from '@/store/useGuardStore';
import { getUserFromStorage } from '@/utils/user';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useShallow } from 'zustand/react/shallow';
import BlockLoading from '../BlockLoading';
import Error from '../Error';
import Message from './Message';

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
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    reset();
    fetchMessages(conversationId as string, limit, 0);
  }, [conversationId, fetchMessages, limit, reset]);

  const loadMoreMessages = useCallback(() => {
    if (!fetching) {
      fetchMessages(conversationId as string, limit, data?.results?.length || 0);
    }
  }, [fetchMessages, conversationId, data?.results?.length, fetching, limit]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      Keyboard.dismiss();
      const processedMessage = newMessage.trim().replace(/\n/g, '<br />');
      await addMessage(newMessage, conversationId as string);
      createNewBotMessage();
      getStreamData(processedMessage);
      setNewMessage('');
    }
  };

  // TODO: refactor (code splitting)
  // JavaScript * syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator
  const getStreamData = (processedMessage: string) => {
    const injectScript = `
    (async()=>{
      const response = await fetch('${process.env.EXPO_PUBLIC_API_URL}/api/v1/protected/chats/message/stream/${conversationId}?content=${processedMessage}', {
          method: 'GET',
          responseType: 'stream',
          headers: {
            'Authorization': '${userId}'
          }
      });
  
      async function *streamAsyncIterable(stream) {
          const reader = stream.getReader()
          try {
              while (true) {
                  const {done, value} = await reader.read()
                  if (done) {
                      return
                  }
                  yield value
              }
          } finally {
              reader.releaseLock()
          }
      }
  
      for await(const chunk of streamAsyncIterable(response?.body)) {
          const str = new TextDecoder().decode(chunk, {stream: true});
          window.ReactNativeWebView.postMessage(str);
      }
    })()
    `;
    webviewRef?.current?.injectJavaScript(injectScript);
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
        <>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <View className="flex flex-col w-full h-full">
              <FlatList
                ref={flatListRef}
                data={data?.results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Message message={item} />}
                inverted
                onEndReached={
                  (data?.results?.length || 0) >= (data?.count || 0) ? undefined : loadMoreMessages
                }
                onEndReachedThreshold={0.2}
                ListFooterComponent={
                  (data?.results?.length || 0) >= (data?.count || 0) ? undefined : <BlockLoading />
                }
              />
              <View className="flex flex-row items-center p-2">
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Message AI"
                  className="flex-1 border rounded p-2 bg-[#2f2f2f] text-white"
                  placeholderTextColor={'#9b9b9b'}
                  multiline
                />
                {addMessageLoading ? (
                  <BlockLoading />
                ) : (
                  <TouchableOpacity
                    onPress={handleSendMessage}
                    disabled={newMessage.trim() === ''}
                    className="ml-2"
                  >
                    <MaterialIcons
                      name="send"
                      color={newMessage.trim() === '' ? 'gray' : 'blue'}
                      size={24}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </>
      </View>
    </>
  );
};

export default ChatArea;
