import Error from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { useHealthStore } from '@/store/useHealthStore';
import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';

const Health = () => {
  const { data, error, loading, fetchHealth, counter, increaseCounter, decreaseCounter } =
    useHealthStore();

  useEffect(() => {
    fetchHealth();
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
