import Button from '@/components/forms/Button';
import LoadingSpinner from '@/components/Loading';
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

const Welcome = () => {
  const { loading } = useUserStore(
    useShallow((state) => ({
      loading: state.loading,
    }))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleNavigation = (path: string) => () => {
    router.push(path);
  };

  const buttons = [
    { title: 'Login', path: '/login' },
    { title: 'Register', path: '/register' },
    ...(environment === 'development'
      ? [
          { title: 'Health', path: '/health' },
          { title: 'Protected', path: '/protected' },
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
