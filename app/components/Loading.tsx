// app/app/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const SpinnerContainer = styled(View, 'flex-1 justify-center items-center');

export default function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <ActivityIndicator size="large" color="#000" />
    </SpinnerContainer>
  );
}
