import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConversationsStore } from '@/store/api/useConversationStore';
import LoadingSpinner from './Loading';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  onClose: () => void;
};

export default function Drawer({ onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

  // TODO: add error handling
  // TODO: clean up and refactor pagination
  // TODO: reset all stores on logout
  const { data, fetchConversations, loading, fetching, limit, offset } = useConversationsStore(
    useShallow((state) => ({
      data: state.data,
      fetchConversations: state.fetchConversations,
      loading: state.loading,
      fetching: state.fetching,
      limit: state.limit,
      offset: state.offset,
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
    if (offset === 0) {
      fetchConversations(limit, offset);
    }
  }, [fetchConversations, limit, offset]);

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
              (data?.results?.length || 0) >= (data?.count || 0) ? undefined : loadMoreConversations
            }
            onEndReachedThreshold={0.1}
          />
        )}
        {fetching && !loading && (
          <LoadingSpinner backgroundColor="bg-grayish" classNameProp="mt-1" />
        )}
      </Animated.View>
    </View>
  );
}
