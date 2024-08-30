import ChatArea from '@/components/chat/ChatArea';
import FormDrawer from '@/components/Drawer';
import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useGetLatestConversationStore } from '@/store/api/useGetLatestConversationStore';
import { useSelectedConversationStore } from '@/store/api/useSelectedConversationStore';
import { useDrawerStore } from '@/store/useDrawerStore';
import { useGuardStore } from '@/store/useGuardStore';
import { useUserStore } from '@/store/useUserStore';
import { View } from 'react-native';
import { useAsyncEffect } from 'use-async-effect';
import { useShallow } from 'zustand/react/shallow';

export default function Chats() {
  const { fetchUserData, loading, data } = useUserStore(
    useShallow((state) => ({
      fetchUserData: state.fetchUserData,
      loading: state.loading,
      data: state.data,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  const { isDrawerOpen, toggleDrawer } = useDrawerStore();

  const { conversationId } = useSelectedConversationStore(
    useShallow((state) => ({
      conversationId: state.conversation?.id,
    }))
  );

  const {
    fetchLatestConversation,
    data: latestConversation,
    loading: loadingLatestConversation,
  } = useGetLatestConversationStore(
    useShallow((state) => ({
      fetchLatestConversation: state.fetchLatestConversation,
      data: state.data,
      loading: state.loading,
    }))
  );

  useAsyncEffect(async () => {
    if (!data?.results?.user?.id) {
      await fetchUserData();
    }
  }, []);

  useAsyncEffect(async () => {
    if (!latestConversation?.results?.id && data?.results?.user?.id) {
      await fetchLatestConversation();
    }
  }, [latestConversation?.results?.id, data?.results?.user?.id]);

  if (loading || loadingLatestConversation) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View className="bg-black flex-1 justify-center items-center">
      {conversationId && <ChatArea />}
      {isDrawerOpen && <FormDrawer onClose={toggleDrawer} />}
    </View>
  );
}
