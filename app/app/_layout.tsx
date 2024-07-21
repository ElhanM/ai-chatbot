import Avatar from '@/components/Avatar';
import Error from '@/components/Error';
import LayoutWrapper from '@/components/LayoutWrapper';
import LoadingSpinner from '@/components/Loading';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { getUser, setUser } from '@/utils/user';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { useEffect } from 'react';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function RootLayout() {
  const router = useRouter();

  const setUserId = useAuthStore((state) => state.setUserId);
  const userId = useAuthStore((state) => state.user.id);
  // const fetchUserData = useUserStore((state) => state.fetchUserData);
  const { fetchUserData, loading, error } = useUserStore();

  useEffect(() => {
    const checkUser = async () => {
      if (!userId) {
        const storedUser = getUser();
        if (storedUser) {
          setUser(setUserId, storedUser);
          await fetchUserData();
          router.replace('/chats');
        } else {
          router.replace('/welcome');
        }
      }
    };

    checkUser();
  }, [userId, setUserId, router, fetchUserData]);

  console.log({ userId });

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
      </LayoutWrapper>
    </>
  );
}
