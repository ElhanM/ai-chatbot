import { Stack } from 'expo-router';
import React from 'react';

type Props = {
  children: React.ReactNode;
  headerRight?: React.ReactNode | null;
};

const LayoutWrapper = ({ children, headerRight = null }: Props) => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => headerRight,
      }}
    >
      {children}
    </Stack>
  );
};

export default LayoutWrapper;
