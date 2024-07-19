import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  error: string;
};

const Error = ({ error }: Props) => {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white bg-red-400 p-5 rounded-md">{error}</Text>
    </View>
  );
};

export default Error;
