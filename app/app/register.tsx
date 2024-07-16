import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Register Page</Text>
      <Button title="Go to Login" onPress={() => router.push('/login')} />
    </View>
  );
}
