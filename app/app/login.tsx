import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import React, { useState } from 'react';
import { View, Text } from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-5">
      <Text className="text-white text-3xl font-bold mb-8">Login</Text>
      <Input placeholder="Username" onChangeText={(text) => setUsername(text)} />
      <Input placeholder="Password" secureTextEntry onChangeText={(text) => setPassword(text)} />
      <Button title="Log in" onPress={handleLogin} classNameProp="self-stretch" />
    </View>
  );
};

export default Login;
