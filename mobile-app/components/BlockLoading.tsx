import React from 'react';
import { ActivityIndicator, View } from 'react-native';

type Props = {
  classNameProp?: string;
};

export default function BlockLoading({ classNameProp }: Props) {
  return (
    <View className={`flex items-center justify-center bg-transparent ${classNameProp}`}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
