import LoadingSpinner from '@/components/Loading';
import { useChatMessagesStore } from '@/store/api/useChatMessagesStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View, TextInput, TouchableOpacity } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import BlockLoading from '../BlockLoading';
import Message from './Message';
import Error from '../Error';
import { useGuardStore } from '@/store/useGuardStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useAddMessageStore } from '@/store/api/useAddMessageStore';
import { useStreamBotResponseStore } from '@/store/api/useStreamBotResponse';

type Props = {};

const ChatArea = (props: Props) => {
  const { data, fetchMessages, loading, fetching, limit, reset } = useChatMessagesStore(
    useShallow((state) => ({
      data: state.data,
      fetchMessages: state.fetchMessages,
      loading: state.loading,
      fetching: state.fetching,
      limit: state.limit,
      reset: state.reset,
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

  const { streamBotResponse, loading: streamBotResponseLoading } = useStreamBotResponseStore(
    useShallow((state) => ({
      streamBotResponse: state.streamBotResponse,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const flatListRef = useRef<FlatList>(null);
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
      // Add your send message logic here
      setNewMessage((prev) => prev.trim());
      await addMessage(newMessage, conversationId as string);
      await streamBotResponse(conversationId as string, newMessage);
      setNewMessage('');
    }
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <View className="flex flex-col justify-center items-cente w-full h-full">
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
                className="flex-1 border rounded p-2"
                placeholderTextColor={'#9b9b9b'}
                style={{ backgroundColor: '#2f2f2f', color: 'white' }}
              />
              {addMessageLoading || streamBotResponseLoading ? (
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
      </View>
    </>
  );
};

export default ChatArea;
