import * as SecureStore from 'expo-secure-store';

const setUserInStorage = (userId: string | null) => {
  SecureStore.setItem('userId', userId ?? '');
};

const getUserFromStorage = () => {
  return SecureStore.getItem('userId');
};

export { setUserInStorage, getUserFromStorage };
