import Avatar from '@/components/Avatar';
import LayoutWrapper from '@/components/LayoutWrapper';
import { useDrawerStore } from '@/store/useDrawerStore';
import { useLoginStore } from '@/store/useLoginStore';
import { useUserStore } from '@/store/useUserStore';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function RootLayout() {
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

  const { toggleDrawer } = useDrawerStore(
    useShallow((state) => ({ toggleDrawer: state.toggleDrawer }))
  );

  const devRoutes = environment === 'development' && [
    <Stack.Screen name="health" options={{ title: 'Health' }} key="health" />,
    <Stack.Screen name="protected" options={{ title: 'Protected' }} key="protected" />,
  ];

  return (
    <LayoutWrapper headerRight={userId && !loading && <Avatar />}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="chats"
        options={{
          title: 'Chats',
          headerLeft: () => (
            <TouchableOpacity onPress={toggleDrawer}>
              <MaterialIcons name="menu" color="white" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
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
  );
}
