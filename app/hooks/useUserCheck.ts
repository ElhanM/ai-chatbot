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

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  useEffect(() => {
    console.log('useUserCheck useEffect triggered');
    console.log({ userId });
    const checkUser = async () => {
      if (!userId && !error) {
        const storedUser = getUserFromStorage();
        // Uset to not allow the user to go back from the header
        // router.replace seems to not work as expected
        // https://github.com/expo/router/discussions/495#discussioncomment-7308082
        while (router.canGoBack()) {
          router.back();
        }
        if (storedUser) {
          setUserId(storedUser);
          router.replace('/chats');
        } else {
          router.replace('/welcome');
        }
      }
    };

    checkUser();
  }, [userId, setUserId, error]);
};

export default useUserCheck;
