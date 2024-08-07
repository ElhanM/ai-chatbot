import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { getUserFromStorage } from '@/utils/user';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const useUserCheck = () => {
  const { setUserId, userId } = useLoginStore(
    useShallow((state) => ({
      setUserId: state.setUserId,
      userId: state.user.id,
    }))
  );

  useEffect(() => {
    let authUserId = userId;

    if (!authUserId) {
      authUserId = getUserFromStorage();
    }

    // Uset to not allow the user to go back from the header
    // router.replace seems to not work as expected
    // https://github.com/expo/router/discussions/495#discussioncomment-7308082
    while (router.canGoBack()) {
      router.back();
    }

    if (!authUserId) {
      router.replace('/welcome');
    } else {
      setUserId(authUserId);
      router.replace('/chats');
    }
  }, [userId, setUserId]);
};

export default useUserCheck;
