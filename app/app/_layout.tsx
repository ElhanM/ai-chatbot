import Avatar from '@/components/Avatar';
import LayoutWrapper from '@/components/LayoutWrapper';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { getUser, setUser } from '@/utils/user';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const router = useRouter();

  const setUserId = useAuthStore((state) => state.setUserId);
  const userId = useAuthStore((state) => state.user.id);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  useEffect(() => {
    const checkUser = async () => {
      if (!userId) {
        const storedUser = getUser();
        if (storedUser) {
          setUser(setUserId, storedUser);
          await fetchUserData();
        } else {
          router.replace('/login');
        }
      }
    };

    checkUser();
  }, [userId, setUserId, router, fetchUserData]);

  if (!userId) {
    return (
      <>
        <LayoutWrapper>
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
        </LayoutWrapper>
      </>
    );
  }

  return (
    <>
      <LayoutWrapper headerRight={<Avatar />}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="chats" options={{ title: 'Chats' }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="health" options={{ title: 'Health' }} />
        <Stack.Screen name="error" options={{ title: 'Error' }} />
      </LayoutWrapper>
    </>
  );
}
