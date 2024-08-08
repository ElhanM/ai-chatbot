import FormDrawer from '@/components/Drawer';
import Error from '@/components/Error';
import Button from '@/components/forms/Button';
import LoadingSpinner from '@/components/Loading';
import { Conversation } from '@/store/api/useConversationStore';
import { useGetLatestConversationStore } from '@/store/api/useGetLatestConversationStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import { useDrawerStore } from '@/store/useDrawerStore';
import { useGuardStore } from '@/store/useGuardStore';
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAsyncEffect } from 'use-async-effect';
import { useShallow } from 'zustand/react/shallow';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

export default function Chats() {
  const { fetchUserData, loading } = useUserStore(
    useShallow((state) => ({
      fetchUserData: state.fetchUserData,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const { isDrawerOpen, toggleDrawer } = useDrawerStore();

  const { conversation, setConversation } = useSelectedConversationStore(
    useShallow((state) => ({
      conversation: state.conversation,
      setConversation: state.setConversation,
    }))
  );

  const {
    fetchLatestConversation,
    data: latestConversation,
    loading: loadingLatestConversation,
    error: errorLatestConversation,
  } = useGetLatestConversationStore(
    useShallow((state) => ({
      fetchLatestConversation: state.fetchLatestConversation,
      data: state.data,
      loading: state.loading,
      error: state.error,
    }))
  );

  useEffect(() => {
    console.log({ conversation });
  }, [conversation]);

  useAsyncEffect(async () => {
    await Promise.all([fetchUserData(), fetchLatestConversation()]);
  }, []);

  useEffect(() => {
    setConversation(latestConversation?.results as Conversation);
  }, [latestConversation, setConversation]);

  if (loading || loadingLatestConversation) {
    return <LoadingSpinner />;
  }

  if (error || errorLatestConversation) {
    return <Error error={error || errorLatestConversation} />;
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
      {isDrawerOpen && <FormDrawer onClose={toggleDrawer} />}
    </View>
  );
}
