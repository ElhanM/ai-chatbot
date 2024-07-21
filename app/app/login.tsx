import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import LoadingSpinner from '@/components/Loading';
import { useAuthStore } from '@/store/useAuthStore';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading, error } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      loading: state.loading,
      error: state.error,
    }))
  );

  // TODO: add form validation
  const handleLogin = async () => {
    await login(email, password);

    if (!error) {
      setEmail('');
      setPassword('');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-8">Login</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Log in" onPress={handleLogin} classNameProp="self-stretch" />
      {/* TODO: Add button to go to register page */}
    </View>
  );
};

export default Login;
