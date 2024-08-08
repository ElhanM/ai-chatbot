import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import Button, { ButtonSize } from './forms/Button';
import { ErrorCodes } from '@/api';

type Props = {
  error?: string | null;
};

const Error = ({ error }: Props) => {
  const { reset, errorCode } = useGuardStore(
    useShallow((state) => ({
      reset: state.reset,
      errorCode: state.errorCode,
    }))
  );
  const { onGuardFailure } = useLoginStore(
    useShallow((state) => ({ onGuardFailure: state.onGuardFailure }))
  );

  useEffect(() => {
    if (errorCode === ErrorCodes.GUARD_FAILURE) {
      reset();
      onGuardFailure();
    }
  }, [errorCode, onGuardFailure, reset]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <View className="w-[90%] justify-center items-center bg-red-400 rounded-md p-3">
        <Text className="text-white">{error ?? 'Something went wrong'}</Text>
        <Button
          onPress={() => {
            reset();
            onGuardFailure();
          }}
          title="Reset"
          size={ButtonSize.SMALL}
          classNameProp="bg-red-300 rounded-md m-3"
        />
      </View>
    </View>
  );
};

export default Error;
