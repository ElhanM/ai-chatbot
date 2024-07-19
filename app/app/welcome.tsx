import Button from '@/components/forms/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

const Welcome = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => () => {
    router.push(path);
  };

  const buttons = [
    { title: 'Log in', path: '/login' },
    { title: 'Register', path: '/register' },
    ...(environment === 'development'
      ? [
          { title: 'Health', path: '/health' },
          { title: 'Error', path: '/error' },
          { title: 'Chats', path: '/chats' },
        ]
      : []),
  ];

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-5">Get started</Text>
      {buttons.map(({ title, path }) => (
        <Button
          key={path}
          title={title}
          onPress={handleNavigation(path)}
          classNameProp="self-stretch"
        />
      ))}
    </View>
  );
};

export default Welcome;
