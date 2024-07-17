import { useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function Chats() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center">
      <Text>This is the Chats page.</Text>
      <Button title="Go to Login" onPress={() => router.push('/login')} />
    </View>
  );
}
