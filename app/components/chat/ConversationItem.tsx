import React from 'react';
import { Text } from 'react-native';

type Props = {
  item: { id: string; title: string };
  conversationId: string | null;
  onPress: () => void;
};

const ConversationItem = ({ item, conversationId, onPress }: Props) => {
  return (
    <Text
      className={`text-white p-2 mb-2 rounded ${conversationId === item.id && 'bg-gray-600'}`}
      onPress={onPress}
    >
      {item.title || 'New Chat'}
    </Text>
  );
};

export default ConversationItem;
