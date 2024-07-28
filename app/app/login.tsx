import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useLoginStore } from '@/store/useLoginStore';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading } = useLoginStore(
    useShallow((state) => ({
      login: state.login,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  // TODO: add form validation
  // TODO: test error handling (from validation and from server)
  // TODO: test auth workflow
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
        autoCapitalize="none"
      />
      <Button title="Log in" onPress={handleLogin} classNameProp="self-stretch" />
      <Link href="/register" className="text-blue-500 mt-5">
        Don't have an account? Register
      </Link>
    </View>
  );
};

export default Login;
