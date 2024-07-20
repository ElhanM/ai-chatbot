import { Stack } from 'expo-router';
import React from 'react';
import ToastManager from 'toastify-react-native';

type Props = {
  children: React.ReactNode;
  headerRight?: React.ReactNode | null;
};

const LayoutWrapper = ({ children, headerRight = null }: Props) => {
  return (
    <>
      <ToastManager
        position={'top'}
        style={{ backgroundColor: '#222' }}
        textStyle={{ color: '#fff' }}
        positionValue={75}
      />
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
    </>
  );
};

export default LayoutWrapper;
