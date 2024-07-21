import { useAuthStore } from '@/store/useAuthStore';
import { useGuardStore } from '@/store/useGuardStore';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Text, View } from 'react-native';

type Props = {
  error: string;
};

const Error = ({ error }: Props) => {
  const { errorCode } = useGuardStore(useShallow((state) => ({ errorCode: state.errorCode })));
  const { onGuardFailure } = useAuthStore(
    useShallow((state) => ({ onGuardFailure: state.onGuardFailure }))
  );

  useEffect(() => {
    if (errorCode) {
      onGuardFailure();
    }
  }, [errorCode, onGuardFailure]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white bg-red-400 p-5 rounded-md">{error}</Text>
    </View>
  );
};

export default Error;