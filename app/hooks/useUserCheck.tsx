import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { useUserStore } from '@/store/useUserStore';
import { getUserFromStorage } from '@/utils/user';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const useUserCheck = () => {
  const { setUserId, userId } = useLoginStore(
    useShallow((state) => ({
      setUserId: state.setUserId,
      userId: state.user.id,
    }))
  );

  const { fetchUserData } = useUserStore(
    useShallow((state) => ({
      fetchUserData: state.fetchUserData,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  // Used to avoid flickering when useEffect runs multiple times
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      if (!userId && !error) {
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUserId(storedUser);
          await fetchUserData();
          if (currentRoute !== '/chats') {
            router.replace('/chats');
          }
          setCurrentRoute('/chats');
        } else {
          if (currentRoute !== '/welcome') {
            router.replace('/welcome');
          }
          setCurrentRoute('/welcome');
        }
      }
    };

    checkUser();
  }, [userId, setUserId, fetchUserData, error]);
};

export default useUserCheck;
