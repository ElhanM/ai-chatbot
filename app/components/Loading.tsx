import React from 'react';
import { ActivityIndicator, View } from 'react-native';

type Props = {
  classNameProp?: string;
  backgroundColor?: string;
};

export default function LoadingSpinner({ classNameProp, backgroundColor = 'bg-black' }: Props) {
  return (
    <View className={`flex-1 justify-center items-center ${backgroundColor} ${classNameProp}`}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
