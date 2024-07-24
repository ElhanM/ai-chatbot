import Button from '@/components/forms/Button';
import LoadingSpinner from '@/components/Loading';
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function Chats() {
  const { loading } = useUserStore(
    useShallow((state) => ({
      loading: state.loading,
    }))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

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
