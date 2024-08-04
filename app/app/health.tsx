import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useHealthStore } from '@/store/useHealthStore';
import React from 'react';
import { Button, Text, View } from 'react-native';
import useAsyncEffect from 'use-async-effect';
import { useShallow } from 'zustand/react/shallow';

const Health = () => {
  const { data, loading, fetchHealth, counter, increaseCounter, decreaseCounter } = useHealthStore(
    useShallow((state) => ({
      data: state.data,
      loading: state.loading,
      fetchHealth: state.fetchHealth,
      counter: state.counter,
      increaseCounter: state.increaseCounter,
      decreaseCounter: state.decreaseCounter,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  useAsyncEffect(async () => {
    await fetchHealth();
  }, [fetchHealth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white mb-5">Health Status: {data?.message}</Text>
      <Text className="text-white mb-5">Counter: {counter}</Text>
      <Button title="Increase" onPress={increaseCounter} />
      <Button title="Decrease" onPress={decreaseCounter} />
    </View>
  );
};

export default Health;
