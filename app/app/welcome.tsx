import Button from '@/components/forms/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const Welcome = () => {
  const router = useRouter();
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleHealth = () => {
    router.push('/health');
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-5">Get started</Text>
      <Button title="Log in" onPress={handleLogin} classNameProp="self-stretch" />
      <Button title="Register" onPress={handleRegister} classNameProp="self-stretch" />
      {environment === 'development' && (
        <Button title="Health" onPress={handleHealth} classNameProp="self-stretch" />
      )}
    </View>
  );
};

export default Welcome;
