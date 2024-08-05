import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const SpinnerContainer = styled(View, 'flex-1 justify-center items-center');

type Props = {
  classNameProp?: string;
  backgroundColor?: string;
};

export default function LoadingSpinner({ classNameProp, backgroundColor = 'bg-black' }: Props) {
  return (
    <SpinnerContainer className={`${backgroundColor} ${classNameProp} `}>
      <ActivityIndicator size="large" color="#fff" />
    </SpinnerContainer>
  );
}
