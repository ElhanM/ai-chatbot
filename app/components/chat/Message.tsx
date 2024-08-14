import { IMessage, Sender } from '@/store/api/useChatMessagesStore';
import { useLoginStore } from '@/store/useLoginStore';
import React from 'react';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import MessageContent from './message/MessageContent';
import UserAvatar from './message/UserAvatar';

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
          <UserAvatar isUser={false} />
        </View>
      )}
      <MessageContent message={message} isUser={isUser} />
      {isUser && (
        <View className="ml-2">
          <UserAvatar isUser={true} firstLetter={firstLetter} />
        </View>
      )}
    </View>
  );
};

export default Message;
