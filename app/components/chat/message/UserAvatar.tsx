import React from 'react';
import { View, Image, Text } from 'react-native';

type Props = {
  isUser: boolean;
  firstLetter?: string;
};

const UserAvatar = ({ isUser, firstLetter }: Props) => {
  return (
    <View
      className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-light-black' : 'bg-white'}`}
    >
      {isUser ? (
        <Text className="text-white text-lg">{firstLetter}</Text>
      ) : (
        <Image source={require('@/assets/images/ai-logo.png')} className="w-6 h-6" />
      )}
    </View>
  );
};

export default UserAvatar;
