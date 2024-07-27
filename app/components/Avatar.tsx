import { useClearTokensStore } from '@/store/api/useClearTokensStore';
import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { setUserInStorage } from '@/utils/user';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Toast } from 'toastify-react-native';
import { useShallow } from 'zustand/react/shallow';
import Button, { ButtonSize } from './forms/Button';

const Avatar = () => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const {
    setUserId,
    user: { name },
  } = useLoginStore(
    useShallow((state) => ({
      setUserId: state.setUserId,
      user: state.user,
    }))
  );

  const { clearTokens } = useClearTokensStore(
    useShallow((state) => ({
      clearTokens: state.clearTokens,
    }))
  );

  const { error } = useGuardStore(
    useShallow((state) => ({
      error: state.error,
    }))
  );

  const handlePress = () => {
    setPopoverVisible(!popoverVisible);
  };

  const handleClose = () => {
    setPopoverVisible(false);
  };

  const handleLogout = async () => {
    // TODO: Solve warning on logout
    Toast.info('Logging out...', 'top');
    await clearTokens();
    setUserInStorage(null);
    setUserId(null);
    if (error) {
      Toast.error(error, 'top');
    }
  };

  const firstLetter = name?.charAt(0).toUpperCase();

  return (
    <View className="relative flex items-center justify-center">
      <TouchableOpacity
        className="w-12 h-12 bg-light-black rounded-full flex items-center justify-center"
        onPress={handlePress}
      >
        <Text className="text-white text-xl">{firstLetter}</Text>
      </TouchableOpacity>

      <Modal
        isVisible={popoverVisible}
        onBackdropPress={handleClose}
        onBackButtonPress={handleClose}
        className="flex-1 m-0 justify-start items-end"
      >
        <View className="mt-16 mr-4 bg-light-black p-4 rounded-lg shadow-lg border border-gray-600">
          <Text className="text-xl mb-4 text-white">{name}</Text>
          <View className="flex flex-row justify-between items-center">
            <Button
              title="Logout"
              onPress={() => {
                handleClose();
                handleLogout();
              }}
              size={ButtonSize.SMALL}
              classNameProp="mr-2"
            />
            <Button title="Close" onPress={handleClose} size={ButtonSize.SMALL} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Avatar;
