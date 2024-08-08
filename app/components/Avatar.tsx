import { useResetHandlers } from '@/hooks/useResetHandlers';
import { useClearTokensStore } from '@/store/api/useClearTokensStore';
import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Toast } from 'toastify-react-native';
import { useShallow } from 'zustand/react/shallow';
import Button, { ButtonSize } from './forms/Button';
import LoadingSpinner from './Loading';

const Avatar = () => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const {
    user: { name },
  } = useLoginStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const { clearTokens, loading } = useClearTokensStore(
    useShallow((state) => ({
      clearTokens: state.clearTokens,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(
    useShallow((state) => ({
      error: state.error,
    }))
  );

  const { resetAll } = useResetHandlers();

  const handlePress = () => {
    setPopoverVisible(!popoverVisible);
  };

  const handleClose = () => {
    setPopoverVisible(false);
  };

  const handleLogout = async () => {
    await clearTokens();
    resetAll();
    if (error) {
      Toast.error(error, 'top');
    }
    handleClose();
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
                handleLogout();
              }}
              size={ButtonSize.SMALL}
              classNameProp="mr-2"
              disabled={loading}
              icon={
                loading ? (
                  <LoadingSpinner classNameProp="bg-transparent w-6" />
                ) : (
                  <MaterialIcons name="logout" color={'white'} size={24} />
                )
              }
            />
            <Button
              title="Close"
              onPress={handleClose}
              size={ButtonSize.SMALL}
              icon={<MaterialIcons name="close" color={'white'} size={24} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Avatar;
