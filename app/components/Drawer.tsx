import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConversationsStore } from '@/store/api/useConversationStore';
import LoadingSpinner from './Loading';
import { useShallow } from 'zustand/react/shallow';
import Error from './Error';

type Props = {
  onClose: () => void;
};

export default function Drawer({ onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;
  const [initalMount, setInitialMount] = useState(true);

  const { data, fetchConversations, loading, fetching, limit, offset, error, reset } =
    useConversationsStore(
      useShallow((state) => ({
        data: state.data,
        fetchConversations: state.fetchConversations,
        loading: state.loading,
        fetching: state.fetching,
        limit: state.limit,
        offset: state.offset,
        error: state.error,
        reset: state.reset,
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
      // TODO: handle cases where new conversations are added or removed in the middle of pagination
      fetchConversations(limit, offset);
    }
  }, [fetchConversations, limit, offset, reset, initalMount]);

  const loadMoreConversations = useCallback(() => {
    if (!fetching) {
      fetchConversations(limit, data?.results?.length || 0);
    }
  }, [fetchConversations, data?.results?.length, fetching, limit]);

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
              <FlatList
                data={data?.results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text className="text-white mb-2 p-2 rounded">{item.title}</Text>
                )}
                onEndReached={
                  (data?.results?.length || 0) >= (data?.count || 0)
                    ? undefined
                    : loadMoreConversations
                }
                onEndReachedThreshold={0.1}
              />
            )}
            {fetching && !loading && (
              <LoadingSpinner backgroundColor="bg-grayish" classNameProp="mt-1" />
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}
