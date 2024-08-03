import useUserCheck from '@/hooks/useUserCheck';
import { Stack } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';
import ToastManager from 'toastify-react-native';

type Props = {
  children: React.ReactNode;
  headerRight?: React.ReactNode | null;
};

const width = Dimensions.get('window').width;

const LayoutWrapper = ({ children, headerRight = null }: Props) => {
  useUserCheck();

  return (
    <>
      <ToastManager
        position={'top'}
        style={{
          backgroundColor: '#222',
          height: 'auto',
          width: 'auto',
          maxWidth: width - 40,
          wordWrap: 'break-word',
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
