import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import LoadingSpinner from '@/components/Loading';
import { useGuardStore } from '@/store/useGuardStore';
import { useRegisterStore } from '@/store/useRegisterStore';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, loading } = useRegisterStore(
    useShallow((state) => ({
      register: state.register,
      loading: state.loading,
    }))
  );

  const { error } = useGuardStore(useShallow((state) => ({ error: state.error })));

  // TODO: add form validation
  const handleRegister = async () => {
    await register(name, email, password);

    if (!error) {
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-8">Register</Text>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        autoCapitalize="none"
      />
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
      <Button title="Register" onPress={handleRegister} classNameProp="self-stretch" />
      <Link href="/login" className="text-blue-500 mt-5">
        Already have an account? Login
      </Link>
    </View>
  );
};

export default Register;
