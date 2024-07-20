import * as SecureStore from 'expo-secure-store';

const setUser = (setUserId: (userId: string | null) => void, userId: string | null) => {
  SecureStore.setItem('userId', userId ?? '');
  setUserId(userId);
};

const getUser = () => {
  return SecureStore.getItem('userId');
};

export { getUser, setUser };
