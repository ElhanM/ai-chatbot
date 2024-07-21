import Button from '@/components/forms/Button';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function Chats() {
  const router = useRouter();

  return (
    <View className="bg-black flex-1 justify-center items-center">
      <Text className="text-white text-2xl font-bold mb-8">This is the Chats page.</Text>
      {environment === 'development' && (
        <Button
          title={'Protected'}
          onPress={() => {
            router.push('/protected');
          }}
        />
      )}
    </View>
  );
}
