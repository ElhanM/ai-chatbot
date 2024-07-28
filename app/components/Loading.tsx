import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const SpinnerContainer = styled(View, 'flex-1 justify-center items-center');

type Props = {
  classNameProp?: string;
};

export default function LoadingSpinner({ classNameProp }: Props) {
  return (
    <SpinnerContainer className={`bg-black ${classNameProp}`}>
      <ActivityIndicator size="large" color="#fff" />
    </SpinnerContainer>
  );
}
