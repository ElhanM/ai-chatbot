import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const SpinnerContainer = styled(View, 'flex-1 justify-center items-center bg-black');

type Props = {
  classNameProp?: string;
};

export default function LoadingSpinner({ classNameProp }: Props) {
  return (
    <SpinnerContainer className={`${classNameProp}`}>
      <ActivityIndicator size="large" color="#fff" />
    </SpinnerContainer>
  );
}
