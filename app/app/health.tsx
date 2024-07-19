import { useHealthStore } from '@/store/useHealthStore';
import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';

const Health = () => {
  const { message, fetchHealth, counter, increaseCounter, decreaseCounter } = useHealthStore();

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white mb-5">Health Status: {message}</Text>
      <Text className="text-white mb-5">Counter: {counter}</Text>
      <Button title="Increase" onPress={increaseCounter} />
      <Button title="Decrease" onPress={decreaseCounter} />
    </View>
  );
};

export default Health;
