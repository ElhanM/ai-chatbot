import { useConversationsStore } from '@/store/api/useConversationStore';
import { useCreateConversationStore } from '@/store/api/useCreateConversationStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import { useDrawerStore } from '@/store/useDrawerStore';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import Error from './Error';
import Button, { ButtonSize } from './forms/Button';
import LoadingSpinner from './Loading';
import { useGuardStore } from '@/store/useGuardStore';
import BlockLoading from './BlockLoading';

type Props = {
  onClose: () => void;
};

export default function Drawer({ onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;
  const [initalMount, setInitialMount] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const { data, fetchConversations, loading, fetching, limit, offset, reset } =
    useConversationsStore(
      useShallow((state) => ({
        data: state.data,
        fetchConversations: state.fetchConversations,
        loading: state.loading,
        fetching: state.fetching,
        limit: state.limit,
        offset: state.offset,
        reset: state.reset,
      }))
    );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const { createConversation, loading: creatingConversation } = useCreateConversationStore(
    useShallow((state) => ({
      createConversation: state.createConversation,
      loading: state.loading,
    }))
  );

  const { setConversation, conversation } = useSelectedConversationStore(
    useShallow((state) => ({
      setConversation: state.setConversation,
      conversation: state.conversation,
    }))
  );

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  useEffect(() => {
    if (initalMount) {
      setInitialMount(false);
      reset();
      return;
    }
    if (offset === 0) {
      fetchConversations(limit, offset);
    }
  }, [fetchConversations, limit, offset, reset, initalMount]);

  const loadMoreConversations = useCallback(() => {
    if (!fetching) {
      fetchConversations(limit, data?.results?.length || 0);
    }
  }, [fetchConversations, data?.results?.length, fetching, limit]);

  const handleCreateConversation = async () => {
    await createConversation();
  };

  return (
    <View className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75">
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          padding: 16,
        }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl font-bold">Conversations</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {error ? (
          <Error error={error} />
        ) : (
          <>
            {loading ? (
              <LoadingSpinner backgroundColor="bg-grayish" />
            ) : (
              <>
                <FlatList
                  ref={flatListRef}
                  data={data?.results}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    // TODO: extract this to a separate component
                    <Text
                      className={`text-white p-2 mb-2 rounded ${conversation?.id === item.id && 'bg-gray-600'}`}
                      onPress={() => {
                        setConversation(item);
                        onClose();
                      }}
                    >
                      {item.title || 'New Chat'}
                    </Text>
                  )}
                  onEndReached={
                    (data?.results?.length || 0) >= (data?.count || 0)
                      ? undefined
                      : loadMoreConversations
                  }
                  onEndReachedThreshold={0.1}
                  // ListFooterComponent={fetching && !loading ? <BlockLoading /> : null}
                  // If the user scrolls to the bottom really fast, when I use the method above, the loading spinner will show after user reaches the end, and he will have to scroll down again to see the spinner.
                  ListFooterComponent={
                    (data?.results?.length || 0) >= (data?.count || 0) ? undefined : (
                      <BlockLoading />
                    )
                  }
                />
              </>
            )}
          </>
        )}
        <Button
          title="New"
          onPress={handleCreateConversation}
          size={ButtonSize.SMALL}
          disabled={creatingConversation}
          icon={
            creatingConversation ? (
              <LoadingSpinner backgroundColor="bg-transparent" />
            ) : (
              <MaterialIcons name="add" size={24} color="white" />
            )
          }
        />
      </Animated.View>
    </View>
  );
}
