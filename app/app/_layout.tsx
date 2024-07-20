import { Stack } from 'expo-router';
import ToastManager from 'toastify-react-native';

export default function RootLayout() {
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
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="chats" options={{ title: 'Chats' }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="health" options={{ title: 'Health' }} />
        <Stack.Screen name="error" options={{ title: 'Error' }} />
      </Stack>
    </>
  );
}
