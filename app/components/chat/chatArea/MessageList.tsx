import BlockLoading from '@/components/BlockLoading';
import React from 'react';
import { FlatList } from 'react-native';
import Message from '../Message';

type Props = {
  data: any;
  loadMoreMessages: () => void;
  flatListRef: React.RefObject<FlatList>;
};

const MessageList = ({ data, loadMoreMessages, flatListRef }: Props) => {
  return (
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
  );
};

export default MessageList;
