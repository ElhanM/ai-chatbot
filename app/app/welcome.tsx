import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const Welcome = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-5">Get started</Text>
      <Button title="Log in" onPress={handleLogin} classNameProp="self-stretch" />
      <Button title="Register" onPress={handleRegister} classNameProp="self-stretch" />
    </View>
  );
};

export default Welcome;
