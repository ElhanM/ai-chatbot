import useUserCheck from '@/hooks/useUserCheck';
import { Stack } from 'expo-router';
import React from 'react';
import ToastManager from 'toastify-react-native';

type Props = {
  children: React.ReactNode;
  headerRight?: React.ReactNode | null;
};

const LayoutWrapper = ({ children, headerRight = null }: Props) => {
  useUserCheck();

  return (
    <>
      <ToastManager
        position={'top'}
        style={{
          backgroundColor: '#111',
          padding: 10,
          height: 'auto',
          width: 'auto',
          wordWrap: 'normal',
        }}
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
