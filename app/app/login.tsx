import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Login Page</Text>
      <Button title="Go to Register" onPress={() => router.push('/register')} />
      <Button title="Go to Chats" onPress={() => router.push('/chats')} />
    </View>
  );
}
