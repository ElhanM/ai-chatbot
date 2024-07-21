import Avatar from '@/components/Avatar';
import Error from '@/components/Error';
import LayoutWrapper from '@/components/LayoutWrapper';
import LoadingSpinner from '@/components/Loading';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { getUserFromStorage } from '@/utils/user';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function RootLayout() {
  const router = useRouter();

  // most optimal and best way to use zustand is with useShallow
  const {
    setUserId,
    user: { id: userId },
  } = useAuthStore(
    useShallow((state) => ({
      setUserId: state.setUserId,
      user: state.user,
    }))
  );
  const { fetchUserData, loading, error } = useUserStore(
    useShallow((state) => ({
      fetchUserData: state.fetchUserData,
      loading: state.loading,
      error: state.error,
    }))
  );

  useEffect(() => {
    console.log('TRIGGERO SE LIK');
    console.log({ userId });

    const checkUser = async () => {
      if (!userId) {
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUserId(storedUser);
          await fetchUserData();
          router.replace('/chats');
        } else {
          console.log('USO U ELSE');
          router.replace('/welcome');
        }
      }
    };

    checkUser();
  }, [userId, setUserId, router, fetchUserData]);

  useEffect(() => {
    console.log({ userId });
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error error={error} />;
  }

  const devRoutes = environment === 'development' && [
    <Stack.Screen name="health" options={{ title: 'Health' }} key="health" />,
    <Stack.Screen name="error" options={{ title: 'Error' }} key="error" />,
  ];

  const protectedDevRoutes = environment === 'development' && [
    <Stack.Screen name="protected" options={{ title: 'Protected' }} key="protected" />,
  ];

  if (!userId) {
    return (
      <>
        <LayoutWrapper>
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

  return (
    <>
      <LayoutWrapper headerRight={<Avatar />}>
        <Stack.Screen name="chats" options={{ title: 'Chats' }} />
        {protectedDevRoutes}
      </LayoutWrapper>
    </>
  );
}
