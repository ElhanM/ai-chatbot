import LoadingSpinner from '@/components/Loading';
import { useChatMessagesStore } from '@/store/api/useChatMessagesStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import BlockLoading from '../BlockLoading';
import Message from './Message';
import Error from '../Error';
import { useGuardStore } from '@/store/useGuardStore';

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

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    reset();
    fetchMessages(conversationId as string, limit, 0);
  }, [conversationId, fetchMessages, limit, reset]);

  const loadMoreMessages = useCallback(() => {
    if (!fetching) {
      fetchMessages(conversationId as string, limit, data?.results?.length || 0);
    }
  }, [fetchMessages, conversationId, data?.results?.length, fetching, limit]);

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <View className="flex flex-col justify-center items-center">
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
          </View>
        )}
      </View>
    </>
  );
};

export default ChatArea;
