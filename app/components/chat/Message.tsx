import { IMessage, Sender } from '@/store/api/useChatMessagesStore';
import { useLoginStore } from '@/store/useLoginStore';
import React from 'react';
import { Text, View, Image } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  message: IMessage;
};

const Message = ({ message }: Props) => {
  const {
    user: { name },
  } = useLoginStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const isUser = message.sender === Sender.User;
  const firstLetter = name?.charAt(0).toUpperCase();

  return (
    <View
      className={`flex flex-row my-2 ${isUser ? 'self-end ml-4' : 'self-start mr-4'} max-w-[80%]`}
    >
      {!isUser && (
        <View className="mr-2">
          <View className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Image source={require('@/assets/images/ai-logo.png')} className="w-6 h-6" />
          </View>
        </View>
      )}
      <View className={`p-2 rounded ${isUser ? 'bg-[#2f2f2f]' : 'bg-[#2f2f2f78]'}`}>
        <Text className="text-base text-white">{message.content}</Text>
        <Text className="text-xs text-gray-400 text-right">
          {new Date(message.createdAt).toLocaleTimeString()}
        </Text>
      </View>
      {isUser && (
        <View className="ml-2">
          <View className="w-8 h-8 bg-light-black rounded-full flex items-center justify-center">
            <Text className="text-white text-lg">{firstLetter}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Message;
