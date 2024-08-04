import Error from '@/components/Error';
import Button from '@/components/forms/Button';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useAsyncEffect } from 'use-async-effect';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function Chats() {
  const { fetchUserData, loading } = useUserStore(
    useShallow((state) => ({
      fetchUserData: state.fetchUserData,
      loading: state.loading,
    }))
  );

  const { userId } = useLoginStore(
    useShallow((state) => ({
      userId: state.user.id,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  useAsyncEffect(async () => {
    if (userId) {
      await fetchUserData();
    }
  }, [fetchUserData, userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error error={error} />;
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
