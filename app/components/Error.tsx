import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import Button, { ButtonSize } from './forms/Button';
import { ErrorCodes } from '@/api';
import { useDrawerStore } from '@/store/useDrawerStore';
import { useResetHandlers } from '@/hooks/useResetHandlers';

type Props = {
  error?: string | null;
};

const Error = ({ error }: Props) => {
  const { errorCode } = useGuardStore(
    useShallow((state) => ({
      errorCode: state.errorCode,
    }))
  );

  const { resetAll } = useResetHandlers();

  useEffect(() => {
    if (errorCode === ErrorCodes.GUARD_FAILURE) {
      resetAll();
    }
  }, [errorCode, resetAll]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <View className="w-[90%] justify-center items-center bg-red-400 rounded-md p-3">
        <Text className="text-white">{error ?? 'Something went wrong'}</Text>
        <Button
          onPress={() => {
            resetAll();
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
