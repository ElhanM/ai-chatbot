import Avatar from '@/components/Avatar';
import LayoutWrapper from '@/components/LayoutWrapper';
import useUserCheck from '@/hooks/useUserCheck';
import { useLoginStore } from '@/store/useLoginStore';
import { useUserStore } from '@/store/useUserStore';
import { Stack } from 'expo-router';
import ToastManager from 'toastify-react-native';
import { useShallow } from 'zustand/react/shallow';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function RootLayout() {
  useUserCheck();
  const {
    user: { id: userId },
  } = useLoginStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const { loading } = useUserStore(
    useShallow((state) => ({
      loading: state.loading,
    }))
  );

  const devRoutes = environment === 'development' && [
    <Stack.Screen name="health" options={{ title: 'Health' }} key="health" />,
    <Stack.Screen name="protected" options={{ title: 'Protected' }} key="protected" />,
  ];

  return (
    <>
      <ToastManager
        position={'top'}
        style={{ backgroundColor: '#222' }}
        textStyle={{ color: '#fff' }}
        positionValue={75}
      />
      <LayoutWrapper headerRight={userId && !loading && <Avatar />}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="chats" options={{ title: 'Chats' }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Register',
          }}
        />
        {devRoutes}
      </LayoutWrapper>
    </>
  );
}
